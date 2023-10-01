import "dotenv/config";

import { error, info } from "#app/lib/log.server.ts";

(async () => {
  info("Starting drizzle seeding...");
  info("Finished drizzle seeing!");
})().catch(error);
