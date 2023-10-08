import { and, eq, gte, lte } from "drizzle-orm";
import { groupBy } from "lodash-es";

import { findOrCreateCharacter } from "#app/ingest/characters.server.js";
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
  groupBy(damageTakenEvents, (event) => event.fight);

const isDodge = (event: IngestedReportDamageTakenEvent) => event.hitType === 7;
const isParry = (event: IngestedReportDamageTakenEvent) => event.hitType === 8;
const isMiss = (event: IngestedReportDamageTakenEvent) => event.hitType === 0;

const newStreak = (
  reportFight: IngestedReportFight,
  target: PlayerDetail,
): ReportDodgeParryMissStreak => ({
  dodge: 0,
  miss: 0,
  parry: 0,
  relativeTimestampStart: reportFight.relativeStartTime,
  relativeTimestampEnd: reportFight.relativeEndTime,
  report: reportFight.report,
  target,
  fight: reportFight.fight.id,
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
  );

  for (const event of damageTakenEvents) {
    if (isDodge(event)) {
      currentStreak.dodge += 1;
    } else if (isMiss(event)) {
      currentStreak.miss += 1;
    } else if (isParry(event)) {
      currentStreak.parry += 1;
    } else {
      currentStreak.relativeTimestampEnd = event.relativeTimestamp;
      streaks.push(currentStreak);
      currentStreak = newStreak(reportFight, target);
      currentStreak.relativeTimestampStart = event.relativeTimestamp;
    }
  }

  currentStreak.relativeTimestampEnd = reportFight.relativeEndTime;
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
    const fight = report.fights.find((it) => it.fightID === Number(fightID));
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

const makeReportStreakIngestible = (
  reportDodgeParryMissStreak: ReportDodgeParryMissStreak,
  report: ReportWithIngestedFights,
): IngestibleReportDodgeParryMissStreak => {
  const reportFight = report.fights.find(
    (fight) =>
      fight.report === reportDodgeParryMissStreak.report &&
      fight.fightID === reportDodgeParryMissStreak.fight,
  );
  debug(
    `Trying to ingest D${reportDodgeParryMissStreak.dodge}/P${reportDodgeParryMissStreak.parry}/M${reportDodgeParryMissStreak.miss} for player ${reportDodgeParryMissStreak.target.id}, report ${reportDodgeParryMissStreak.report}, and fight ${reportDodgeParryMissStreak.fight}`,
  );
  if (!reportFight) {
    throw new Error(
      `Unable to find matching report fight for report ${reportDodgeParryMissStreak.report} and fight ${reportDodgeParryMissStreak.fight}`,
    );
  }

  return {
    ...reportDodgeParryMissStreak,
    region: reportFight.region,
    ingestedFightId: reportFight.fight.id,
    timestampStart:
      report.startTime + reportDodgeParryMissStreak.relativeTimestampStart,
    timestampEnd:
      report.startTime + reportDodgeParryMissStreak.relativeTimestampEnd,
  };
};

const ingestStreak = async (
  ingestibleStreak: IngestibleReportDodgeParryMissStreak,
  characterId: number,
  timings: Timings,
): Promise<IngestedReportDodgeParryMissStreak> => {
  const existingStreak = await time(
    () =>
      drizzle.query.dodgeParryMissStreak.findFirst({
        where: and(
          eq(dodgeParryMissStreak.fightId, ingestibleStreak.ingestedFightId),
          gte(
            dodgeParryMissStreak.timestampStart,
            new Date(
              ingestibleStreak.timestampStart - DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          lte(
            dodgeParryMissStreak.timestampStart,
            new Date(
              ingestibleStreak.timestampStart + DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          gte(
            dodgeParryMissStreak.timestampEnd,
            new Date(
              ingestibleStreak.timestampEnd - DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          lte(
            dodgeParryMissStreak.timestampEnd,
            new Date(
              ingestibleStreak.timestampEnd + DIFFERENT_REPORT_TOLERANCE,
            ),
          ),
          eq(dodgeParryMissStreak.sourceId, ingestibleStreak.target.guid),
        ),
      }),
    {
      type: "drizzle.query.streak.findFirst",
      timings,
    },
  );
  if (existingStreak) {
    info("Streak already ingested, returning existing streak");
    return { ...ingestibleStreak, dodgeParryMissStreak: existingStreak };
  }

  debug(
    `Persisting streak D${ingestibleStreak.dodge}/P${ingestibleStreak.parry}/M${ingestibleStreak.miss} from report ${ingestibleStreak.report}...`,
  );
  const createdStreaks = await time(
    () =>
      drizzle
        .insert(dodgeParryMissStreak)
        .values({
          report: ingestibleStreak.report,
          reportFightId: ingestibleStreak.fight,
          reportFightRelativeStart: ingestibleStreak.relativeTimestampStart,
          reportFightRelativeEnd: ingestibleStreak.relativeTimestampEnd,
          dodge: ingestibleStreak.dodge,
          parry: ingestibleStreak.parry,
          miss: ingestibleStreak.miss,
          timestampStart: new Date(ingestibleStreak.timestampStart),
          timestampEnd: new Date(ingestibleStreak.timestampEnd),
          sourceId: characterId,
          fightId: ingestibleStreak.ingestedFightId,
        })
        .returning(),
    {
      type: "drizzle.insert(dodgeParryMissStreak)",
      timings,
    },
  );
  if (createdStreaks.length !== 1) {
    throw new Error(
      `Failed to ingest streak D${ingestibleStreak.dodge}/P${ingestibleStreak.parry}/M${ingestibleStreak.miss} from report ${ingestibleStreak.report} because createdStreaks.length = ${createdStreaks.length}`,
    );
  }
  const createdStreak = createdStreaks.at(0)!;
  debug(
    `Persisted streak D${ingestibleStreak.dodge}/P${ingestibleStreak.parry}/M${ingestibleStreak.miss} from report ${ingestibleStreak.report} as ${createdStreak.id}`,
  );
  return { ...ingestibleStreak, dodgeParryMissStreak: createdStreak };
};

const ingestStreaksForCharacter = async (
  ingestibleStreaks: IngestibleReportDodgeParryMissStreak[],
  timings: Timings,
) => {
  if (ingestibleStreaks.length === 0) {
    return;
  }
  const firstStreak = ingestibleStreaks.at(0);
  if (!firstStreak) {
    return;
  }

  const characters = await findOrCreateCharacter(firstStreak, timings);
  if (characters.length !== 1) {
    throw new Error(
      `Failed to ingest streaks for report ${firstStreak.report} because characters.length = ${characters.length}`,
    );
  }
  const character = characters.at(0)!;
  return Promise.allSettled(
    ingestibleStreaks.map((streak) =>
      ingestStreak(streak, character.id, timings),
    ),
  );
};

const ingestStreaks = async (
  ingestibleStreaks: IngestibleReportDodgeParryMissStreak[],
  timings: Timings,
) => {
  const grouped = groupBy(ingestibleStreaks, (streak) => streak.target.guid);

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

  debug("Report streaks:", reportStreaks);

  // TODO: get required length in order to be ingested
  const ingestibleStreaks = reportStreaks.map((streak) =>
    makeReportStreakIngestible(streak, report),
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
        PromiseSettledResult<IngestedReportDodgeParryMissStreak>[] | undefined
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

  return { ...report, dodgeParryMissStreaks: ingestedStreaks };
};
