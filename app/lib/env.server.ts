import { z } from "zod";

import { generated } from "#app/env/generated.ts";

const schema = z.object({
  // Client
  BUILD_TIME: z.string(),
  BUILD_TIMESTAMP: z.string(),
  COMMIT_SHA: z.string(),
  SENTRY_DSN: z.string().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),
  VERCEL_ENV: z
    .enum(["development", "preview", "production"])
    .default("development"),
  // Server
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  KV_REST_API_READ_ONLY_TOKEN: z.string(),
  KV_REST_API_TOKEN: z.string(),
  KV_REST_API_URL: z.string().url(),
  KV_URL: z.string().url(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  POSTGRES_USER: z.string(),
  WARCRAFT_LOGS_CLIENT_ID: z.string(),
  WARCRAFT_LOGS_CLIENT_SECRET: z.string(),
});

declare global {
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
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
