import type {
  IngestedReportFight,
  IngestibleReportDamageTakenEvent,
  ReportDamageTakenEvent,
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedFights,
} from "#app/ingest/types.ts";
import { debug, error, info, warn } from "#app/lib/log.server.ts";
import { time, type Timings } from "#app/lib/timing.server.ts";
import { getPhysicalDamageTakenEvents } from "#app/wcl/queries/queries.server.ts";
import {
  damageTakenEventArraySchema,
  type DamageTakenEvents,
} from "#app/wcl/schema.server.ts";
import { type GetPhysicalDamageTakenEventsQueryVariables } from "#app/wcl/types.ts";

type GetDamageTakenEventsDuringTimestampResult = {
  nextPageTimestamp: number | null;
  events: DamageTakenEvents;
};
const getDamageTakenEventsDuringTimestamp = async (
  queryVariables: GetPhysicalDamageTakenEventsQueryVariables,
  timings: Timings,
): Promise<GetDamageTakenEventsDuringTimestampResult> => {
  const reportID = queryVariables.reportID;
  debug(
    `Retrieving physical damage taken events taken from ${queryVariables.startTime} to ${queryVariables.endTime} for ${reportID}`,
  );

  const results = await time(
    () => getPhysicalDamageTakenEvents(queryVariables),
    {
      type: `wcl.query.getPhysicalDamageTakenEvents(${reportID})`,
      timings,
    },
  );

  const rawEvents = results.reportData?.report?.events?.data;
  const nextPageTimestamp =
    results.reportData?.report?.events?.nextPageTimestamp;
  const parseResults = await time(
    () => damageTakenEventArraySchema.safeParseAsync(rawEvents),
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
};

const getReportDamageTakenEventsForFight = async (
  fight: IngestedReportFight,
  timings: Timings,
): Promise<ReportDamageTakenEvent[]> => {
  let startTimestamp = fight.relativeStartTime;
  const endTimestamp = fight.relativeEndTime;
  let fightDamageTakenEvents: ReportDamageTakenEvent[] = [];

  info(
    `Retrieving physical damage taken events taken from ${startTimestamp} (${fight.startTime}) to ${endTimestamp} (${fight.endTime}) for ${fight.report}`,
  );

  do {
    const { nextPageTimestamp, events } =
      await getDamageTakenEventsDuringTimestamp(
        {
          startTime: startTimestamp,
          endTime: endTimestamp,
          reportID: fight.report,
        },
        timings,
      );
    startTimestamp = nextPageTimestamp ?? -1;
    fightDamageTakenEvents = fightDamageTakenEvents.concat(
      events.map<ReportDamageTakenEvent>((event) => ({
        ...event,
        report: fight.report,
        relativeTimestamp: event.timestamp,
      })),
    );
  } while (startTimestamp > 0);

  return fightDamageTakenEvents;
};

const getReportDamageTakenEvents = async (
  report: ReportWithIngestedFights,
  timings: Timings,
) =>
  Promise.allSettled(
    report.fights.map((fight) =>
      getReportDamageTakenEventsForFight(fight, timings),
    ),
  );

const makeReportDamageTakenEventIngestible = (
  damageEvent: ReportDamageTakenEvent,
  report: ReportWithIngestedFights,
): IngestibleReportDamageTakenEvent => {
  const reportFight = report.fights.find(
    (fight) =>
      fight.report === damageEvent.report &&
      fight.fightID === damageEvent.fight,
  );
  if (!reportFight) {
    throw new Error(
      `Unable to find matching report fight for report ${damageEvent.report} and fight ${damageEvent.fight}`,
    );
  }
  const target = reportFight.friendlyPlayerDetails.find(
    (player) => damageEvent.targetID === player.id,
  );
  if (!target) {
    throw new Error(
      `Unable to find matching target for report ${damageEvent.report}, fight ${damageEvent.fight}, target ${damageEvent.targetID}`,
    );
  }
  return {
    ...damageEvent,
    timestamp: reportFight.startTime + damageEvent.timestamp,
    region: reportFight.region,
    ingestedFightId: reportFight.fight.id,
    target,
  };
};

export const ingestDamageTakenEvents = async (
  report: ReportWithIngestedFights,
  timings: Timings,
): Promise<ReportWithIngestedDamageTakenEvents> => {
  const ingestedEventResults = await getReportDamageTakenEvents(
    report,
    timings,
  );
  ingestedEventResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => error(it.reason));

  const ingestedEvents = ingestedEventResults
    .filter(
      (it): it is PromiseFulfilledResult<ReportDamageTakenEvent[]> =>
        it.status === "fulfilled",
    )
    .reduce<ReportDamageTakenEvent[]>(
      (acc, current) => acc.concat(current.value),
      [],
    )
    .map((event) => makeReportDamageTakenEventIngestible(event, report));

  return { ...report, damageTakenEvents: ingestedEvents };
};
