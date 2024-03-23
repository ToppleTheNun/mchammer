import { resolve } from "node:path";
import process from "node:process";
import { PassThrough } from "node:stream";

import type {
  ActionFunctionArgs,
  AppLoadContext,
  EntryContext,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { createInstance } from "i18next";
import FSBackend from "i18next-fs-backend";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";

import { serverTiming } from "~/lib/constants.ts";
import { getEnv, init } from "~/lib/env.server.ts";
import { i18n } from "~/lib/i18n.ts";
import { i18next } from "~/lib/i18next.server.ts";
import { getInstanceInfo } from "~/lib/litefs.server.ts";
import { NonceProvider } from "~/lib/nonce-provider.ts";
import { makeTimings } from "~/lib/timing.server.ts";

const ABORT_DELAY = 5_000;

init();
globalThis.ENV = getEnv();

if (ENV.MODE === "production" && ENV.SENTRY_DSN) {
  void import("./lib/monitoring.server.ts").then(({ init }) => {
    init();
  });
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const { currentInstance, primaryInstance } = await getInstanceInfo();
  responseHeaders.set("fly-region", process.env.FLY_REGION ?? "unknown");
  responseHeaders.set("fly-app", process.env.FLY_APP_NAME ?? "unknown");
  responseHeaders.set("fly-primary-instance", primaryInstance);
  responseHeaders.set("fly-instance", currentInstance);

  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const i18nInstance = createInstance();
  // Then we could detect locale from the request
  const lng = await i18next.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  const ns = i18next.getRouteNamespaces(remixContext);

  await i18nInstance
    .use(initReactI18next)
    .use(FSBackend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  const nonce = String(loadContext.cspNonce);
  return new Promise((resolve, reject) => {
    let didError = false;
    // NOTE: this timing will only include things that are rendered in the shell
    // and will not include suspended components and deferred loaders
    const timings = makeTimings("render", "renderToPipeableStream");

    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <I18nextProvider i18n={i18nInstance}>
          <RemixServer context={remixContext} url={request.url} />
        </I18nextProvider>
      </NonceProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");

          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          responseHeaders.append(serverTiming, timings.toString());
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError: (err: unknown) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(err);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
        nonce,
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export async function handleDataRequest(response: Response) {
  const { currentInstance, primaryInstance } = await getInstanceInfo();
  response.headers.set("fly-region", process.env.FLY_REGION ?? "unknown");
  response.headers.set("fly-app", process.env.FLY_APP_NAME ?? "unknown");
  response.headers.set("fly-primary-instance", primaryInstance);
  response.headers.set("fly-instance", currentInstance);

  return response;
}

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
  if (error instanceof Error) {
    void Sentry.captureRemixServerException(error, "remix.server", request);
  } else {
    Sentry.captureException(error);
  }
}
