import { ingestWarcraftLogsReportPrisma } from "#app/ingest/log.server.ts";
import { error, info } from "#app/lib/log.server.ts";
import { getServerTimeHeader, makeTimings } from "#app/lib/timing.server.ts";

(async () => {
  info("Starting Prisma seeding...");
  const timings = makeTimings("prisma seed");
  await ingestWarcraftLogsReportPrisma("wR2PAVQNGcBvr9d1", timings);
  info("Finished Prisma seeing!");
  info("Timings:", getServerTimeHeader(timings));
})().catch(error);
