import { Client, fetchExchange } from "@urql/core";

import type { WCLAuth } from "./auth.server.ts";
import {
  getWCLAuthentication,
  setWCLAuthentication,
  wclOAuthResponseSchema,
} from "./auth.server.ts";

type Cache = {
  client: Client | null;
  expiresAt: number | null;
  pending: boolean;
};

const cache: Cache = {
  client: null,
  expiresAt: null,
  pending: false,
};

const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60;

const mustRefreshToken = (expiresAt: NonNullable<WCLAuth["expiresAt"]>) => {
  const now = Math.floor(Date.now() / 1000);

  return expiresAt <= now || expiresAt - now <= FIVE_DAYS_IN_SECONDS;
};

export const getGqlClient = async (): Promise<Client> => {
  if (
    // in test, `getWLAuthentication` returns mock data
    process.env.NODE_ENV !== "test" &&
    (!process.env.WARCRAFT_LOGS_CLIENT_ID ||
      !process.env.WARCRAFT_LOGS_CLIENT_SECRET)
  ) {
    throw new Error("missing WCL environment variables");
  }

  if (cache.pending) {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    return getGqlClient();
  }

  if (cache.client && cache.expiresAt && !mustRefreshToken(cache.expiresAt)) {
    return cache.client;
  }

  cache.pending = true;
  const persisted = await getWCLAuthentication();

  if (
    persisted?.token &&
    persisted.expiresAt &&
    !mustRefreshToken(persisted.expiresAt) &&
    !cache.client &&
    !cache.expiresAt
  ) {
    cache.client = new Client({
      url: "https://www.warcraftlogs.com/api/v2/client",
      exchanges: [fetchExchange],
      fetchOptions: () => ({
        headers: {
          authorization: `Bearer ${persisted.token}`,
        },
      }),
    });

    cache.expiresAt = persisted.expiresAt * 1000;
    cache.pending = false;

    return cache.client;
  }

  try {
    const body = new URLSearchParams({
      client_id: process.env.WARCRAFT_LOGS_CLIENT_ID,
      client_secret: process.env.WARCRAFT_LOGS_CLIENT_SECRET,
      grant_type: "client_credentials",
    }).toString();

    const response = await fetch("https://www.warcraftlogs.com/oauth/token", {
      body,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      const json = wclOAuthResponseSchema.parse(await response.json());

      await setWCLAuthentication(json);

      cache.client =
        cache.client ??
        new Client({
          url: "https://www.warcraftlogs.com/api/v2/client",
          exchanges: [fetchExchange],
          fetchOptions: () => ({
            headers: {
              authorization: `Bearer ${json.access_token}`,
            },
          }),
        });

      cache.expiresAt = cache.expiresAt ?? Date.now() + json.expires_in;

      return cache.client;
    }

    throw new Error("unable to authenticate with WCL");
  } catch {
    throw new Error("unable to authenticate with WCL");
  }
};
