import process from "node:process";

import { drizzle as drizzlePostgresJsAdapter } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "redis";

import * as schema from "~/lib/db/schema.ts";
import { singleton } from "~/lib/singleton.server.ts";

export const pg = singleton("pg", () => {
  const client = postgres(process.env.DATABASE_URL, {
    debug: true,
  });
  return drizzlePostgresJsAdapter(client, { schema });
});

export const redis = singleton("redis", () =>
  createClient({
    url: process.env.REDIS_URL,
  }));
