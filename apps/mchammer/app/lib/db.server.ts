import { createPool } from "@vercel/postgres";
import { drizzle as drizzleVercelPostgresAdapter } from "drizzle-orm/vercel-postgres";

import * as schema from "#app/lib/db/schema.ts";
import { singleton } from "#app/lib/singleton.server.ts";

export const db = singleton("db", () => createPool());

export const drizzle = singleton("drizzle", () =>
  drizzleVercelPostgresAdapter(db, { schema }),
);
