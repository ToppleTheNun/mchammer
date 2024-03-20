import { RemixBrowser } from "@remix-run/react";
import { startTransition,StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

if (ENV.MODE === "production" && ENV.SENTRY_DSN)
  void import("./lib/monitoring.client.ts").then(({ init }) => { init(); });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
