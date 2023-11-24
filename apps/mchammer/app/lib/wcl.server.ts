import process from "node:process";

import type { WCLAuth, WCLOAuthResponse } from "@topplethenun/mchammer-wcl";
import { WclClient } from "@topplethenun/mchammer-wcl";

import { kv } from "#app/lib/kv.server.ts";
import { singleton } from "#app/lib/singleton.server.ts";

async function setWCLAuthentication({
  access_token,
  expires_in,
}: WCLOAuthResponse): Promise<void> {
  const payload: WCLAuth = {
    token: access_token,
    expiresAt: Math.round(Date.now() / 1000) + expires_in,
  };

  await kv.set<WCLAuth>("wcl-auth-token", payload, {
    ex: expires_in,
  });
}

function getWCLAuthentication(): Promise<WCLAuth | null> {
  if (process.env.NODE_ENV === "test") {
    return Promise.resolve({
      token: "mock-token",
      expiresAt: Date.now() + 28 * 24 * 60 * 60 * 1000,
    });
  }

  return kv.get<WCLAuth>("wcl-auth-token");
}

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
