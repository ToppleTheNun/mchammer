import * as Sentry from "@sentry/remix";

export function init() {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.VERCEL_ENV,
    tracesSampleRate: ENV.MODE === "production" ? 0.2 : 1.0,
  });
}
