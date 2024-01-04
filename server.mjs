import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import process from "node:process";

import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import { Handlers, wrapExpressCreateRequestHandler } from "@sentry/remix";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import getPort, { portNumbers } from "get-port";
import { blue, bold, cyan, green, yellow } from "kleur/colors";

const MODE = process.env.NODE_ENV;

const start = Date.now();

let viteVersion;
let remixVersion;
if (process.env.NODE_ENV !== "production") {
  // get the vite version from the vite package.json
  viteVersion = JSON.parse(
    readFileSync("node_modules/vite/package.json", { encoding: "utf-8" }),
  ).version;
  remixVersion = JSON.parse(
    readFileSync("node_modules/@remix-run/dev/package.json", {
      encoding: "utf-8",
    }),
  ).version;
}

installGlobals();

const vite =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then(({ createServer }) =>
        createServer({ server: { middlewareMode: true } }),
      );

const app = express();

const getHost = (req) => req.get("X-Forwarded-Host") ?? req.get("host") ?? "";

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
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

app.use(Handlers.requestHandler());
app.use(Handlers.tracingHandler());

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
} else {
  morgan.token("url", (req, res) => decodeURIComponent(req.url ?? ""));
  app.use(
    morgan("tiny", {
      skip: (req, res) =>
        res.statusCode === 200 && req.url?.startsWith("/resources/healthcheck"),
    }),
  );
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}
app.use(express.static("build/client", { maxAge: "1h" }));

// generate a nonce per response
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
          process.env.SENTRY_DSN ? "*.ingest.sentry.io" : null,
          "'self'",
        ].filter(Boolean),
        "font-src": ["'self'"],
        "frame-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "script-src": [
          "'strict-dynamic'",
          "'self'",
          (_, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        "script-src-attr": [(_, res) => `'nonce-${res.locals.cspNonce}'`],
        "upgrade-insecure-requests": null,
      },
    },
  }),
);

const createHandler = vite
  ? createRequestHandler
  : wrapExpressCreateRequestHandler(createRequestHandler);
const handlerBuild = vite
  ? () => vite.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

// handle SSR requests
app.all(
  "*",
  createHandler({
    build: handlerBuild,
    mode: MODE,
    getLoadContext: (req, res) => ({ cspNonce: res.locals.cspNonce }),
  }),
);

const desiredPort = Number(process.env.PORT ?? 3000);
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
});
const remixServer = app.listen(portToUse, () => {
  const addy = remixServer.address();
  const portUsed =
    desiredPort === portToUse
      ? desiredPort
      : addy && typeof addy === "object"
        ? addy.port
        : 0;

  if (portUsed !== desiredPort) {
    console.warn(
      yellow(
        `⚠️  Port ${desiredPort} is not available, using ${portUsed} instead.`,
      ),
    );
  }

  if (MODE === "production") {
    console.log(`remix app is ready: http://localhost:${portUsed}`);
    return;
  }

  const elapsed = Date.now() - start;

  console.log(
    `  ${green(bold("VITE"))} ${green(`v${viteVersion}`)} ${blue(
      bold("Remix"),
    )} ${blue(`v${remixVersion}`)} ready in ${bold(elapsed)} ms`,
  );
  console.log();
  console.log(
    `  ${green(bold("➜"))}  ${bold("Local:")}   ${cyan(
      `http://localhost:${portUsed}`,
    )}`,
  );
  console.log();
});
