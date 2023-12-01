import { and, eq, gte, lte } from 'drizzle-orm';
import { sortBy } from 'lodash-es';

import { isRegion } from '~/constants.ts';
import { DIFFERENT_REPORT_TOLERANCE } from '~/ingest/constants.server.ts';
import type {
  IngestedReportFight,
  IngestibleReportFight,
  Report,
  ReportFight,
  ReportWithIngestedFights,
  ReportWithIngestibleFights,
} from '~/ingest/types.ts';
import { pg } from '~/lib/storage.server.ts';
import { fight } from '~/lib/db/schema.ts';
import { getLogger } from '~/lib/logger.server.ts';
import { type Timings, time } from '~/lib/timing.server.ts';
import { findSeasonsByTimestamp } from '~/seasons.ts';
import { isPresent } from '~/typeGuards.ts';
import { pipe } from '~/utils.ts';
import type { PlayerDetail } from '~/wcl/zod.server.ts';
import { playerDetailsDpsHealerTankSchema } from '~/wcl/zod.server.ts';
import { getFights, getPlayerDetails } from '~/wcl/wcl.server.ts';

const ingestFightsLogger = getLogger(['ingest', 'fights']);

async function getReport(reportID: string, timings: Timings): Promise<Report> {
  const rawFightData = await time(() => getFights({ reportID }), {
    type: `wcl.getFights(${reportID})`,
    timings,
  });
  if (!rawFightData.reportData || !rawFightData.reportData.report)
    throw new Error(`Unable to get report details for report ID ${reportID}`);

  const fights = rawFightData.reportData.report.fights;
  const reportRegion
    = rawFightData.reportData.report.region?.slug?.toLowerCase();
  const reportStartTime = rawFightData.reportData.report.startTime;
  const reportEndTime = rawFightData.reportData.report.endTime;
  const title = rawFightData.reportData.report.title;
  if (!reportRegion || !isRegion(reportRegion))
    throw new Error(`Unable to determine region for report ID ${reportID}`);

  if (!isPresent(fights))
    throw new Error(`Unable to retrieve fights for report ID ${reportID}`);

  const reportFights = fights
    .filter(isPresent)
    // filter out fights where there is no difficulty
    .filter(fight => fight.difficulty)
    .map<ReportFight>(fight => ({
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
    reportFights,
  };
}

function makeReportFightIngestible(basicReportFight: ReportFight, playerDetails: PlayerDetail[], tankDetails: PlayerDetail[]): IngestibleReportFight {
  const friendlyPlayerDetails = basicReportFight.friendlyPlayerIDs
    .map<PlayerDetail | undefined>(playerId =>
      playerDetails.find(player => player.id === playerId),
    )
    .filter(isPresent);
  const friendlyPlayers = sortBy(
    friendlyPlayerDetails.map(player => player.guid),
  ).join(':');

  const tanksInFight = tankDetails.filter(tank =>
    basicReportFight.friendlyPlayerIDs.includes(tank.id),
  );

  return {
    ...basicReportFight,
    friendlyPlayerDetails: tanksInFight,
    friendlyPlayers,
  };
}

async function addIngestibleFightsToReport(basicReport: Report, timings: Timings): Promise<ReportWithIngestibleFights> {
  const logger = ingestFightsLogger.child({
    reportID: basicReport.reportID,
  });
  const fightIDs = basicReport.reportFights.map(fight => fight.id);

  logger.debug('Retrieving player details');
  const rawPlayerDetails = await time(
    () =>
      getPlayerDetails({
        reportID: basicReport.reportID,
        fightIDs,
      }),
    { type: `wcl.getPlayerDetails(${basicReport.reportID})`, timings },
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
  logger.debug(
    {
      numberOfPlayers: playerDetails.length,
      numberOfTanks: playerDetailsResult.data.tanks.length,
    },
    'Retrieving player details for report',
  );
  const reportFightsWithDetails
    = basicReport.reportFights.map<IngestibleReportFight>(fight =>
      makeReportFightIngestible(
        fight,
        playerDetails,
        playerDetailsResult.data.tanks,
      ),
    );

  return { ...basicReport, fights: reportFightsWithDetails };
}

function isFightInSeason(fight: IngestibleReportFight): boolean {
  const logger = ingestFightsLogger.child({
    reportID: fight.reportID,
    fightID: fight.id,
    fightStartTime: fight.startTime,
    fightEndTime: fight.endTime,
  });
  const seasons = findSeasonsByTimestamp(fight.absoluteStartTime);
  if (seasons.length === 0) {
    logger.debug(
      { absoluteStartTime: fight.absoluteStartTime },
      'Unable to find season',
    );
    return false;
  }

  return seasons.some(season =>
    season.encounterIds.includes(fight.encounterID),
  );
}

export function filterReportFightsToOnlyThoseInSeason(enhanceReport: ReportWithIngestibleFights): ReportWithIngestibleFights {
  return {
    ...enhanceReport,
    fights: enhanceReport.fights.filter(isFightInSeason),
  };
}

// const filterToOnlyOne = (
//   enhanceReport: ReportWithIngestibleFights,
// ): ReportWithIngestibleFights => ({
//   ...enhanceReport,
//   fights: enhanceReport.fights.filter((_, idx) => idx === 0),
// });

export const filterIngestibleReportFights = pipe(
  filterReportFightsToOnlyThoseInSeason,
  // filterToOnlyOne,
);

export async function ingestFight(reportFight: IngestibleReportFight, timings: Timings): Promise<IngestedReportFight> {
  const logger = ingestFightsLogger.child({
    reportID: reportFight.reportID,
    fightID: reportFight.id,
    fightStartTime: reportFight.startTime,
    fightEndTime: reportFight.endTime,
  });
  logger.debug(
    'Checking if fight has already been ingested from another report...',
  );
  const existingFight = await time(
    () =>
      pg.query.fight.findFirst({
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
      type: 'drizzle.query.fight.findFirst',
      timings,
    },
  );
  if (existingFight) {
    logger.info('Fight already ingested, returning existing fight');
    return { ...reportFight, ingestedFight: existingFight };
  }

  logger.debug(`Persisting fight`);
  const createdFights = await time(
    () =>
      pg
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
      type: 'drizzle.insert(fight)',
      timings,
    },
  );
  if (createdFights.length !== 1) {
    throw new Error(
      `Failed to ingest fight ${reportFight.id} for report ${reportFight.reportID} because createdFights.length = ${createdFights.length}`,
    );
  }
  const createdFight = createdFights.at(0)!;
  logger.info(`Persisted fight as ${createdFight.id}`);

  return { ...reportFight, ingestedFight: createdFight };
}

export function ingestFights(reportFights: IngestibleReportFight[], timings: Timings) {
  return Promise.allSettled(reportFights.map(fight => ingestFight(fight, timings)));
}

export async function ingestFightsFromReport(reportID: string, timings: Timings): Promise<ReportWithIngestedFights> {
  const logger = ingestFightsLogger.child({ reportID });

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
    .filter((it): it is PromiseRejectedResult => it.status === 'rejected')
    .forEach(it => logger.error(it.reason));
  const ingestedFights = ingestedFightResults
    .filter(
      (it): it is PromiseFulfilledResult<IngestedReportFight> =>
        it.status === 'fulfilled',
    )
    .map(it => it.value);

  return { ...report, fights: ingestedFights };
}
