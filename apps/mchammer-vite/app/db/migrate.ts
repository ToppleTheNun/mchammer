import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { db } from "~/lib/db.server.ts";

(async () => {
  console.log("Starting drizzle migrations...");
  migrate(db, { migrationsFolder: "drizzle" });
  console.log("Finished drizzle migrations!");
})().catch(console.error);
