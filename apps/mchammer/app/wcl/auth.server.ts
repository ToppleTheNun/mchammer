import { z } from "zod";

import { kv } from "#app/lib/kv.server.ts";

export const wclOAuthResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().int(),
  token_type: z.literal("Bearer"),
});
export type WCLOAuthResponse = z.infer<typeof wclOAuthResponseSchema>;

export type WCLAuth = {
  token: string;
  expiresAt: number;
};

export const setWCLAuthentication = async ({
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

export const getWCLAuthentication = (): Promise<WCLAuth | null> => {
  if (process.env.NODE_ENV === "test") {
    return Promise.resolve({
      token: "mock-token",
      expiresAt: Date.now() + 28 * 24 * 60 * 60 * 1000,
    });
  }

  return kv.get<WCLAuth>("wcl-auth-token");
};
