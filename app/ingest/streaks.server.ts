import { and, eq, gte, lte } from "drizzle-orm";
import { groupBy } from "lodash-es";

import { DIFFERENT_REPORT_TOLERANCE } from "#app/ingest/constants.server.ts";
import type {
  IngestedReportDamageTakenEvent,
  IngestedReportDodgeParryMissStreak,
  IngestedReportFight,
  IngestibleReportDodgeParryMissStreak,
  ReportDodgeParryMissStreak,
  ReportWithIngestedDamageTakenEvents,
  ReportWithIngestedDodgeParryMissStreaks,
  ReportWithIngestedFights,
} from "#app/ingest/types.ts";
import { drizzle } from "#app/lib/db.server.ts";
import { dodgeParryMissStreak } from "#app/lib/db/schema.ts";
import { debug, error, info, warn } from "#app/lib/log.server.ts";
import type { Timings } from "#app/lib/timing.server.ts";
import { time } from "#app/lib/timing.server.ts";
import { isPresent } from "#app/typeGuards.js";
import type { PlayerDetail } from "#app/wcl/schema.server.ts";

const groupDamageTakenEventsByPlayer = (
  damageTakenEvents: IngestedReportDamageTakenEvent[],
): Record<number, IngestedReportDamageTakenEvent[]> =>
  groupBy(damageTakenEvents, (event) => event.targetID);

const groupDamageTakenEventsByFight = (
  damageTakenEvents: IngestedReportDamageTakenEvent[],
): Record<number, IngestedReportDamageTakenEvent[]> =>
  groupBy(damageTakenEvents, (event) => event.fightID);

const isDodge = (event: IngestedReportDamageTakenEvent) => event.hitType === 7;
const isParry = (event: IngestedReportDamageTakenEvent) => event.hitType === 8;
const isMiss = (event: IngestedReportDamageTakenEvent) => event.hitType === 0;

const newStreak = (
  reportFight: IngestedReportFight,
  character: PlayerDetail,
  startTime: number,
): ReportDodgeParryMissStreak => ({
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
});

