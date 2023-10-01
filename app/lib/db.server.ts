import { createPool } from "@vercel/postgres";
import { drizzle as drizzleVercelPostgresAdapter } from "drizzle-orm/vercel-postgres";

import { singleton } from "~/lib/singleton.server";

export const db = singleton("db", () => createPool());

export const drizzle = singleton("drizzle", () =>
  drizzleVercelPostgresAdapter(db),
);
