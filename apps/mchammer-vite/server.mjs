import {
  unstable_createViteServer,
  unstable_loadViteServerBuild,
} from "@remix-run/dev";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";
import { wrapExpressCreateRequestHandler } from "@sentry/remix";

installGlobals();

let vite =
  process.env.NODE_ENV === "production"
    ? undefined
    : await unstable_createViteServer();

const app = express();

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
  ? () => unstable_loadViteServerBuild(vite)
  : await import("./build/index.js");

// handle SSR requests
app.all(
  "*",
  createHandler({
    build: handlerBuild,
  }),
);

const port = 3000;
app.listen(port, () => console.log("http://localhost:" + port));
