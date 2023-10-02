import { ingestFightsFromReport } from "#app/ingest/fights.server.js";
import type { ReportWithIngestedFights } from "#app/ingest/types.js";
import { debug, error, info } from "#app/lib/log.server.js";
import type { Timings } from "#app/lib/timing.server.js";

export const ingestWarcraftLogsReport = async (
  reportCode: string,
  timings: Timings,
) => {
  info(`Ingesting WCL report: ${reportCode}`);
  let fights: ReportWithIngestedFights;
  try {
    fights = await ingestFightsFromReport(reportCode, timings);
  } catch (e) {
    error(`Unable to ingest WCL report: ${reportCode}`, e);
    return;
  }
  debug(
    `Ingested fights from ${reportCode}:`,
    fights?.fights?.map((fight) => fight.fightID)?.join(", "),
  );
};
