import crypto from "node:crypto";
import process from "node:process";

import { createRequestHandler as _createRequestHandler } from "@remix-run/express";
import { installGlobals, type ServerBuild } from "@remix-run/node";
import * as Sentry from "@sentry/remix";
import { ip as ipAddress } from "address";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import rateLimit from "express-rate-limit";
import getPort, { portNumbers } from "get-port";
import helmet from "helmet";
import { bold, cyan, yellow } from "kleur/colors";
import morgan from "morgan";

installGlobals();

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const MODE = process.env.NODE_ENV ?? "development";

const createRequestHandler =
  MODE === "production"
    ? Sentry.wrapExpressCreateRequestHandler(_createRequestHandler)
    : _createRequestHandler;

const viteDevServer =
  MODE === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const app = express();

const getHost = (req: { get: (key: string) => string | undefined }) =>
  req.get("X-Forwarded-Host") ?? req.get("host") ?? "";

// fly is our proxy
app.set("trust proxy", true);

// ensure HTTPS only (X-Forwarded-Proto comes from Fly)
app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto");
  const host = getHost(req);
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});

// no ending slashes for SEO reasons
// https://github.com/epicweb-dev/epic-stack/discussions/108
app.get("*", (req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(302, safepath + query);
  } else {
    next();
  }
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static("build/client", { maxAge: "1h" }));
}

app.get(["/img/*"], (_, res) => {
  // if we made it past the express.static for these, then we're missing something.
  // So we'll just send a 404 and won't bother calling other middleware.
  return res.status(404).send("Not found");
});

morgan.token("url", (req) => decodeURIComponent(req.url ?? ""));
app.use(
  morgan("tiny", {
    skip: (req, res) =>
      res.statusCode === 200 &&
      (req.url.startsWith("/resources/note-images") ||
        req.url.startsWith("/resources/user-images") ||
        req.url.startsWith("/resources/healthcheck")),
  }),
);

app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});

app.use(
  helmet({
    referrerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      // NOTE: Remove reportOnly when you're ready to enforce this CSP
      reportOnly: true,
      directives: {
        "connect-src": [
          MODE === "development" ? "ws:" : null,
          process.env.SENTRY_DSN ? "*.sentry.io" : null,
          "'self'",
        ].filter(Boolean),
        "font-src": ["'self'"],
        "frame-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "script-src": [
          "'strict-dynamic'",
          "'self'",
          // @ts-expect-error locals.cspNonce is available but can't really tell TypeScript that
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (_, res) => `'nonce-${String(res.locals.cspNonce)}'`,
        ],
        "script-src-attr": [
          // @ts-expect-error locals.cspNonce is available but can't really tell TypeScript that
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (_, res) => `'nonce-${String(res.locals.cspNonce)}'`,
        ],
        "upgrade-insecure-requests": null,
      },
    },
  }),
);

// When running tests or running in development, we want to effectively disable
// rate limiting because playwright tests are very fast and we don't want to
// have to wait for the rate limit to reset between tests.
const maxMultiple =
  MODE !== "production" || process.env.PLAYWRIGHT_TEST_BASE_URL ? 10_000 : 1;
const rateLimitDefault = {
  windowMs: 60 * 1000,
  max: 1000 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false,
  // Fly.io prevents spoofing of X-Forwarded-For
  // so no need to validate the trustProxy config
  validate: { trustProxy: false },
};

const strongestRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1000,
  limit: 10 * maxMultiple,
});

const strongRateLimit = rateLimit({
  ...rateLimitDefault,
  windowMs: 60 * 1000,
  limit: 100 * maxMultiple,
});

const generalRateLimit = rateLimit(rateLimitDefault);
app.use((req, res, next) => {
  const strongPaths = [
    "/login",
    "/signup",
    "/verify",
    "/admin",
    "/onboarding",
    "/reset-password",
    "/settings/profile",
    "/resources/login",
    "/resources/verify",
  ];
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (strongPaths.some((p) => req.path.includes(p))) {
      strongestRateLimit(req, res, next);
      return;
    }
    strongRateLimit(req, res, next);
    return;
  }

  generalRateLimit(req, res, next);
});

async function getBuild() {
  const build = viteDevServer
    ? viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : // @ts-expect-error this should exist before running the server
      // but it may not exist just yet.
      await import("../build/server/index.js");
  // not sure how to make this happy 🤷‍♂️
  return build as unknown as ServerBuild;
}

app.all(
  "*",
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  createRequestHandler({
    getLoadContext: (_, res) => ({
      cspNonce: res.locals.cspNonce,
      serverBuild: getBuild(),
    }),
    mode: MODE,
    // @sentry/remix needs to be updated to handle the function signature
    build: MODE === "production" ? await getBuild() : getBuild,
  }),
);

const desiredPort = Number(process.env.PORT ?? 3000);
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
});

const server = app.listen(portToUse, () => {
  const addy = server.address();
  const portUsed =
    desiredPort === portToUse
      ? desiredPort
      : addy && typeof addy === "object"
        ? addy.port
        : 0;

  if (portUsed !== desiredPort) {
    console.warn(
      yellow(
        `⚠️  Port ${String(desiredPort)} is not available, using ${String(portUsed)} instead.`,
      ),
    );
  }
  console.log(`🚀  We have liftoff!`);
  const localUrl = `http://localhost:${String(portUsed)}`;
  let lanUrl: string | null = null;
  const localIp = ipAddress() ?? "Unknown";
  // Check if the address is a private ip
  // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
  // https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${String(portUsed)}`;
  }

  console.log(
    `
${bold("Local:")}            ${cyan(localUrl)}
${lanUrl ? `${bold("On Your Network:")}  ${cyan(lanUrl)}` : ""}
${bold("Press Ctrl+C to stop")}
		`.trim(),
  );
});

closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => {
      e ? reject(e) : resolve("ok");
    });
  });
});
