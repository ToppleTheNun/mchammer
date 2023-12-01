import { ingestDamageTakenEvents } from '~/ingest/events.server.ts';
import { ingestFightsFromReport } from '~/ingest/fights.server.ts';
import { ingestDodgeParryMissStreaks } from '~/ingest/streaks.server.ts';
import type {
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedDodgeParryMissStreaks,
  ReportWithIngestedFights,
} from '~/ingest/types.ts';
import type { Timings } from '~/lib/timing.server.ts';
import { getLogger } from '~/lib/logger.server.ts';

const ingestLogLogger = getLogger(['ingest', 'log']);

export async function ingestWarcraftLogsReport(reportCode: string, timings: Timings) {
  const logger = ingestLogLogger.child({ reportID: reportCode });

  logger.info(`Ingesting WCL report: ${reportCode}`);
  let fights: ReportWithIngestedFights;
  try {
    fights = await ingestFightsFromReport(reportCode, timings);
  }
  catch (e) {
    logger.error({ err: e }, 'Unable to ingest WCL report');
    return;
  }
  logger.debug(
    { ingestedFights: fights.fights.map(fight => fight.id) },
    'Ingested fights',
  );

  let damageTakenEvents: ReportWithIngestedDamageTakenEvents;
  try {
    damageTakenEvents = await ingestDamageTakenEvents(fights, timings);
  }
  catch (e) {
    logger.error(
      { err: e },
      'Unable to ingest WCL damage taken events for report',
    );
    return;
  }
  logger.debug(
    { numberOfDamageTakenEvents: damageTakenEvents.damageTakenEvents.length },
    'Ingested damage taken events',
  );

  let dodgeParryMissStreaks: ReportWithIngestedDodgeParryMissStreaks;
  try {
    dodgeParryMissStreaks = await ingestDodgeParryMissStreaks(
      damageTakenEvents,
      timings,
    );
  }
  catch (e) {
    logger.error({ err: e }, 'Unable to ingest dodge/parry/miss streaks');
    return;
  }
  logger.debug(
    {
      numberOfDodgeParryMissStreaks:
        dodgeParryMissStreaks.dodgeParryMissStreaks.length,
    },
    `Ingested dodge/parry/miss streaks`,
  );
}
