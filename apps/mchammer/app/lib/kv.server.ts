import process from "node:process";

import { remember } from "@epic-web/remember";
import { createClient } from "@vercel/kv";

export const kv = remember("kv", () =>
  createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  }));
