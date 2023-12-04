import process from "node:process";

import { drizzle as drizzlePostgresJsAdapter } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import postgres from "postgres";

(async () => {
  const pg = postgres(process.env.DATABASE_URL);
  const drizzle = drizzlePostgresJsAdapter(pg);

  console.log("Starting drizzle migrations...");
  await migrate(drizzle, { migrationsFolder: "drizzle" });
  console.log("Finished drizzle migrations!");

  await pg.end({ timeout: 5 });
})().catch(console.error);
