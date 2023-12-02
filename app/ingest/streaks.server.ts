import { and, desc, eq, gte, lte } from "drizzle-orm";
import { groupBy } from "lodash-es";

import { DIFFERENT_REPORT_TOLERANCE } from "~/ingest/constants.server.ts";
import type {
  IngestedReportDamageTakenEvent,
  IngestedReportDodgeParryMissStreak,
  IngestedReportFight,
  IngestibleReportDodgeParryMissStreak,
  ReportDodgeParryMissStreak,
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedDodgeParryMissStreaks,
  ReportWithIngestedFights,
} from "~/ingest/types.ts";
import { pg } from "~/lib/storage.server.ts";
import { dodgeParryMissStreak } from "~/lib/db/schema.ts";
import { getLogger } from "~/lib/logger.server.ts";
import type { Timings } from "~/lib/timing.server.ts";
import { time } from "~/lib/timing.server.ts";
import { isPresent } from "~/typeGuards.ts";
import type { PlayerDetail } from "~/wcl/zod.server.ts";

const ingestStreaksLogger = getLogger(["ingest", "streaks"]);

function groupDamageTakenEventsByPlayer(
  damageTakenEvents: IngestedReportDamageTakenEvent[],
): Record<number, IngestedReportDamageTakenEvent[]> {
  return groupBy(damageTakenEvents, (event) => event.targetID);
}

function groupDamageTakenEventsByFight(
  damageTakenEvents: IngestedReportDamageTakenEvent[],
): Record<number, IngestedReportDamageTakenEvent[]> {
  return groupBy(damageTakenEvents, (event) => event.fightID);
}

const isDodge = (event: IngestedReportDamageTakenEvent) => event.hitType === 7;
const isParry = (event: IngestedReportDamageTakenEvent) => event.hitType === 8;
const isMiss = (event: IngestedReportDamageTakenEvent) => event.hitType === 0;

function newStreak(
  reportFight: IngestedReportFight,
  character: PlayerDetail,
  startTime: number,
): ReportDodgeParryMissStreak {
  return {
    reportID: reportFight.reportID,
    reportRegion: reportFight.reportRegion,
    fightID: reportFight.id,
    dodge: 0,
    miss: 0,
    parry: 0,
    startTime,
    endTime: reportFight.endTime,
    character,
    ingestedCharacter: null,
  };
}

async function getFightStreaks(
  reportFight: IngestedReportFight,
  target: PlayerDetail,
  damageTakenEvents: IngestedReportDamageTakenEvent[],
): Promise<ReportDodgeParryMissStreak[]> {
  const streaks: ReportDodgeParryMissStreak[] = [];
  let currentStreak: ReportDodgeParryMissStreak = newStreak(
    reportFight,
    target,
    reportFight.startTime,
  );

  for (const event of damageTakenEvents) {
    if (!currentStreak.ingestedCharacter)
      currentStreak.ingestedCharacter = event.ingestedCharacter;

    if (isDodge(event)) {
      currentStreak.dodge += 1;
    } else if (isMiss(event)) {
      currentStreak.miss += 1;
    } else if (isParry(event)) {
      currentStreak.parry += 1;
    } else {
      currentStreak.endTime = event.timestamp;
      streaks.push(currentStreak);
      currentStreak = newStreak(reportFight, target, event.timestamp);
    }
  }

  currentStreak.endTime = reportFight.endTime;
  streaks.push(currentStreak);

  return streaks.filter(
    (streak) => streak.dodge > 0 || streak.parry > 0 || streak.miss > 0,
  );
}

async function getReportStreaks(
  report: ReportWithIngestedDamageTakenEvents,
  timings: Timings,
): Promise<ReportDodgeParryMissStreak[]> {
  const logger = ingestStreaksLogger.child({ reportID: report.reportID });
  let streaks: ReportDodgeParryMissStreak[] = [];

  const eventsByFight = groupDamageTakenEventsByFight(report.damageTakenEvents);
  for (const [fightID, fightEvents] of Object.entries(eventsByFight)) {
    const fight = report.fights.find((it) => it.id === Number(fightID));
    if (!fight) {
      logger.warn({ fightID }, `Unable to find fight by ID`);
      continue;
    }

    const eventsByPlayer = groupDamageTakenEventsByPlayer(fightEvents);
    for (const [playerID, playerEvents] of Object.entries(eventsByPlayer)) {
      const playerDetails = fight.friendlyPlayerDetails.find(
        (it) => it.id === Number(playerID),
      );
      if (!playerDetails) {
        logger.warn({ playerID }, `Unable to find player by ID`);
        continue;
      }

      const fightStreaks = await time(
        () => getFightStreaks(fight, playerDetails, playerEvents),
        {
          type: `getFightStreaks(${fightID},${playerID})`,
          timings,
        },
      );
      streaks = streaks.concat(fightStreaks);
    }
  }

  return streaks;
}

