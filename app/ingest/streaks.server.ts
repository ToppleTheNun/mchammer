import type {
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedDodgeParryMissStreaks,
} from "#app/ingest/types.ts";
import type { Timings } from "#app/lib/timing.server.js";

export const ingestDodgeParryMissStreaks = async (
  report: ReportWithIngestedDamageTakenEvents,
  timings: Timings,
): Promise<ReportWithIngestedDodgeParryMissStreaks> => {
  return { ...report, dodgeParryMissStreaks: [] };
};
