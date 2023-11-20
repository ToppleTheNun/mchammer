import type { WCLAuth, WCLOAuthResponse } from "@topplethenun/mchammer-wcl";
import { wclAuthSchema, WclClient } from "@topplethenun/mchammer-wcl";

import { singleton } from "~/lib/singleton.server.ts";
import { redis } from "~/lib/storage.server.ts";

const setWCLAuthentication = async ({
  access_token,
  expires_in,
}: WCLOAuthResponse): Promise<void> => {
  await redis.hSet("wcl-auth-token", "token", access_token);
  await redis.hSet(
    "wcl-auth-token",
    "expiresAt",
    Math.round(Date.now() / 1000) + expires_in,
  );
};

const getWCLAuthentication = async (): Promise<WCLAuth | null> => {
  if (process.env.NODE_ENV === "test") {
    return Promise.resolve({
      token: "mock-token",
      expiresAt: Date.now() + 28 * 24 * 60 * 60 * 1000,
    });
  }

  const result = await redis.hGetAll("wcl-auth-token");
  return wclAuthSchema.parseAsync(result);
};

export const wcl = singleton(
  "wcl",
  () =>
    new WclClient({
      clientId: process.env.WARCRAFT_LOGS_CLIENT_ID,
      clientSecret: process.env.WARCRAFT_LOGS_CLIENT_SECRET,
      getWCLAuthentication,
      setWCLAuthentication,
    }),
);
