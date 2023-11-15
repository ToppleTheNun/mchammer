import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { singleton } from "~/lib/singleton.server.ts";

export const db = singleton("db", () => {
  const sqlite = new Database("sqlite.db");
  return drizzle(sqlite);
});
