import process from "node:process";

import { remember } from "@epic-web/remember";
import { drizzle as drizzlePostgresJsAdapter } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "redis";

import * as schema from "~/lib/db/schema.ts";

const getPgClient = () => {
  const { DATABASE_URL } = process.env;

  const databaseUrl = new URL(DATABASE_URL);

  const isLocalhost = databaseUrl.hostname === "localhost";

  const PRIMARY_REGION = isLocalhost ? null : process.env.PRIMARY_REGION;
  const FLY_REGION = isLocalhost ? null : process.env.FLY_REGION;

  const isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION;

  if (!isLocalhost) {
    if (databaseUrl.host.endsWith(".internal")) {
      databaseUrl.host = `${FLY_REGION}.${databaseUrl.host}`;
    }

    if (!isReadReplicaRegion) {
      // 5433 is the read-replica port
      databaseUrl.port = "5433";
    }
  }

  const client = postgres(databaseUrl.toString(), { debug: true });
  return drizzlePostgresJsAdapter(client, { schema });
};

export const pg = remember("pg", getPgClient);

export const redis = remember("redis", () =>
  createClient({
    url: process.env.REDIS_URL,
  }),
);