const getFightStreaks = async (
  reportFight: IngestedReportFight,
  target: PlayerDetail,
  damageTakenEvents: IngestedReportDamageTakenEvent[],
): Promise<ReportDodgeParryMissStreak[]> => {
  const streaks: ReportDodgeParryMissStreak[] = [];
  let currentStreak: ReportDodgeParryMissStreak = newStreak(
    reportFight,
    target,
    reportFight.startTime,
  );

  for (const event of damageTakenEvents) {
    if (!currentStreak.ingestedCharacter) {
      currentStreak.ingestedCharacter = event.ingestedCharacter;
    }

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
};

const getReportStreaks = async (
  report: ReportWithIngestedDamageTakenEvents,
  timings: Timings,
): Promise<ReportDodgeParryMissStreak[]> => {
  let streaks: ReportDodgeParryMissStreak[] = [];

  const eventsByFight = groupDamageTakenEventsByFight(report.damageTakenEvents);
  for (const [fightID, fightEvents] of Object.entries(eventsByFight)) {
    const fight = report.fights.find((it) => it.id === Number(fightID));
    if (!fight) {
      warn(
        `getReportStreaks - Unable to find fight by ID ${fightID} in report ${report.reportID}`,
      );
      continue;
    }

    const eventsByPlayer = groupDamageTakenEventsByPlayer(fightEvents);
    for (const [playerID, playerEvents] of Object.entries(eventsByPlayer)) {
      const playerDetails = fight.friendlyPlayerDetails.find(
        (it) => it.id === Number(playerID),
      );
      if (!playerDetails) {
        warn(
          `getReportStreaks - Unable to find player by ID ${playerID} in report ${report.reportID}`,
        );
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
};

const makeReportStreakIngestible = async (
  reportDodgeParryMissStreak: ReportDodgeParryMissStreak,
  report: ReportWithIngestedFights,
): Promise<IngestibleReportDodgeParryMissStreak> => {
  debug(
    `Trying to ingest D${reportDodgeParryMissStreak.dodge}/P${reportDodgeParryMissStreak.parry}/M${reportDodgeParryMissStreak.miss} for player ${reportDodgeParryMissStreak.character.id}, report ${reportDodgeParryMissStreak.reportID}, and fight ${reportDodgeParryMissStreak.fightID}`,
  );

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
    ingestedFight: ingestedFight.ingestedFight,
    ingestedCharacter,
    absoluteStartTime: report.startTime + reportDodgeParryMissStreak.startTime,
    absoluteEndTime: report.startTime + reportDodgeParryMissStreak.endTime,
  };
};

// const getMinimumAmountToIngest = async (timings: Timings) =>
// SELECT min(streak)
// FROM dodge_parry_miss_streak
// WHERE id IN (SELECT id
// FROM dodge_parry_miss_streak
// ORDER BY streak DESC
// LIMIT 10)


const ingestStreak = async (
  ingestibleStreak: IngestibleReportDodgeParryMissStreak,
  timings: Timings,
): Promise<IngestedReportDodgeParryMissStreak> => {
  const existingStreak = await time(
    () =>
      drizzle.query.dodgeParryMissStreak.findFirst({
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
    info("Streak already ingested, returning existing streak");
    return { ...ingestibleStreak, ingestedStreak: existingStreak };
  }

  debug(
    `Persisting streak D${ingestibleStreak.dodge}/P${ingestibleStreak.parry}/M${ingestibleStreak.miss} from report ${ingestibleStreak.reportID}...`,
  );
  const createdStreaks = await time(
    () =>
      drizzle
        .insert(dodgeParryMissStreak)
        .values({
          report: ingestibleStreak.reportID,
          reportFightId: ingestibleStreak.fightID,
          reportFightRelativeStart: ingestibleStreak.startTime,
          reportFightRelativeEnd: ingestibleStreak.endTime,
          dodge: ingestibleStreak.dodge,
          parry: ingestibleStreak.parry,
          miss: ingestibleStreak.miss,
          streak:
            ingestibleStreak.dodge +
            ingestibleStreak.parry +
            ingestibleStreak.miss,
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
  debug(
    `Persisted streak D${ingestibleStreak.dodge}/P${ingestibleStreak.parry}/M${ingestibleStreak.miss} from report ${ingestibleStreak.reportID} as ${createdStreak.id}`,
  );
  return { ...ingestibleStreak, ingestedStreak: createdStreak };
};

const ingestStreaksForCharacter = async (
  ingestibleStreaks: IngestibleReportDodgeParryMissStreak[],
  timings: Timings,
) =>
  Promise.allSettled(
    ingestibleStreaks.map((streak) => ingestStreak(streak, timings)),
  );

const ingestStreaks = async (
  ingestibleStreaks: IngestibleReportDodgeParryMissStreak[],
  timings: Timings,
) => {
  const grouped = groupBy(
    ingestibleStreaks,
    (streak) => streak.ingestedCharacter.id,
  );

  return Promise.allSettled(
    Object.values(grouped).map((streaks) =>
      ingestStreaksForCharacter(streaks, timings),
    ),
  );
};

export const ingestDodgeParryMissStreaks = async (
  report: ReportWithIngestedDamageTakenEvents,
  timings: Timings,
): Promise<ReportWithIngestedDodgeParryMissStreaks> => {
  const reportStreaks = await time(() => getReportStreaks(report, timings), {
    type: `getIngestibleStreaks(${report.reportID})`,
  });

  debug(`Report ${report.reportID} streaks:`, reportStreaks.length);

  // TODO: get required length in order to be ingested

  const ingestibleStreaksResults = await Promise.allSettled(
    reportStreaks.map((streak) => makeReportStreakIngestible(streak, report)),
  );
  ingestibleStreaksResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => error(it.reason));
  const ingestibleStreaks = ingestibleStreaksResults
    .filter(
      (
        it,
      ): it is PromiseFulfilledResult<IngestibleReportDodgeParryMissStreak> =>
        it.status === "fulfilled",
    )
    .map((it) => it.value);

  debug(
    `Ingestible report ${report.reportID} streaks:`,
    ingestibleStreaks.length,
  );

  const ingestedStreakResults = await ingestStreaks(ingestibleStreaks, timings);
  ingestedStreakResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => error(it.reason));
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
    .forEach((it) => error(it.reason));
  const ingestedStreaks: IngestedReportDodgeParryMissStreak[] = childIngestions
    .filter(
      (it): it is PromiseFulfilledResult<IngestedReportDodgeParryMissStreak> =>
        it.status === "fulfilled",
    )
    .map((it) => it.value);

  debug(`Ingested report ${report.reportID} streaks:`, ingestedStreaks.length);

  return { ...report, dodgeParryMissStreaks: ingestedStreaks };
};
