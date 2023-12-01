import process from "node:process";

import { remember } from "@epic-web/remember";
import { drizzle as drizzlePostgresJsAdapter } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "redis";

import * as schema from "~/lib/db/schema.ts";

export const pg = remember("pg", () => {
  const client = postgres(process.env.DATABASE_URL, {
    debug: true,
  });
  return drizzlePostgresJsAdapter(client, { schema });
});

export const redis = remember("redis", () =>
  createClient({
    url: process.env.REDIS_URL,
  }));