async function makeReportStreakIngestible(
  reportDodgeParryMissStreak: ReportDodgeParryMissStreak,
  report: ReportWithIngestedFights,
): Promise<IngestibleReportDodgeParryMissStreak> {
  const streak =
    reportDodgeParryMissStreak.dodge +
    reportDodgeParryMissStreak.parry +
    reportDodgeParryMissStreak.miss;
  const logger = ingestStreaksLogger.child({
    reportID: report.reportID,
    fightID: reportDodgeParryMissStreak.fightID,
    streakStartTime: reportDodgeParryMissStreak.startTime,
    streakEndTime: reportDodgeParryMissStreak.endTime,
    character: reportDodgeParryMissStreak.character.guid,
    ingestedCharacter: reportDodgeParryMissStreak.ingestedCharacter?.id,
    dodge: reportDodgeParryMissStreak.dodge,
    parry: reportDodgeParryMissStreak.parry,
    miss: reportDodgeParryMissStreak.miss,
    streak,
  });

  logger.debug("Ingesting");

  const ingestedCharacter = reportDodgeParryMissStreak.ingestedCharacter;
  if (!ingestedCharacter) {
    throw new Error(
      `Unable to ingest streak due to matching character not being found`,
    );
  }

  const ingestedFight = report.fights.find(
    (fight) =>
      fight.reportID === reportDodgeParryMissStreak.reportID &&
      fight.id === reportDodgeParryMissStreak.fightID,
  );
  if (!ingestedFight) {
    throw new Error(
      `Unable to find matching report fight for report ${reportDodgeParryMissStreak.reportID} and fight ${reportDodgeParryMissStreak.fightID}`,
    );
  }

  return {
    ...reportDodgeParryMissStreak,
    streak,
    ingestedFight: ingestedFight.ingestedFight,
    ingestedCharacter,
    absoluteStartTime: report.startTime + reportDodgeParryMissStreak.startTime,
    absoluteEndTime: report.startTime + reportDodgeParryMissStreak.endTime,
  };
}

async function getMinimumStreakLengthToIngest(timings: Timings) {
  const topStreaks = await time(
    () =>
      pg
        .select({
          streak: dodgeParryMissStreak.streak,
        })
        .from(dodgeParryMissStreak)
        .orderBy(desc(dodgeParryMissStreak.streak))
        .limit(25),
    { type: "drizzle.query.streak.findTop", timings },
  );
  if (topStreaks.length === 0) return 0;

  return Math.max(Math.min(...topStreaks.map((streak) => streak.streak)), 0);
}

