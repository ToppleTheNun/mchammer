import { WclClient } from "@topplethenun/mchammer-wcl";

import { kv } from "#app/lib/kv.server.ts";
import { singleton } from "#app/lib/singleton.server.ts";
import type { WCLAuth, WCLOAuthResponse } from "#app/wcl/auth.server.ts";

const setWCLAuthentication = async ({
  access_token,
  expires_in,
}: WCLOAuthResponse): Promise<void> => {
  const payload: WCLAuth = {
    token: access_token,
    expiresAt: Math.round(Date.now() / 1000) + expires_in,
  };

  await kv.set<WCLAuth>("wcl-auth-token", payload, {
    ex: expires_in,
  });
};

const getWCLAuthentication = (): Promise<WCLAuth | null> => {
  if (process.env.NODE_ENV === "test") {
    return Promise.resolve({
      token: "mock-token",
      expiresAt: Date.now() + 28 * 24 * 60 * 60 * 1000,
    });
  }

  return kv.get<WCLAuth>("wcl-auth-token");
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
