import { and, eq, gte, lte } from "drizzle-orm";
import { sortBy } from "lodash-es";

import { isRegion } from "#app/constants.ts";
import { DIFFERENT_REPORT_TOLERANCE } from "#app/ingest/constants.server.ts";
import type {
  IngestedReportFight,
  IngestibleReportFight,
  Report,
  ReportFight,
  ReportWithIngestedFights,
  ReportWithIngestibleFights,
} from "#app/ingest/types.ts";
import { drizzle } from "#app/lib/db.server.ts";
import { fight } from "#app/lib/db/schema.ts";
import { debug, error, info } from "#app/lib/log.server.ts";
import { time, type Timings } from "#app/lib/timing.server.ts";
import { findSeasonsByTimestamp } from "#app/seasons.ts";
import { isPresent } from "#app/typeGuards.ts";
import { pipe } from "#app/utils.ts";
import {
  getFights,
  getPlayerDetails,
} from "#app/wcl/queries/queries.server.ts";
import {
  type PlayerDetail,
  playerDetailsDpsHealerTankSchema,
} from "#app/wcl/schema.server.ts";

const getReport = async (
  reportID: string,
  timings: Timings,
): Promise<Report> => {
  const rawFightData = await time(() => getFights({ reportID }), {
    type: `wcl.query.getFights(${reportID})`,
    timings,
  });
  if (!rawFightData.reportData || !rawFightData.reportData.report) {
    throw new Error(`Unable to get report details for report ID ${reportID}`);
  }

  const fights = rawFightData.reportData.report.fights;
  const reportRegion =
    rawFightData.reportData.report.region?.slug?.toLowerCase();
  const reportStartTime = rawFightData.reportData.report.startTime;
  const reportEndTime = rawFightData.reportData.report.endTime;
  const title = rawFightData.reportData.report.title;
  if (!reportRegion || !isRegion(reportRegion)) {
    throw new Error(`Unable to determine region for report ID ${reportID}`);
  }
  if (!isPresent(fights)) {
    throw new Error(`Unable to retrieve fights for report ID ${reportID}`);
  }

  const reportFights = fights
    .filter(isPresent)
    // filter out fights where there is no difficulty
    .filter((fight) => fight.difficulty)
    .map<ReportFight>((fight) => ({
      reportID,
      reportStartTime,
      reportEndTime,
      reportRegion,
      id: fight.id,
      startTime: fight.startTime,
      endTime: fight.endTime,
      difficulty: fight.difficulty ?? 0,
      encounterID: fight.encounterID,
      friendlyPlayerIDs: isPresent(fight.friendlyPlayers)
        ? fight.friendlyPlayers.filter(isPresent)
        : [],
      absoluteStartTime: reportStartTime + fight.startTime,
      absoluteEndTime: reportStartTime + fight.endTime,
    }));

  return {
    reportID,
    title,
    region: reportRegion,
    startTime: reportStartTime,
    endTime: reportEndTime,
    reportFights: reportFights,
  };
};

const makeReportFightIngestible = (
  basicReportFight: ReportFight,
  playerDetails: PlayerDetail[],
): IngestibleReportFight => {
  const friendlyPlayerDetails = basicReportFight.friendlyPlayerIDs
    .map<PlayerDetail | undefined>((playerId) =>
      playerDetails.find((player) => player.id === playerId),
    )
    .filter(isPresent);
  const friendlyPlayers = sortBy(
    friendlyPlayerDetails.map((player) => player.guid),
  ).join(":");

  return {
    ...basicReportFight,
    friendlyPlayerDetails,
    friendlyPlayers,
  };
};

const addIngestibleFightsToReport = async (
  basicReport: Report,
  timings: Timings,
): Promise<ReportWithIngestibleFights> => {
  const fightIDs = basicReport.reportFights.map((fight) => fight.id);

  debug(`Retrieving player details for report ${basicReport.reportID}`);
  const rawPlayerDetails = await time(
    () =>
      getPlayerDetails({
        reportID: basicReport.reportID,
        fightIDs,
      }),
    { type: `wcl.query.getFights(${basicReport.reportID})`, timings },
  );

  const playerDetailsResult = playerDetailsDpsHealerTankSchema.safeParse(
    rawPlayerDetails.reportData?.report?.playerDetails?.data?.playerDetails,
  );
  if (!playerDetailsResult.success) {
    throw new Error(
      `Unable to retrieve player details for report ${basicReport.reportID}`,
    );
  }

  const playerDetails = [
    ...playerDetailsResult.data.dps,
    ...playerDetailsResult.data.healers,
    ...playerDetailsResult.data.tanks,
  ];
  debug(
    `Retrieving player details for report ${basicReport.reportID}: ${playerDetails.length} players`,
  );
  const reportFightsWithDetails =
    basicReport.reportFights.map<IngestibleReportFight>((fight) =>
      makeReportFightIngestible(fight, playerDetails),
    );

  return { ...basicReport, fights: reportFightsWithDetails };
};

