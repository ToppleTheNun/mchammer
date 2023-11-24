import type { Region } from "~/constants.ts";

const UNKNOWN_SEASON_START_OR_ENDING = null;

export interface Season {
  name: string
  shortName: string
  slug: string
  startDates: Record<Region, number | null>
  endDates: Record<Region, number | null>
  seasonIcon: string
  encounterIds: ReadonlyArray<number>
  ptr: boolean
}

function offsetByRegion(timestamp: number, region: Region): number {
  switch (region) {
    case "us": {
      return timestamp;
    }
    case "eu": {
      return timestamp + 46_800_000;
    }
    case "kr":
    case "tw":
      return timestamp + 111_600_000;
  }
}

export const seasons: readonly Season[] = [
  {
    name: "DF S3",
    shortName: "S3",
    slug: "df-season-3",
    startDates: {
      us: offsetByRegion(1_699_974_000_000, "us"),
      eu: offsetByRegion(1_699_974_000_000, "eu"),
      kr: offsetByRegion(1_699_974_000_000, "kr"),
      tw: offsetByRegion(1_699_974_000_000, "tw"),
    },
    endDates: {
      us: UNKNOWN_SEASON_START_OR_ENDING,
      eu: UNKNOWN_SEASON_START_OR_ENDING,
      kr: UNKNOWN_SEASON_START_OR_ENDING,
      tw: UNKNOWN_SEASON_START_OR_ENDING,
    },
    seasonIcon: "/INV_Misc_Head_Dragon_01.png",
    encounterIds: [
      2728, // Council of Dreams
      2677, // Fyrakk, the Blazing
      2820, // Gnarlroot
      2709, // Igira the Cruel
      2731, // Larodar, Keeper of the Flame
      2708, // Nymue, Weaver of the Cycle
      2824, // Smolderon
      2786, // Tindral Sageswift, Seer of Flame
      2737, // Volcoross
      61763, // Atal'Dazar
      61501, // Black Rook Hold
      61466, // Darkheart Thicket
      61279, // Everbloom
      12579, // Dawn of the Infinites: Galakrond's Fall
      12580, // Dawn of the Infinites: Murozond's Rise
      10643, // Throne of the Tides
      61862, // Waycrest Manor
    ],
    ptr: false,
  },
] as const;

export function hasSeasonEndedForAllRegions(slug: string): boolean {
  const season = seasons.find(season => season.slug === slug);

  if (!season)
    return true;

  const endDates = Object.values(season.endDates);

  if (endDates.includes(UNKNOWN_SEASON_START_OR_ENDING))
    return false;

  const now = Date.now();

  return endDates.every(date => now >= (date ?? 0));
}

export function findSeasonByTimestamp(timestamp = Date.now()): Season | null {
  const season = seasons.find(
    season =>
      Object.values(season.startDates).some(
        start => start && timestamp >= start,
      )
      && Object.values(season.endDates).some(
        end => end === UNKNOWN_SEASON_START_OR_ENDING || end > timestamp,
      ),
  );

  return season ?? null;
}

export function findSeasonsByTimestamp(timestamp = Date.now()): Season[] {
  return seasons.filter(
    season =>
      Object.values(season.startDates).some(
        start => start && timestamp >= start,
      )
      && Object.values(season.endDates).some(
        end => end === UNKNOWN_SEASON_START_OR_ENDING || end > timestamp,
      ),
  );
}

export function findSeasonByName(slug: string): Season | null {
  if (slug === "latest") {
    const ongoingSeason = findSeasonByTimestamp();

    if (ongoingSeason)
      return ongoingSeason;

    const mostRecentlyStartedSeason = seasons.find(
      season =>
        season.startDates.us !== null && Date.now() >= season.startDates.us,
    );

    if (mostRecentlyStartedSeason)
      return mostRecentlyStartedSeason;
  }

  const match = seasons.find((season) => {
    return season.slug === slug;
  });

  return match ?? null;
}
