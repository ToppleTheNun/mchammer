import { createPool } from "@vercel/postgres";
import { drizzle as drizzleVercelPostgresAdapter } from "drizzle-orm/vercel-postgres";

import * as schema from "~/lib/db/schema.ts";
import { singleton } from "~/lib/singleton.server.ts";

export const db = singleton("db", () => createPool());

export const drizzle = singleton("drizzle", () =>
  drizzleVercelPostgresAdapter(db, { schema }),
);