const isFightInSeason = (fight: IngestibleReportFight): boolean => {
  const seasons = findSeasonsByTimestamp(fight.absoluteStartTime);
  if (seasons.length === 0) {
    debug(`Unable to find season for timestamp ${fight.absoluteStartTime}`);
    return false;
  }

  return seasons.some((season) =>
    season.encounterIds.includes(fight.encounterID),
  );
};

export const filterReportFightsToOnlyThoseInSeason = (
  enhanceReport: ReportWithIngestibleFights,
): ReportWithIngestibleFights => ({
  ...enhanceReport,
  fights: enhanceReport.fights.filter(isFightInSeason),
});

const filterToOnlyOne = (
  enhanceReport: ReportWithIngestibleFights,
): ReportWithIngestibleFights => ({
  ...enhanceReport,
  fights: enhanceReport.fights.filter((_, idx) => idx === 0),
});

export const filterIngestibleReportFights = pipe(
  filterReportFightsToOnlyThoseInSeason,
  // filterToOnlyOne,
);

export const ingestFight = async (
  reportFight: IngestibleReportFight,
  timings: Timings,
): Promise<IngestedReportFight> => {
  debug(
    `Checking if fight ${reportFight.id} from report ${reportFight.reportID} has already been ingested from another report...`,
  );
  const existingFight = await time(
    () =>
      drizzle.query.fight.findFirst({
        where: and(
          gte(
            fight.startTime,
            new Date(reportFight.startTime - DIFFERENT_REPORT_TOLERANCE),
          ),
          lte(
            fight.startTime,
            new Date(reportFight.startTime + DIFFERENT_REPORT_TOLERANCE),
          ),
          gte(
            fight.endTime,
            new Date(reportFight.endTime - DIFFERENT_REPORT_TOLERANCE),
          ),
          lte(
            fight.endTime,
            new Date(reportFight.endTime + DIFFERENT_REPORT_TOLERANCE),
          ),
          eq(fight.encounterId, reportFight.encounterID),
          eq(fight.difficulty, reportFight.difficulty),
          eq(fight.friendlyPlayers, reportFight.friendlyPlayers),
          eq(fight.region, reportFight.reportRegion),
        ),
      }),
    {
      type: "drizzle.query.fight.findFirst",
      timings,
    },
  );
  if (existingFight) {
    info("Fight already ingested, returning existing fight");
    return { ...reportFight, ingestedFight: existingFight };
  }

  debug(
    `Persisting fight ${reportFight.id} from report ${reportFight.reportID}...`,
  );
  const createdFights = await time(
    () =>
      drizzle
        .insert(fight)
        .values({
          firstSeenReport: reportFight.reportID,
          startTime: new Date(reportFight.startTime),
          endTime: new Date(reportFight.endTime),
          difficulty: reportFight.difficulty,
          encounterId: reportFight.encounterID,
          friendlyPlayers: reportFight.friendlyPlayers,
          region: reportFight.reportRegion,
        })
        .returning(),
    {
      type: "drizzle.insert(fight)",
      timings,
    },
  );
  if (createdFights.length !== 1) {
    throw new Error(
      `Failed to ingest fight ${reportFight.id} for report ${reportFight.reportID} because createdFights.length = ${createdFights.length}`,
    );
  }
  const createdFight = createdFights.at(0)!;
  debug(
    `Persisted fight ${reportFight.id} from report ${reportFight.reportID} as ${createdFight.id}`,
  );

  return { ...reportFight, ingestedFight: createdFight };
};

export const ingestFights = (
  reportFights: IngestibleReportFight[],
  timings: Timings,
) =>
  Promise.allSettled(reportFights.map((fight) => ingestFight(fight, timings)));

export const ingestFightsFromReport = async (
  reportID: string,
  timings: Timings,
): Promise<ReportWithIngestedFights> => {
  const report = await getReport(reportID, timings);
  if (!report) {
    throw new Error(
      `Unable to retrieve report by ID ${reportID} from WarcraftLogs`,
    );
  }

  const reportWithIngestibleFights = await addIngestibleFightsToReport(
    report,
    timings,
  );

  const reportWithFilteredIngestibleFights = filterIngestibleReportFights(
    reportWithIngestibleFights,
  );

  const ingestedFightResults = await ingestFights(
    reportWithFilteredIngestibleFights.fights,
    timings,
  );

  ingestedFightResults
    .filter((it): it is PromiseRejectedResult => it.status === "rejected")
    .forEach((it) => error(it.reason));
  const ingestedFights = ingestedFightResults
    .filter(
      (it): it is PromiseFulfilledResult<IngestedReportFight> =>
        it.status === "fulfilled",
    )
    .map((it) => it.value);

  return { ...report, fights: ingestedFights };
};
