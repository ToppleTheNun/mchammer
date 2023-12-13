import { getLogger } from "~/lib/logger.server.ts";

const ingestLogLogger = getLogger(["ingest", "log"]);

export async function ingestWarcraftLogsReport(reportCode: string) {
  const logger = ingestLogLogger.child({ reportID: reportCode });

  logger.info(`Ingesting WCL report: ${reportCode}`);
  logger.debug(
    {
      numberOfDodgeParryMissStreaks: 0,
    },
    `Ingested dodge/parry/miss streaks`,
  );
}
