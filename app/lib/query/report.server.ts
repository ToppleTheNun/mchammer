import { invariant } from "@epic-web/invariant";
import { z } from "zod";

import { isRegion, RegionSchema } from "~/data/regions.ts";
import { findSeasonByTimestamp } from "~/data/seasons.ts";
import { cache, cachified } from "~/lib/cache.server.ts";
import { prisma } from "~/lib/db.server.ts";
import type {
  CacheableQueryOptions,
  Timeable,
} from "~/lib/query/types.server.ts";
import { isPresent } from "~/lib/typeGuards.ts";
import type { GetFightsQueryVariables } from "~/lib/wcl/types.server.ts";
import { getWclFights } from "~/lib/wcl/wcl.server.ts";

const ReportCodeSchema = z
  .string()
  .min(16)
  .max(16)
  .regex(/^[a-z0-9]+$/i);
export const ReportFightSchema = z.object({
  reportCode: ReportCodeSchema,
  fightID: z.number(),
  startTime: z.number(),
  endTime: z.number(),
  encounter: z.object({
    id: z.number(),
    icon: z.string(),
  }),
  difficulty: z.number(),
  region: RegionSchema,
  friendlyPlayerIds: z.number().array(),
  kill: z.boolean(),
  percentage: z.number(),
});
export type ReportFight = z.infer<typeof ReportFightSchema>;

export const ReportSchema = z.object({
  reportCode: ReportCodeSchema,
  title: z.string(),
  fights: ReportFightSchema.array(),
});
export type Report = z.infer<typeof ReportSchema>;

async function getFights(
  params: GetFightsQueryVariables,
  timeable: Timeable,
): Promise<Report> {
  const rawFightData = await getWclFights(params, timeable);
  invariant(rawFightData.reportData, "reportData is not present in response");
  invariant(
    rawFightData.reportData.report,
    "report is not present in reportData",
  );

  const dbRegions = await prisma.region.findMany();
  const regions = dbRegions.map((it) => it.id);

  const fights = rawFightData.reportData.report.fights;
  const reportRegion =
    rawFightData.reportData.report.region?.slug.toUpperCase();
  const reportStartTime = rawFightData.reportData.report.startTime;
  const title = rawFightData.reportData.report.title;
  const season = findSeasonByTimestamp(reportStartTime);

  invariant(reportRegion, "reportRegion is not present in report");
  invariant(
    regions.includes(reportRegion),
    "reportRegion is not in allowed regions list",
  );
  invariant(
    isRegion(reportRegion),
    "reportRegion is not in region constants list",
  );
  invariant(isPresent(fights), "no fights present in report");
  invariant(season, "no season found for report");

  const seasonEncounterIds = season.encounters.map((encounter) => encounter.id);

  const reportFights = fights
    .filter(isPresent)
    // filter out fights where there is no difficulty
    .filter((fight) => fight.difficulty)
    .filter((fight) => seasonEncounterIds.includes(fight.encounterID))
    .map((fight) => {
      const encounter = season.encounters.find(
        (encounter) => encounter.id === fight.encounterID,
      );
      if (!encounter) {
        return null;
      }
      return {
        reportCode: params.reportID,
        fightID: fight.id,
        startTime: reportStartTime + fight.startTime,
        endTime: reportStartTime + fight.endTime,
        encounter: encounter,
        difficulty: fight.difficulty ?? 0,
        region: reportRegion,
        friendlyPlayerIds: isPresent(fight.friendlyPlayers)
          ? fight.friendlyPlayers.filter(isPresent)
          : [],
        kill: fight.kill ?? false,
        percentage: fight.kill ? 100 : fight.fightPercentage ?? 0,
      } satisfies ReportFight;
    })
    .filter(isPresent);

  return {
    reportCode: params.reportID,
    title,
    fights: reportFights,
  };
}

export async function getCachedFights(
  params: GetFightsQueryVariables,
  cacheOptions: CacheableQueryOptions,
) {
  return await cachified<Report>({
    key: `getFights:${params.reportID}`,
    cache,
    getFreshValue: () => getFights(params, { timings: cacheOptions.timings }),
    checkValue: ReportSchema,
    // Time To Live (ttl) in milliseconds: the cached value is considered valid for 24 hours
    ttl: 1000 * 60 * 60 * 24,
    // Stale While Revalidate (swr) in milliseconds: if the cached value is less than 5 days
    // expired, return it while fetching a fresh value in the background
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 5,
    ...cacheOptions,
  });
}