async function ingestStreak(
  ingestibleStreak: IngestibleReportDodgeParryMissStreak,
  timings: Timings,
): Promise<IngestedReportDodgeParryMissStreak> {
  const streak =
    ingestibleStreak.dodge + ingestibleStreak.parry + ingestibleStreak.miss;
  const logger = ingestStreaksLogger.child({
    reportID: ingestibleStreak.reportID,
    fightID: ingestibleStreak.fightID,
    streakStartTime: ingestibleStreak.startTime,
    streakEndTime: ingestibleStreak.endTime,
    character: ingestibleStreak.character.guid,
    ingestedCharacter: ingestibleStreak.ingestedCharacter?.id,
    dodge: ingestibleStreak.dodge,
    parry: ingestibleStreak.parry,
    miss: ingestibleStreak.miss,
    streak,
  });

  const existingStreak = await time(
    () =>
      pg.query.dodgeParryMissStreak.findFirst({
        where: and(
          eq(dodgeParryMissStreak.fightId, ingestibleStreak.ingestedFight.id),
          gte(
            dodgeParryMissStreak.timestampStart,
            new Date(
              ingestibleStreak.absoluteStartTime - DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          lte(
            dodgeParryMissStreak.timestampStart,
            new Date(
              ingestibleStreak.absoluteStartTime + DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          gte(
            dodgeParryMissStreak.timestampEnd,
            new Date(
              ingestibleStreak.absoluteEndTime - DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          lte(
            dodgeParryMissStreak.timestampEnd,
            new Date(
              ingestibleStreak.absoluteEndTime + DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          eq(
            dodgeParryMissStreak.sourceId,
            ingestibleStreak.ingestedCharacter.id,
          ),
        ),
      }),
    {
      type: "drizzle.query.streak.findFirst",
      timings,
    },
  );
  if (existingStreak) {
    logger.info("Streak already ingested, returning existing streak");
    return { ...ingestibleStreak, ingestedStreak: existingStreak };
  }

  logger.debug("Persisting streak");
  const createdStreaks = await time(
    () =>
      pg
        .insert(dodgeParryMissStreak)
        .values({
          report: ingestibleStreak.reportID,
          reportFightId: ingestibleStreak.fightID,
          reportFightRelativeStart: ingestibleStreak.startTime,
          reportFightRelativeEnd: ingestibleStreak.endTime,
          dodge: ingestibleStreak.dodge,
          parry: ingestibleStreak.parry,
          miss: ingestibleStreak.miss,
          streak: ingestibleStreak.streak,
          timestampStart: new Date(ingestibleStreak.absoluteStartTime),
          timestampEnd: new Date(ingestibleStreak.absoluteEndTime),
          sourceId: ingestibleStreak.ingestedCharacter.id,
          fightId: ingestibleStreak.ingestedFight.id,
        })
        .returning(),
    {
      type: "drizzle.insert(dodgeParryMissStreak)",
      timings,
    },
  );
  if (createdStreaks.length !== 1) {
    throw new Error(
      `Failed to ingest streak D${ingestibleStreak.dodge}/P${ingestibleStreak.parry}/M${ingestibleStreak.miss} from report ${ingestibleStreak.reportID} because createdStreaks.length = ${createdStreaks.length}`,
    );
  }
  const createdStreak = createdStreaks.at(0)!;
  logger.info({ createdStreak: createdStreak.id }, "Persisted streak");
  return { ...ingestibleStreak, ingestedStreak: createdStreak };
}

async function ingestStreaksForCharacter(
  ingestibleStreaks: IngestibleReportDodgeParryMissStreak[],
  timings: Timings,
) {
  return Promise.allSettled(
    ingestibleStreaks.map((streak) => ingestStreak(streak, timings)),
  );
}

async function ingestStreaks(
  ingestibleStreaks: IngestibleReportDodgeParryMissStreak[],
  timings: Timings,
) {
  const grouped = groupBy(
    ingestibleStreaks,
    (streak) => streak.ingestedCharacter.id,
  );

  return Promise.allSettled(
    Object.values(grouped).map((streaks) =>
      ingestStreaksForCharacter(streaks, timings),
    ),
  );
}

export async function ingestDodgeParryMissStreaks(
  report: ReportWithIngestedDamageTakenEvents,
  timings: Timings,
): Promise<ReportWithIngestedDodgeParryMissStreaks> {
  const logger = ingestStreaksLogger.child({ reportID: report.reportID });
  const reportStreaks = await time(() => getReportStreaks(report, timings), {
    type: `getIngestibleStreaks(${report.reportID})`,
  });

  logger.debug(
    { numberOfStreaks: reportStreaks.length },
    `Retrieved ingestible streaks`,
  );

  logger.debug("Fetching minimum streak to ingest");
  const minimumStreakToIngest = await getMinimumStreakLengthToIngest(timings);
  logger.debug({ minimumStreakToIngest }, "Retrieved minimum streak to ingest");

  const ingestibleStreaksResults = await Promise.allSettled(
    reportStreaks.map((streak) => makeReportStreakIngestible(streak, report)),
  );
  ingestibleStreaksResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => logger.error(it.reason));
  const ingestibleStreaks = ingestibleStreaksResults
    .filter(
      (
        it,
      ): it is PromiseFulfilledResult<IngestibleReportDodgeParryMissStreak> =>
        it.status === "fulfilled",
    )
    .map((it) => it.value)
    .filter((it) => it.streak >= minimumStreakToIngest);

  logger.debug(
    { numberOfIngestibleStreaks: ingestibleStreaks.length },
    `Determined ingestible streaks`,
  );

  const ingestedStreakResults = await ingestStreaks(ingestibleStreaks, timings);
  ingestedStreakResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => logger.error(it.reason));
  const childIngestions = ingestedStreakResults
    .filter(
      (
        it,
      ): it is PromiseFulfilledResult<
        PromiseSettledResult<IngestedReportDodgeParryMissStreak>[]
      > => it.status === "fulfilled",
    )
    .map((it) => it.value)
    .flat()
    .filter(isPresent);
  childIngestions
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => logger.error(it.reason));
  const ingestedStreaks: IngestedReportDodgeParryMissStreak[] = childIngestions
    .filter(
      (it): it is PromiseFulfilledResult<IngestedReportDodgeParryMissStreak> =>
        it.status === "fulfilled",
    )
    .map((it) => it.value);

  logger.debug(
    { numberOfIngestedStreaks: ingestedStreaks.length },
    `Ingested report streaks:`,
  );

  return { ...report, dodgeParryMissStreaks: ingestedStreaks };
}