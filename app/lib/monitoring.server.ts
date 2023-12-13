import * as Sentry from "@sentry/remix";

import { prisma } from "~/lib/storage.server.ts";

export function init() {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    tracesSampleRate: ENV.MODE === "production" ? 0.2 : 1.0,
    integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
  });
}
