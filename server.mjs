import process from "node:process";

import prom from "@isaacs/express-prometheus-middleware";
import { unstable_viteServerBuildModuleId } from "@remix-run/dev";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import { wrapExpressCreateRequestHandler } from "@sentry/remix";
import { pino } from "pino";
import { pinoHttp } from "pino-http";

const logger = pino({ name: "mchammer:server" });

installGlobals();

const vite =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then(({ createServer }) =>
        createServer({ server: { middlewareMode: true } }),
      );

const app = express();
const metricsApp = express();

// http logging
if (process.env.NODE_ENV === "production") app.use(pinoHttp());

app.use(
  prom({ metricsPath: "/metrics", collectDefaultMetrics: true, metricsApp }),
);

app.use((req, res, next) => {
  // helpful headers:
  res.set("x-fly-region", process.env.FLY_REGION ?? "unknown");
  res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

  // /clean-urls/ -> /clean-urls
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
    return;
  }
  next();
});

// if we're not in the primary region, then we need to make sure all
// non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
// Postgres DBs.
// learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
app.all("*", (req, res, next) => {
  const { method, path: pathname } = req;
  const { PRIMARY_REGION, FLY_REGION } = process.env;

  const isMethodReplayable = !["GET", "OPTIONS", "HEAD"].includes(method);
  const isReadOnlyRegion =
    FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION;

  const shouldReplay = isMethodReplayable && isReadOnlyRegion;

  if (!shouldReplay) return next();

  const logInfo = {
    pathname,
    method,
    PRIMARY_REGION,
    FLY_REGION,
  };
  logger.info(logInfo, "Replaying");
  res.set("fly-replay", `region=${PRIMARY_REGION}`);
  return res.sendStatus(409);
});

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
} else {
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" }),
  );
}
app.use(express.static("public", { maxAge: "1h" }));

const createHandler = vite
  ? createRequestHandler
  : wrapExpressCreateRequestHandler(createRequestHandler);
const handlerBuild = vite
  ? () => vite.ssrLoadModule(unstable_viteServerBuildModuleId)
  : await import("./build/index.js");

// handle SSR requests
app.all(
  "*",
  createHandler({
    build: handlerBuild,
  }),
);

app.disable("x-powered-by");

const port = process.env.PORT ?? 3000;
app.listen(port, () => logger.info(`app ready: http://localhost:${port}`));

const metricsPort = process.env.METRICS_PORT || 3010;
metricsApp.listen(metricsPort, () => {
  logger.info(`metrics ready: http://localhost:${metricsPort}/metrics`);
});
