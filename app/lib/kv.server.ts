import { createClient } from "@vercel/kv";

import { singleton } from "#app/lib/singleton.server.ts";

export const kv = singleton("kv", () =>
  createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  }),
);
