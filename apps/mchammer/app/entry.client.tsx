import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

import { reportWebVitalsToVercelAnalytics } from "#app/lib/vitals.client.ts";

if (ENV.MODE === "production" && ENV.SENTRY_DSN)
  import("./lib/monitoring.client.ts").then(({ init }) => init());

function hydrate() {
  return startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
}
else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}

reportWebVitalsToVercelAnalytics();
