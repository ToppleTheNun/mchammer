import { debug, info } from "~/lib/log.server.ts";

export async function ingestWarcraftLogsReport(reportCode: string) {
  info(`Ingesting WCL report: ${reportCode}`);
  debug(`Ingested dodge/parry/miss streaks: 0`);
}
