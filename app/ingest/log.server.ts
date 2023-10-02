import { ingestFightsFromReport } from "#app/ingest/fights.server.js";
import type {
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedDodgeParryMissStreaks,
  ReportWithIngestedFights,
} from "#app/ingest/types.js";
import { debug, error, info } from "#app/lib/log.server.js";
import type { Timings } from "#app/lib/timing.server.js";
import { ingestDamageTakenEvents } from "#app/ingest/events.server.js";
import { ingestDodgeParryMissStreaks } from "#app/ingest/streaks.server.js";

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
    fights.fights.map((fight) => fight.fightID)?.join(", "),
  );

  let damageTakenEvents: ReportWithIngestedDamageTakenEvents;
  try {
    damageTakenEvents = await ingestDamageTakenEvents(fights, timings);
  } catch (e) {
    error(
      `Unable to ingest WCL damage taken events for report: ${reportCode}`,
      e,
    );
    return;
  }
  debug(
    `Ingested damage taken events from ${reportCode}: `,
    damageTakenEvents.damageTakenEvents.length,
  );

  let dodgeParryMissStreaks: ReportWithIngestedDodgeParryMissStreaks;
  try {
    dodgeParryMissStreaks = await ingestDodgeParryMissStreaks(
      damageTakenEvents,
      timings,
    );
  } catch (e) {
    error(
      `Unable to ingest dodge/parry/miss streaks for report: ${reportCode}`,
      e,
    );
    return;
  }
  debug(
    `Ingested dodge/parry/miss streaks from ${reportCode}: `,
    dodgeParryMissStreaks.dodgeParryMissStreaks.length,
  );
};
