import process from "node:process";

import { z } from "zod";

import { generated } from "~/generated/env.ts";

const schema = z.object({
  // Client
  BUILD_TIME: z.string(),
  BUILD_TIMESTAMP: z.string(),
  COMMIT_SHA: z.string(),
  SENTRY_DSN: z.string().optional(),
  // Server
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PINO_LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  WARCRAFT_LOGS_CLIENT_ID: z.string(),
  WARCRAFT_LOGS_CLIENT_SECRET: z.string(),
});

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse({ ...process.env, ...generated });

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );

    throw new Error("Invalid environment variables");
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    BUILD_TIME: generated.BUILD_TIME,
    BUILD_TIMESTAMP: generated.BUILD_TIMESTAMP,
    COMMIT_SHA: generated.COMMIT_SHA,
    SENTRY_DSN: process.env.SENTRY_DSN,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var ENV: ENV;
  interface Window {
    ENV: ENV
  }
}
