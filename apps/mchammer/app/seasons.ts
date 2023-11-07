import type { Region } from "#app/constants.tsx";

const UNKNOWN_SEASON_START_OR_ENDING = null;

export type Season = {
  name: string;
  slug: string;
  startDates: Record<Region, number | null>;
  endDates: Record<Region, number | null>;
  seasonIcon: string;
  encounterIds: ReadonlyArray<number>;
  ptr: boolean;
};

const offsetByRegion = (timestamp: number, region: Region): number => {
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
};

export const seasons: readonly Season[] = [
  {
    name: "DF S3",
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

    ],
    ptr: false,
  },
  {
    name: "DF S2",
    slug: "df-season-2",
    startDates: {
      us: offsetByRegion(1_683_644_400_000, "us"),
      eu: offsetByRegion(1_683_644_400_000, "eu"),
      kr: offsetByRegion(1_683_644_400_000, "kr"),
      tw: offsetByRegion(1_683_644_400_000, "tw"),
    },
    endDates: {
      us: offsetByRegion(1_699_336_800_000, "us"),
      eu: offsetByRegion(1_699_336_800_000, "eu"),
      kr: offsetByRegion(1_699_336_800_000, "kr"),
      tw: offsetByRegion(1_699_336_800_000, "tw"),
    },
    seasonIcon: "/INV_Misc_Head_Dragon_Black_Nightmare.png",
    encounterIds: [
      2687, // Amalgamation Chamber
      2682, // Assault of the Zaqali
      2684, // Echo of Neltharion
      2693, // Forgotten Experiments
      2688, // Kazzara
      2683, // Magmorax
      2680, // Rashok, the Elder
      2685, // Sarkareth
      2689, // The Vigilant Steward, Zskarn
      12520, // Brackenhide Hollow
      61754, // Freehold
      12527, // Halls of Infusion
      61458, // Neltharion's Lair
      12519, // Neltharus
      12451, // Uldaman: Legacy of Tyr
      61841, // The Underrot
      10657, // The Vortex Pinnacle
    ],
    ptr: false,
  },
  {
    name: "DF S1",
    slug: "df-season-1",
    startDates: {
      us: offsetByRegion(1_670_943_600_000, "us"),
      eu: offsetByRegion(1_670_943_600_000, "eu"),
      kr: offsetByRegion(1_670_943_600_000, "kr"),
      tw: offsetByRegion(1_670_943_600_000, "tw"),
    },
    endDates: {
      us: offsetByRegion(1_683_007_200_000, "us"),
      eu: offsetByRegion(1_683_007_200_000, "eu"),
      kr: offsetByRegion(1_683_007_200_000, "kr"),
      tw: offsetByRegion(1_683_007_200_000, "tw"),
    },
    seasonIcon: "/Shaman_PVP_LeaderClan.png",
    encounterIds: [
      2614, // Broodkeeper Diurna
      2635, // Dathea, Ascended
      2587, // Eranog
      2605, // Kurog Grimtotem
      2590, // Primal Council
      2607, // Raszageth the Storm-Eater
      2592, // Sennarth, the Cold Breath
      2639, // Terros
      12526, // Algeth'ar Academy
      12515, // The Azure Vault
      61571, // Court of Stars
      61477, // Halls of Valor
      12516, // The Nokhud Offensive
      12521, // Ruby Life Pools
      61176, // Shadowmoon Burial Grounds
      10960, // Temple of the Jade Serpent
    ],
    ptr: false,
  },
] as const;

export const hasSeasonEndedForAllRegions = (slug: string): boolean => {
  const season = seasons.find((season) => season.slug === slug);

  if (!season) {
    return true;
  }

  const endDates = Object.values(season.endDates);

  if (endDates.includes(UNKNOWN_SEASON_START_OR_ENDING)) {
    return false;
  }

  const now = Date.now();

  return endDates.every((date) => now >= (date ?? 0));
};

export const findSeasonByTimestamp = (
  timestamp = Date.now(),
): Season | null => {
  const season = seasons.find(
    (season) =>
      Object.values(season.startDates).some(
        (start) => start && timestamp >= start,
      ) &&
      Object.values(season.endDates).some(
        (end) => end === UNKNOWN_SEASON_START_OR_ENDING || end > timestamp,
      ),
  );

  return season ?? null;
};

export const findSeasonsByTimestamp = (timestamp = Date.now()): Season[] => {
  return seasons.filter(
    (season) =>
      Object.values(season.startDates).some(
        (start) => start && timestamp >= start,
      ) &&
      Object.values(season.endDates).some(
        (end) => end === UNKNOWN_SEASON_START_OR_ENDING || end > timestamp,
      ),
  );
};

export const findSeasonByName = (slug: string): Season | null => {
  if (slug === "latest") {
    const ongoingSeason = findSeasonByTimestamp();

    if (ongoingSeason) {
      return ongoingSeason;
    }

    const mostRecentlyStartedSeason = seasons.find(
      (season) =>
        season.startDates.us !== null && Date.now() >= season.startDates.us,
    );

    if (mostRecentlyStartedSeason) {
      return mostRecentlyStartedSeason;
    }
  }

  const match = seasons.find((season) => {
    return season.slug === slug;
  });

  return match ?? null;
};
