import type {
  DamageTakenEvents,
  GetPhysicalDamageTakenEventsQueryVariables,
  PlayerDetail,
} from "@topplethenun/mchammer-wcl";
import { damageTakenEventArraySchema } from "@topplethenun/mchammer-wcl";
import { uniqBy } from "lodash-es";

import type { Region } from "#app/constants.ts";
import { findOrCreateCharacter } from "#app/ingest/characters.server.js";
import type {
  IngestedReportDamageTakenEvent,
  IngestedReportFight,
  IngestibleReportDamageTakenEvent,
  ReportDamageTakenEvent,
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedFights,
  ReportWithIngestibleDamageTakenEvents,
} from "#app/ingest/types.ts";
import type { Character } from "#app/lib/db/schema.ts";
import { debug, error, info, warn } from "#app/lib/log.server.ts";
import { type Timings, time } from "#app/lib/timing.server.ts";
import { wcl } from "#app/lib/wcl.server.ts";

interface GetDamageTakenEventsDuringTimestampResult {
  nextPageTimestamp: number | null
  events: DamageTakenEvents
}
async function getDamageTakenEventsDuringTimestamp(queryVariables: GetPhysicalDamageTakenEventsQueryVariables, timings: Timings): Promise<GetDamageTakenEventsDuringTimestampResult> {
  const reportID = queryVariables.reportID;
  debug(
    `Retrieving physical damage taken events taken from ${queryVariables.startTime} to ${queryVariables.endTime} for ${reportID}`,
  );

  const results = await time(
    () => wcl.getPhysicalDamageTakenEvents(queryVariables),
    {
      type: `wcl.getPhysicalDamageTakenEvents(${reportID})`,
      timings,
    },
  );

  const nextPageTimestamp
    = results.reportData?.report?.events?.nextPageTimestamp;
  const parseResults = await time(
    () => damageTakenEventArraySchema.safeParseAsync(results.reportData?.report?.events?.data),
    {
      type: `damageTakenEventArraySchema.safeParseAsync(${reportID})`,
      timings,
    },
  );
  if (!parseResults.success) {
    warn(
      "Unable to parse damage taken events from response",
      parseResults.error.issues,
    );
    return { nextPageTimestamp: null, events: [] };
  }
  info(
    `Loaded and parsed events from ${reportID}. Loading another page: ${Boolean(
      nextPageTimestamp,
    )}`,
  );
  return {
    nextPageTimestamp: nextPageTimestamp ?? null,
    events: parseResults.data,
  };
}

async function getReportDamageTakenEventsForFight(fight: IngestedReportFight, timings: Timings): Promise<ReportDamageTakenEvent[]> {
  let startTime = fight.startTime;
  const endTime = fight.endTime;
  const reportID = fight.reportID;
  let fightDamageTakenEvents: ReportDamageTakenEvent[] = [];

  info(
    `Retrieving physical damage taken events taken from ${startTime} (${fight.absoluteStartTime}) to ${endTime} (${fight.absoluteEndTime}) for ${reportID}`,
  );

  do {
    const { nextPageTimestamp, events }
      = await getDamageTakenEventsDuringTimestamp(
        {
          startTime,
          endTime,
          reportID,
        },
        timings,
      );
    startTime = nextPageTimestamp ?? -1;
    fightDamageTakenEvents = fightDamageTakenEvents.concat(
      events.map<ReportDamageTakenEvent>(event => ({
        ...event,
        reportID: fight.reportID,
        reportRegion: fight.reportRegion,
        fightID: fight.id,
        absoluteTimestamp: fight.reportStartTime + event.timestamp,
      })),
    );
  } while (startTime > 0);

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
    fight =>
      fight.reportID === damageEvent.reportID && fight.id === damageEvent.fight,
  );
  if (!reportFight) {
    throw new Error(
      `Unable to find matching report fight for report ${damageEvent.reportID} and fight ${damageEvent.fight}`,
    );
  }
  const character = reportFight.friendlyPlayerDetails.find(
    player => damageEvent.targetID === player.id,
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
  const reportDamageTakenEventResults = await getReportDamageTakenEvents(
    report,
    timings,
  );
  reportDamageTakenEventResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach(it => error(it.reason));
  const reportDamageTakenEvents = reportDamageTakenEventResults
    .filter(
      (it): it is PromiseFulfilledResult<ReportDamageTakenEvent[]> =>
        it.status === "fulfilled",
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
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach(it => error(it.reason));
  const ingestibleEvents = ingestibleEventResults
    .filter(
      (it): it is PromiseFulfilledResult<IngestibleReportDamageTakenEvent> =>
        it.status === "fulfilled",
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
    character => character.id === damageTakenEvent.character.guid,
  );
  if (!matchingCharacter) {
    throw new Error(
      `Unable to find matching character for character guid ${damageTakenEvent.character.guid} in report ${damageTakenEvent.reportID} fight ${damageTakenEvent.fightID}`,
    );
  }
  return { ...damageTakenEvent, ingestedCharacter: matchingCharacter };
}

async function ingestDamageTakenEventsForReport(report: ReportWithIngestibleDamageTakenEvents, timings: Timings) {
  const allPlayerDetails = report.fights.flatMap(
    it => it.friendlyPlayerDetails,
  );
  const uniquePlayerDetails = uniqBy(
    allPlayerDetails,
    playerDetail => playerDetail.guid,
  );
  const filteredPlayerDetails = uniquePlayerDetails.filter(playerDetails =>
    report.damageTakenEvents.some(
      damageTakenEvent => damageTakenEvent.targetID === playerDetails.id,
    ),
  );

  info(
    `Ingesting players for report ${report.reportID}:`,
    filteredPlayerDetails.length,
  );
  const ingestCharactersResults = await ingestCharacters(
    filteredPlayerDetails,
    report.region,
    timings,
  );
  ingestCharactersResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach(it => error(it.reason));
  const characters = ingestCharactersResults
    .filter(
      (it): it is PromiseFulfilledResult<Character> =>
        it.status === "fulfilled",
    )
    .map(it => it.value)
    .flat();
  info(`Ingested players for report ${report.reportID}:`, characters.length);

  return Promise.allSettled(
    report.damageTakenEvents.map(damageTakenEvent =>
      ingestDamageTakenEvent(damageTakenEvent, characters),
    ),
  );
}

export async function ingestDamageTakenEvents(report: ReportWithIngestedFights, timings: Timings): Promise<ReportWithIngestedDamageTakenEvents> {
  const reportWithIngestibleDamageTakenEvents
    = await addIngestibleDamageTakenEventsToReport(report, timings);

  const ingestedDamageTakenEventsResults
    = await ingestDamageTakenEventsForReport(
      reportWithIngestibleDamageTakenEvents,
      timings,
    );
  ingestedDamageTakenEventsResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach(it => error(it.reason));
  const ingestedDamageTakenEvents = ingestedDamageTakenEventsResults
    .filter(
      (it): it is PromiseFulfilledResult<IngestedReportDamageTakenEvent> =>
        it.status === "fulfilled",
    )
    .map(it => it.value);

  return { ...report, damageTakenEvents: ingestedDamageTakenEvents };
}
