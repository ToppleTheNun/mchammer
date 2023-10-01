import "dotenv/config";

import { migrate } from "drizzle-orm/vercel-postgres/migrator";

import { drizzle } from "#app/lib/db.server.ts";
import { error, info } from "#app/lib/log.server.ts";

(async () => {
  info("Starting drizzle migrations...");
  await migrate(drizzle, { migrationsFolder: "drizzle" });
  info("Finished drizzle migrations!");
})().catch(error);
