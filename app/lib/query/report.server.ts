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
import { time } from "~/lib/timing.server.ts";
import { isPresent } from "~/lib/typeGuards.ts";
import type {
  GetFightsQueryVariables,
  GetPlayerDetailsQueryVariables,
} from "~/lib/wcl/types.server.ts";
import { getWclFights, getWclPlayerDetails } from "~/lib/wcl/wcl.server.ts";

// region Fights
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

async function getReport(
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

export async function getCachedReport(
  params: GetFightsQueryVariables,
  cacheOptions: CacheableQueryOptions,
) {
  return cachified<Report>({
    key: `getFights:${params.reportID}`,
    cache,
    getFreshValue: () => getReport(params, { timings: cacheOptions.timings }),
    checkValue: ReportSchema,
    // Time To Live (ttl) in milliseconds: the cached value is considered valid for 24 hours
    ttl: 1000 * 60 * 60 * 24,
    // Stale While Revalidate (swr) in milliseconds: if the cached value is less than 5 days
    // expired, return it while fetching a fresh value in the background
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 5,
    ...cacheOptions,
  });
}
// endregion

// region Player Details
export const PlayerDetailSpecSchema = z.object({
  spec: z.string(),
  count: z.number(),
});
export type PlayerDetailSpec = z.infer<typeof PlayerDetailSpecSchema>;

export const PlayerDetailTypeSchema = z.enum([
  "DeathKnight",
  "DemonHunter",
  "Druid",
  "Evoker",
  "Hunter",
  "Mage",
  "Monk",
  "Paladin",
  "Priest",
  "Rogue",
  "Shaman",
  "Warlock",
  "Warrior",
]);
export type PlayerDetailType = z.infer<typeof PlayerDetailTypeSchema>;

export const PlayerDetailSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  type: PlayerDetailTypeSchema,
  server: z.string(),
  specs: z.array(PlayerDetailSpecSchema),
});
export type PlayerDetail = z.infer<typeof PlayerDetailSchema>;

const RoleSchema = z.enum(["tank", "healer", "dps"]);
export type Role = z.infer<typeof RoleSchema>;

export const PlayerDetailWithRoleSchema = PlayerDetailSchema.extend({
  role: RoleSchema,
});
export type PlayerDetailWithRole = z.infer<typeof PlayerDetailWithRoleSchema>;

export const PlayerDetailsSchema = z.object({
  dps: z.array(PlayerDetailSchema).default([]),
  healers: z.array(PlayerDetailSchema).default([]),
  tanks: z.array(PlayerDetailSchema).default([]),
});
export type PlayerDetails = z.infer<typeof PlayerDetailsSchema>;

const PlayerDetailsDataSchema = z.object({
  data: z.object({
    playerDetails: PlayerDetailsSchema,
  }),
});

function toPlayerDetailWithRole(
  playerDetail: PlayerDetail,
  role: Role,
): PlayerDetailWithRole {
  return { ...playerDetail, role };
}

async function getPlayerDetails(
  params: GetPlayerDetailsQueryVariables,
  timeable: Timeable,
): Promise<PlayerDetailWithRole[]> {
  const response = await getWclPlayerDetails(params, timeable);
  invariant(response.reportData, "reportData is not present in response");
  invariant(response.reportData.report, "report is not present in reportData");

  const rawPlayerDetails: unknown = response.reportData.report.playerDetails;
  const playerDetailsDpsHealerTank = await time(
    () => PlayerDetailsDataSchema.parseAsync(rawPlayerDetails),
    { timings: timeable.timings, type: "player details parse" },
  );

  return [
    ...playerDetailsDpsHealerTank.data.playerDetails.tanks.map((it) =>
      toPlayerDetailWithRole(it, "tank"),
    ),
    ...playerDetailsDpsHealerTank.data.playerDetails.healers.map((it) =>
      toPlayerDetailWithRole(it, "healer"),
    ),
    ...playerDetailsDpsHealerTank.data.playerDetails.dps.map((it) =>
      toPlayerDetailWithRole(it, "dps"),
    ),
  ];
}

export async function getCachedPlayerDetails(
  params: GetPlayerDetailsQueryVariables,
  cacheOptions: CacheableQueryOptions,
) {
  const fightIds = Array.isArray(params.fightIDs)
    ? params.fightIDs
    : [params.fightIDs];

  return cachified<PlayerDetailWithRole[]>({
    key: `getPlayerDetails:${params.reportID}:[${fightIds.join(",")}]`,
    cache,
    getFreshValue: () =>
      getPlayerDetails(params, { timings: cacheOptions.timings }),
    checkValue: PlayerDetailWithRoleSchema.array(),
    // Time To Live (ttl) in milliseconds: the cached value is considered valid for 24 hours
    ttl: 1000 * 60 * 60 * 24,
    // Stale While Revalidate (swr) in milliseconds: if the cached value is less than 5 days
    // expired, return it while fetching a fresh value in the background
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 5,
    ...cacheOptions,
  });
}
// endregion
