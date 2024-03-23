import process from "node:process";

import { GraphQLClient } from "graphql-request";

import { cache, cachified } from "~/lib/cache.server.ts";
import type {
  CacheableQueryOptions,
  Timeable,
} from "~/lib/query/types.server.ts";
import type { Sdk } from "~/lib/wcl/types.server.ts";
import { getSdk } from "~/lib/wcl/types.server.ts";
import {
  type WCLAuth,
  wclAuthSchema,
  wclOAuthResponseSchema,
} from "~/lib/wcl/zod.server.ts";

interface WclClientCache {
  sdk: Sdk | null;
  client: GraphQLClient | null;
  expiresAt: number | null;
  pending: boolean;
}

const wclClientCache: WclClientCache = {
  sdk: null,
  client: null,
  expiresAt: null,
  pending: false,
};

export async function getCachedSdk({ timings }: Timeable): Promise<Sdk> {
  if (wclClientCache.sdk) {
    return wclClientCache.sdk;
  }

  const client = await getGqlClient({ timings });
  wclClientCache.sdk = getSdk(client);

  return wclClientCache.sdk;
}

const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60;

function mustRefreshToken(expiresAt: NonNullable<WCLAuth["expiresAt"]>) {
  const now = Math.floor(Date.now() / 1000);

  return expiresAt <= now || expiresAt - now <= FIVE_DAYS_IN_SECONDS;
}

async function retrieveWclAuthToken() {
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

  if (!response.ok) {
    throw new Error("unable to authenticate with WCL");
  }

  const json = await response.json();
  return await wclOAuthResponseSchema.parseAsync(json);
}

async function getWclAuthorization({
  forceFresh,
  timings,
}: CacheableQueryOptions) {
  return await cachified({
    key: "wcl:authorization",
    cache,
    forceFresh,
    timings,
    getFreshValue: async () => {
      const wclOAuthResponse = await retrieveWclAuthToken();
      return {
        token: wclOAuthResponse.access_token,
        expiresAt: Math.round(Date.now() / 1000) + wclOAuthResponse.expires_in,
      };
    },
    checkValue: wclAuthSchema,
    // Time To Live (ttl) in milliseconds: the cached value is considered valid for 24 hours
    ttl: 1000 * 60 * 60 * 24,
    // Stale While Revalidate (swr) in milliseconds: if the cached value is less than 5 days
    // expired, return it while fetching a fresh value in the background
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 5,
  });
}

export async function getGqlClient({
  timings,
}: Timeable): Promise<GraphQLClient> {
  if (
    // in test, `getWCLAuthentication` returns mock data
    process.env.NODE_ENV !== "test" &&
    (!process.env.WARCRAFT_LOGS_CLIENT_ID ||
      !process.env.WARCRAFT_LOGS_CLIENT_SECRET)
  )
    throw new Error("missing WCL environment variables");

  if (wclClientCache.pending) {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    return getGqlClient({ timings });
  }

  if (
    wclClientCache.client &&
    wclClientCache.expiresAt &&
    !mustRefreshToken(wclClientCache.expiresAt)
  ) {
    return wclClientCache.client;
  }

  wclClientCache.pending = true;
  const persisted = await getWclAuthorization({ timings });

  if (
    persisted.token &&
    persisted.expiresAt &&
    !mustRefreshToken(persisted.expiresAt) &&
    !wclClientCache.client &&
    !wclClientCache.expiresAt
  ) {
    wclClientCache.client = new GraphQLClient(
      "https://www.warcraftlogs.com/api/v2/client",
      {
        headers: {
          authorization: `Bearer ${persisted.token}`,
        },
        fetch: globalThis.fetch,
      },
    );

    wclClientCache.expiresAt = persisted.expiresAt * 1000;
    wclClientCache.pending = false;

    return wclClientCache.client;
  }

  try {
    const forceFreshed = await getWclAuthorization({
      forceFresh: true,
      timings,
    });

    wclClientCache.client =
      wclClientCache.client ??
      new GraphQLClient("https://www.warcraftlogs.com/api/v2/client", {
        headers: {
          authorization: `Bearer ${forceFreshed.token}`,
        },
        fetch: globalThis.fetch,
      });

    wclClientCache.expiresAt ??= forceFreshed.expiresAt;

    return wclClientCache.client;
  } catch {
    throw new Error("unable to authenticate with WCL");
  }
}
