import type { Region } from "~/data/regions.ts";

const UNKNOWN_SEASON_START_OR_ENDING = null;

export interface Encounter {
  id: number;
  icon: string;
}
export interface Season {
  name: string;
  shortName: string;
  slug: string;
  startDates: Record<Region, number | null>;
  endDates: Record<Region, number | null>;
  seasonIcon: string;
  encounters: readonly Encounter[];
  ptr: boolean;
}

function offsetByRegion(timestamp: number, region: Region): number {
  switch (region) {
    case "US": {
      return timestamp;
    }
    case "EU": {
      return timestamp + 46_800_000;
    }
    case "KR":
    case "TW":
      return timestamp + 111_600_000;
  }
}

export const seasons: readonly Season[] = [
  {
    name: "DF S3",
    shortName: "S3",
    slug: "df-season-3",
    startDates: {
      US: offsetByRegion(1_699_974_000_000, "US"),
      EU: offsetByRegion(1_699_974_000_000, "EU"),
      KR: offsetByRegion(1_699_974_000_000, "KR"),
      TW: offsetByRegion(1_699_974_000_000, "TW"),
    },
    endDates: {
      US: UNKNOWN_SEASON_START_OR_ENDING,
      EU: UNKNOWN_SEASON_START_OR_ENDING,
      KR: UNKNOWN_SEASON_START_OR_ENDING,
      TW: UNKNOWN_SEASON_START_OR_ENDING,
    },
    seasonIcon: "/img/seasons/dragonflight/season3/logo.png",
    encounters: [
      // Council of Dreams
      {
        id: 2728,
        icon: "/img/seasons/dragonflight/season3/encounters/CouncilOfDreams.jpg",
      },
      // Fyrakk, the Blazing
      {
        id: 2677,
        icon: "/img/seasons/dragonflight/season3/encounters/Fyrakk.jpg",
      },
      // Gnarlroot
      {
        id: 2820,
        icon: "/img/seasons/dragonflight/season3/encounters/Gnarlroot.jpg",
      },
      // Igira the Cruel
      {
        id: 2709,
        icon: "/img/seasons/dragonflight/season3/encounters/Igira.jpg",
      },
      // Larodar, Keeper of the Flame
      {
        id: 2731,
        icon: "/img/seasons/dragonflight/season3/encounters/Larodar.jpg",
      },
      // Nymue, Weaver of the Cycle
      {
        id: 2708,
        icon: "/img/seasons/dragonflight/season3/encounters/Nymue.jpg",
      },
      // Smolderon
      {
        id: 2824,
        icon: "/img/seasons/dragonflight/season3/encounters/Smolderon.jpg",
      },
      // Tindral Sageswift, Seer of Flame
      {
        id: 2786,
        icon: "/img/seasons/dragonflight/season3/encounters/Tindral.jpg",
      },
      // Volcoross
      {
        id: 2737,
        icon: "/img/seasons/dragonflight/season3/encounters/Volcoross.jpg",
      },
      // Atal'Dazar
      {
        id: 61763,
        icon: "/img/seasons/dragonflight/season3/encounters/AtalDazar.jpg",
      },
      // Black Rook Hold
      {
        id: 61501,
        icon: "/img/seasons/dragonflight/season3/encounters/BlackRookHold.jpg",
      },
      // Darkheart Thicket
      {
        id: 61466,
        icon: "/img/seasons/dragonflight/season3/encounters/DarkheartThicket.jpg",
      },
      // Everbloom
      {
        id: 61279,
        icon: "/img/seasons/dragonflight/season3/encounters/Everbloom.jpg",
      },
      // Dawn of the Infinites: Galakrond's Fall
      {
        id: 12579,
        icon: "/img/seasons/dragonflight/season3/encounters/GalakrondsFall.jpg",
      },
      // Dawn of the Infinites: Murozond's Rise
      {
        id: 12580,
        icon: "/img/seasons/dragonflight/season3/encounters/MurozondsRise.jpg",
      },
      // Throne of the Tides
      {
        id: 10643,
        icon: "/img/seasons/dragonflight/season3/encounters/ThroneOfTheTides.jpg",
      },
      // Waycrest Manor
      {
        id: 61862,
        icon: "/img/seasons/dragonflight/season3/encounters/WaycrestManor.jpg",
      },
    ],
    ptr: false,
  },
] as const;

export function hasSeasonEndedForAllRegions(slug: string): boolean {
  const season = seasons.find((season) => season.slug === slug);

  if (!season) return true;

  const endDates = Object.values(season.endDates);

  if (endDates.includes(UNKNOWN_SEASON_START_OR_ENDING)) return false;

  const now = Date.now();

  return endDates.every((date) => now >= (date ?? 0));
}

export function findSeasonByTimestamp(timestamp = Date.now()): Season | null {
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
}

export function findSeasonsByTimestamp(timestamp = Date.now()): Season[] {
  return seasons.filter(
    (season) =>
      Object.values(season.startDates).some(
        (start) => start && timestamp >= start,
      ) &&
      Object.values(season.endDates).some(
        (end) => end === UNKNOWN_SEASON_START_OR_ENDING || end > timestamp,
      ),
  );
}

export function findSeasonByName(slug: string): Season | null {
  if (slug === "latest") {
    const ongoingSeason = findSeasonByTimestamp();

    if (ongoingSeason) return ongoingSeason;

    const mostRecentlyStartedSeason = seasons.find(
      (season) =>
        season.startDates.US !== null && Date.now() >= season.startDates.US,
    );

    if (mostRecentlyStartedSeason) return mostRecentlyStartedSeason;
  }

  const match = seasons.find((season) => {
    return season.slug === slug;
  });

  return match ?? null;
}
