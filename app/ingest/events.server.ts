import { uniqBy } from 'lodash-es';

import type { Region } from '~/constants.ts';
import { findOrCreateCharacter } from '~/ingest/characters.server.js';
import type {
  IngestedReportDamageTakenEvent,
  IngestedReportFight,
  IngestibleReportDamageTakenEvent,
  ReportDamageTakenEvent,
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedFights,
  ReportWithIngestibleDamageTakenEvents,
} from '~/ingest/types.ts';
import type { Character } from '~/lib/db/schema.ts';
import { getLogger } from '~/lib/logger.server.ts';
import { type Timings, time } from '~/lib/timing.server.ts';
import type { DamageTakenEvents, PlayerDetail } from '~/wcl/zod.server.ts';
import { damageTakenEventArraySchema } from '~/wcl/zod.server.ts';
import type { GetPhysicalDamageTakenEventsQueryVariables } from '~/wcl/types.server.ts';
import { getPhysicalDamageTakenEvents } from '~/wcl/wcl.server.ts';

const ingestEventsLogger = getLogger(['ingest', 'events']);

interface GetDamageTakenEventsDuringTimestampResult {
  nextPageTimestamp: number | null
  events: DamageTakenEvents
}
async function getDamageTakenEventsDuringTimestamp(queryVariables: GetPhysicalDamageTakenEventsQueryVariables, timings: Timings): Promise<GetDamageTakenEventsDuringTimestampResult> {
  const reportID = queryVariables.reportID;
  const logger = ingestEventsLogger.child({
    ...queryVariables,
  });

  logger.debug('Retrieving physical damage taken events taken');

  const results = await time(
    () => getPhysicalDamageTakenEvents(queryVariables),
    {
      type: `wcl.getPhysicalDamageTakenEvents(${reportID})`,
      timings,
    },
  );

  const rawEvents = results.reportData?.report?.events?.data;
  const nextPageTimestamp
    = results.reportData?.report?.events?.nextPageTimestamp;
  const parseResults = await time(
    () => damageTakenEventArraySchema.safeParseAsync(rawEvents),
    {
      type: `damageTakenEventArraySchema.safeParseAsync(${reportID})`,
      timings,
    },
  );
  if (!parseResults.success) {
    logger.warn(
      { issues: parseResults.error.issues },
      'Unable to parse damage taken events from response',
    );
    return { nextPageTimestamp: null, events: [] };
  }
  logger.info(
    { loadingAnotherPage: Boolean(nextPageTimestamp) },
    'Loaded and parsed events',
  );
  return {
    nextPageTimestamp: nextPageTimestamp ?? null,
    events: parseResults.data,
  };
}

async function getReportDamageTakenEventsForFight(fight: IngestedReportFight, timings: Timings): Promise<ReportDamageTakenEvent[]> {
  let fightStartTime = fight.startTime;
  const fightEndTime = fight.endTime;
  const reportID = fight.reportID;
  const logger = ingestEventsLogger.child({
    reportID,
    fightID: fight.id,
    ingestedFightID: fight.ingestedFight.id,
    fightStartTime,
    fightEndTime,
  });
  let fightDamageTakenEvents: ReportDamageTakenEvent[] = [];

  logger.info('Retrieving physical damage taken events taken');

  do {
    const { nextPageTimestamp, events }
      = await getDamageTakenEventsDuringTimestamp(
        {
          startTime: fightStartTime,
          endTime: fightEndTime,
          reportID,
        },
        timings,
      );
    fightStartTime = nextPageTimestamp ?? -1;
    fightDamageTakenEvents = fightDamageTakenEvents.concat(
      events.map<ReportDamageTakenEvent>(event => ({
        ...event,
        reportID: fight.reportID,
        reportRegion: fight.reportRegion,
        fightID: fight.id,
        absoluteTimestamp: fight.reportStartTime + event.timestamp,
      })),
    );
  } while (fightStartTime > 0);

  return fightDamageTakenEvents;
}

async function getReportDamageTakenEvents(report: ReportWithIngestedFights, timings: Timings) {
  return Promise.allSettled(
    report.fights.map(fight =>
      getReportDamageTakenEventsForFight(fight, timings),
    ),
  );
}

async function makeReportDamageTakenEventIngestible(damageEvent: ReportDamageTakenEvent, report: ReportWithIngestedFights): Promise<IngestibleReportDamageTakenEvent> {
  const reportFight = report.fights.find(
    fight
    =>
      fight.reportID === damageEvent.reportID && fight.id === damageEvent.fight,
  );
  if (!reportFight) {
    throw new Error(
      `Unable to find matching report fight for report ${damageEvent.reportID} and fight ${damageEvent.fight}`,
    );
  }
  const character = reportFight.friendlyPlayerDetails.find(
    player
    => damageEvent.targetID === player.id,
  );
  if (!character) {
    throw new Error(
      `Unable to find matching target for report ${damageEvent.reportID}, fight ${damageEvent.fight}, character ${damageEvent.targetID}`,
    );
  }
  return {
    ...damageEvent,
    absoluteTimestamp: reportFight.startTime + damageEvent.timestamp,
    ingestedFight: reportFight.ingestedFight,
    character,
  };
}

