import process from "node:process";

import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

export const redis = remember("redis", () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  client.connect();
  return client;
});

export const prisma = remember("prisma", () => {
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

  const client = new PrismaClient({
    datasources: { db: { url: databaseUrl.toString() } },
  });
  // connect eagerly
  client.$connect();

  return client;
});
