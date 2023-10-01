import { createClient } from "@vercel/kv";

import { singleton } from "~/lib/singleton.server";

export const kv = singleton("kv", () =>
  createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  }),
);
