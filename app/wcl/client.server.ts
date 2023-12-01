import process from 'node:process';

import { GraphQLClient } from 'graphql-request';

import { getWCLAuthentication, setWCLAuthentication } from '~/wcl/auth.server.ts';
import type { Sdk } from '~/wcl/types.server.ts';
import { getSdk } from '~/wcl/types.server.ts';
import type { WCLAuth } from '~/wcl/zod.server.ts';
import { wclOAuthResponseSchema } from '~/wcl/zod.server.ts';

interface Cache {
  sdk: Sdk | null
  client: GraphQLClient | null
  expiresAt: number | null
  pending: boolean
}

const cache: Cache = {
  sdk: null,
  client: null,
  expiresAt: null,
  pending: false,
};

export async function getCachedSdk(): Promise<Sdk> {
  if (cache.sdk)
    return cache.sdk;

  const client = await getGqlClient();
  cache.sdk = cache.sdk ?? getSdk(client);

  return cache.sdk;
}

const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60;

function mustRefreshToken(expiresAt: NonNullable<WCLAuth['expiresAt']>) {
  const now = Math.floor(Date.now() / 1000);

  return expiresAt <= now || expiresAt - now <= FIVE_DAYS_IN_SECONDS;
}

export async function getGqlClient(): Promise<GraphQLClient> {
  if (
    // in test, `getWCLAuthentication` returns mock data
    process.env.NODE_ENV !== 'test'
    && (!process.env.WARCRAFT_LOGS_CLIENT_ID
    || !process.env.WARCRAFT_LOGS_CLIENT_SECRET)
  )
    throw new Error('missing WCL environment variables');

  if (cache.pending) {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    return getGqlClient();
  }

  if (cache.client && cache.expiresAt && !mustRefreshToken(cache.expiresAt))
    return cache.client;

  cache.pending = true;
  const persisted = await getWCLAuthentication();

  if (
    persisted?.token
    && persisted.expiresAt
    && !mustRefreshToken(persisted.expiresAt)
    && !cache.client
    && !cache.expiresAt
  ) {
    cache.client = new GraphQLClient(
      'https://www.warcraftlogs.com/api/v2/client',
      {
        headers: {
          authorization: `Bearer ${persisted.token}`,
        },
        fetch: globalThis.fetch,
      },
    );

    cache.expiresAt = persisted.expiresAt * 1000;
    cache.pending = false;

    return cache.client;
  }

  try {
    const body = new URLSearchParams({
      client_id: process.env.WARCRAFT_LOGS_CLIENT_ID,
      client_secret: process.env.WARCRAFT_LOGS_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }).toString();

    const response = await fetch('https://www.warcraftlogs.com/oauth/token', {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      const json = await response.json();
      const wclOAuthResponse = await wclOAuthResponseSchema.parseAsync(json);

      await setWCLAuthentication(wclOAuthResponse);

      cache.client
        = cache.client
        ?? new GraphQLClient('https://www.warcraftlogs.com/api/v2/client', {
          headers: {
            authorization: `Bearer ${wclOAuthResponse.access_token}`,
          },
          fetch: globalThis.fetch,
        });

      cache.expiresAt = cache.expiresAt ?? Date.now() + wclOAuthResponse.expires_in;

      return cache.client;
    }

    throw new Error('unable to authenticate with WCL');
  }
  catch {
    throw new Error('unable to authenticate with WCL');
  }
}
