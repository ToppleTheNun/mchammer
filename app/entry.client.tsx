import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HTTPBackend from "i18next-http-backend";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next/client";

import { i18n } from "~/lib/i18n.ts";

if (ENV.MODE === "production" && ENV.SENTRY_DSN)
  void import("./lib/monitoring.client.ts").then(({ init }) => {
    init();
  });

async function hydrate() {
  await i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(LanguageDetector) // Setup a client-side language detector
    .use(HTTPBackend) // Setup your backend
    .init({
      ...i18n, // spread the configuration
      // This function detects the namespaces your routes rendered while SSR use
      ns: getInitialNamespaces(),
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        // you can also use a query parameter in production env to force reloading the translations
        // queryStringParams: { v: "version" },
        customHeaders: {
          "cache-control":
            ENV.MODE === "development"
              ? "no-cache, no-store, must-revalidate"
              : undefined,
        },
      },

      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ["htmlTag"],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (window.requestIdleCallback) {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  window.setTimeout(hydrate, 1);
}
