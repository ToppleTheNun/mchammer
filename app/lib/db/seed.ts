import "dotenv/config";

import { error, info } from "~/lib/log.server";

(async () => {
  info("Starting drizzle seeding...");
  info("Finished drizzle seeing!");
})().catch(error);
