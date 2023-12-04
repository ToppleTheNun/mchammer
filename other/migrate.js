import process from "node:process";

import { drizzle as drizzlePostgresJsAdapter } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import postgres from "postgres";

const pg = postgres(process.env.DATABASE_URL);
const drizzle = drizzlePostgresJsAdapter(pg);

console.log("Starting drizzle migrations...");
await migrate(drizzle, { migrationsFolder: "drizzle" });
console.log("Finished drizzle migrations!");

console.log("Stopping postgres adapter...");
await pg.end({ timeout: 5 });
console.log("Stopped postgres adapter!");
