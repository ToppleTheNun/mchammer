import "dotenv/config";

import { migrate } from "drizzle-orm/vercel-postgres/migrator";

import { drizzle } from "~/lib/db.server";
import { error, info } from "~/lib/log.server";

(async () => {
  info("Starting drizzle migrations...");
  await migrate(drizzle, { migrationsFolder: "drizzle" });
  info("Finished drizzle migrations!");
})().catch(error);