async function addIngestibleDamageTakenEventsToReport(report: ReportWithIngestedFights, timings: Timings): Promise<ReportWithIngestibleDamageTakenEvents> {
  const reportStartTime = report.startTime;
  const reportEndTime = report.endTime;
  const reportID = report.reportID;
  const logger = ingestEventsLogger.child({
    reportID,
    reportStartTime,
    reportEndTime,
  });

  const reportDamageTakenEventResults = await getReportDamageTakenEvents(
    report,
    timings,
  );
  reportDamageTakenEventResults
    .filter((it): it is PromiseRejectedResult => it.status === 'rejected')
    .forEach(it => logger.error(it.reason));
  const reportDamageTakenEvents = reportDamageTakenEventResults
    .filter(
      (it): it is PromiseFulfilledResult<ReportDamageTakenEvent[]> =>
        it.status === 'fulfilled',
    )
    .reduce<ReportDamageTakenEvent[]>(
      (acc, current) => acc.concat(current.value),
      [],
    );

  const ingestibleEventResults = await Promise.allSettled(
    reportDamageTakenEvents.map(event =>
      makeReportDamageTakenEventIngestible(event, report),
    ),
  );
  ingestibleEventResults
    .filter((it): it is PromiseRejectedResult => it.status === 'rejected')
    .forEach(it => logger.error(it.reason));
  const ingestibleEvents = ingestibleEventResults
    .filter(
      (it): it is PromiseFulfilledResult<IngestibleReportDamageTakenEvent> =>
        it.status === 'fulfilled',
    )
    .map(it => it.value);

  return { ...report, damageTakenEvents: ingestibleEvents };
}

async function ingestCharacters(playerDetails: PlayerDetail[], reportRegion: Region, timings: Timings) {
  return Promise.allSettled(
    playerDetails.map(playerDetail =>
      findOrCreateCharacter(playerDetail, reportRegion, timings),
    ),
  );
}

async function ingestDamageTakenEvent(damageTakenEvent: IngestibleReportDamageTakenEvent, characters: Character[]): Promise<IngestedReportDamageTakenEvent> {
  const matchingCharacter = characters.find(
    character
    => character.id === damageTakenEvent.character.guid,
  );
  if (!matchingCharacter) {
    throw new Error(
      `Unable to find matching character for character guid ${damageTakenEvent.character.guid} in report ${damageTakenEvent.reportID} fight ${damageTakenEvent.fightID}`,
    );
  }
  return { ...damageTakenEvent, ingestedCharacter: matchingCharacter };
}

async function ingestDamageTakenEventsForReport(report: ReportWithIngestibleDamageTakenEvents, timings: Timings) {
  const reportStartTime = report.startTime;
  const reportEndTime = report.endTime;
  const reportID = report.reportID;
  const logger = ingestEventsLogger.child({
    reportID,
    reportStartTime,
    reportEndTime,
  });

  const allPlayerDetails = report.fights.flatMap(
    it
    => it.friendlyPlayerDetails,
  );
  const uniquePlayerDetails = uniqBy(
    allPlayerDetails,
    playerDetail
    => playerDetail.guid,
  );
  const filteredPlayerDetails = uniquePlayerDetails.filter(playerDetails =>
    report.damageTakenEvents.some(
      damageTakenEvent
      => damageTakenEvent.targetID === playerDetails.id,
    ),
  );

  logger.info(
    { numberOfPlayers: filteredPlayerDetails.length },
    'Ingesting players for report',
  );
  const ingestCharactersResults = await ingestCharacters(
    filteredPlayerDetails,
    report.region,
    timings,
  );
  ingestCharactersResults
    .filter((it): it is PromiseRejectedResult => it.status === 'rejected')
    .forEach(it => logger.error(it.reason));
  const characters = ingestCharactersResults
    .filter(
      (it): it is PromiseFulfilledResult<Character> =>
        it.status === 'fulfilled',
    )
    .map(it => it.value)
    .flat();
  logger.info(
    { numberOfPlayers: filteredPlayerDetails.length },
    'Ingested players for report',
  );

  return Promise.allSettled(
    report.damageTakenEvents.map(damageTakenEvent =>
      ingestDamageTakenEvent(damageTakenEvent, characters),
    ),
  );
}

export async function ingestDamageTakenEvents(report: ReportWithIngestedFights, timings: Timings): Promise<ReportWithIngestedDamageTakenEvents> {
  const reportStartTime = report.startTime;
  const reportEndTime = report.endTime;
  const reportID = report.reportID;
  const logger = ingestEventsLogger.child({
    reportID,
    reportStartTime,
    reportEndTime,
  });

  const reportWithIngestibleDamageTakenEvents
    = await addIngestibleDamageTakenEventsToReport(report, timings);

  const ingestedDamageTakenEventsResults
    = await ingestDamageTakenEventsForReport(
      reportWithIngestibleDamageTakenEvents,
      timings,
    );
  ingestedDamageTakenEventsResults
    .filter((it): it is PromiseRejectedResult => it.status === 'rejected')
    .forEach(it => logger.error(it.reason));
  const ingestedDamageTakenEvents = ingestedDamageTakenEventsResults
    .filter(
      (it): it is PromiseFulfilledResult<IngestedReportDamageTakenEvent> =>
        it.status === 'fulfilled',
    )
    .map(it => it.value);

  return { ...report, damageTakenEvents: ingestedDamageTakenEvents };
}
