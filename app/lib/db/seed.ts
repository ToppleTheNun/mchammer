import "dotenv/config";

import { ingestFightsFromReport } from "#app/ingest/fights.server.ts";
import { error, info } from "#app/lib/log.server.ts";
import { makeTimings } from "#app/lib/timing.server.ts";

(async () => {
  info("Starting drizzle seeding...");
  const timings = makeTimings("drizzle seed");
  await ingestFightsFromReport("wR2PAVQNGcBvr9d1", timings);
  info("Finished drizzle seeing!");
})().catch(error);
