import { migrate } from "drizzle-orm/postgres-js/migrator";

import { pg } from "../app/lib/storage.server.ts";

(async () => {
  console.log("Starting drizzle migrations...");
  await migrate(pg, { migrationsFolder: "drizzle" });
  console.log("Finished drizzle migrations!");
})().catch(console.error);
