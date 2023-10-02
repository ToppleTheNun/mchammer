import type {
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedFights,
} from "#app/ingest/types.ts";
import type { Timings } from "#app/lib/timing.server.ts";

export const ingestDamageTakenEvents = async (
  report: ReportWithIngestedFights,
  timings: Timings,
): Promise<ReportWithIngestedDamageTakenEvents> => {
  return { ...report, damageTakenEvents: [] };
};
