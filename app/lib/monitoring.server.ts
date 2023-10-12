import * as Sentry from "@sentry/remix";

import { prisma } from "#app/lib/db.server.ts";

export function init() {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.VERCEL_ENV,
    tracesSampleRate: ENV.MODE === "production" ? 0.2 : 1.0,
    integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  });
}
