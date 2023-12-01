import { createPool } from "@vercel/postgres";
import { drizzle as drizzleVercelPostgresAdapter } from "drizzle-orm/vercel-postgres";
import { remember } from "@epic-web/remember";
import * as schema from "#app/lib/db/schema.ts";

export const drizzle = remember("drizzle", () =>
  drizzleVercelPostgresAdapter(createPool(), { schema }));
