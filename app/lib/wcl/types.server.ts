// Generated file, changes will eventually be overwritten!
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends Record<string, unknown>> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends Record<string, unknown>, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
}

export interface ArchonViewModels {
  __typename?: "ArchonViewModels";
  ability?: Maybe<Scalars["JSON"]["output"]>;
  aboutPage?: Maybe<Scalars["JSON"]["output"]>;
  accountPage?: Maybe<Scalars["JSON"]["output"]>;
  adPlacements?: Maybe<Scalars["JSON"]["output"]>;
  announcementPage?: Maybe<Scalars["JSON"]["output"]>;
  article?: Maybe<Scalars["JSON"]["output"]>;
  articleCategories?: Maybe<Scalars["JSON"]["output"]>;
  articleCategory?: Maybe<Scalars["JSON"]["output"]>;
  articleIndexPage?: Maybe<Scalars["JSON"]["output"]>;
  articleSlugs?: Maybe<Scalars["JSON"]["output"]>;
  authErrorPage?: Maybe<Scalars["JSON"]["output"]>;
  buildsClassesAndSpecsPage?: Maybe<Scalars["JSON"]["output"]>;
  buildsSpecPage?: Maybe<Scalars["JSON"]["output"]>;
  buildsSpecPageSlugs?: Maybe<Scalars["JSON"]["output"]>;
  buildsZonePage?: Maybe<Scalars["JSON"]["output"]>;
  buildsZonePageSlugs?: Maybe<Scalars["JSON"]["output"]>;
  cmsNavigation?: Maybe<Scalars["JSON"]["output"]>;
  contactPage?: Maybe<Scalars["JSON"]["output"]>;
  footer?: Maybe<Scalars["JSON"]["output"]>;
  game?: Maybe<Scalars["JSON"]["output"]>;
  gamePage?: Maybe<Scalars["JSON"]["output"]>;
  gameSlugs?: Maybe<Scalars["JSON"]["output"]>;
  googleAnalytics?: Maybe<Scalars["JSON"]["output"]>;
  header?: Maybe<Scalars["JSON"]["output"]>;
  headerTitle?: Maybe<Scalars["JSON"]["output"]>;
  indexPage?: Maybe<Scalars["JSON"]["output"]>;
  pageOfArticlePreviews?: Maybe<Scalars["JSON"]["output"]>;
  signInPage?: Maybe<Scalars["JSON"]["output"]>;
  signOutPage?: Maybe<Scalars["JSON"]["output"]>;
  snippets?: Maybe<Scalars["JSON"]["output"]>;
  translations?: Maybe<Scalars["JSON"]["output"]>;
  user?: Maybe<Scalars["JSON"]["output"]>;
}

export interface ArchonViewModelsAbilityArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface ArchonViewModelsArticleArgs {
  articleCategorySlug?: InputMaybe<Scalars["String"]["input"]>;
  articleSlug?: InputMaybe<Scalars["String"]["input"]>;
  siteName?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsArticleCategoryArgs {
  articleCategorySlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsArticleSlugsArgs {
  articleCategorySlug?: InputMaybe<Scalars["String"]["input"]>;
  siteName?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsBuildsClassesAndSpecsPageArgs {
  gameSlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsBuildsSpecPageArgs {
  affixesSlug?: InputMaybe<Scalars["String"]["input"]>;
  categorySlug?: InputMaybe<Scalars["String"]["input"]>;
  classSlug?: InputMaybe<Scalars["String"]["input"]>;
  difficultySlug?: InputMaybe<Scalars["String"]["input"]>;
  encounterSlug?: InputMaybe<Scalars["String"]["input"]>;
  gameSlug?: InputMaybe<Scalars["String"]["input"]>;
  specSlug?: InputMaybe<Scalars["String"]["input"]>;
  zoneTypeSlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsBuildsZonePageArgs {
  affixesSlug?: InputMaybe<Scalars["String"]["input"]>;
  difficultySlug?: InputMaybe<Scalars["String"]["input"]>;
  encounterSlug?: InputMaybe<Scalars["String"]["input"]>;
  gameSlug?: InputMaybe<Scalars["String"]["input"]>;
  rankingsSlug?: InputMaybe<Scalars["String"]["input"]>;
  zoneTypeSlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsCmsNavigationArgs {
  currentSlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsHeaderArgs {
  gameSlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsPageOfArticlePreviewsArgs {
  articleCategorySlug?: InputMaybe<Scalars["String"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
  siteName?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ArchonViewModelsSnippetsArgs {
  snippetSlugs?: InputMaybe<InputMaybe<Scalars["String"]["input"]>[]>;
}

export interface ArchonViewModelsTranslationsArgs {
  keys?: InputMaybe<InputMaybe<Scalars["String"]["input"]>[]>;
}

/** A bracket description for a given raid zone. Brackets have a minimum value, maximum value, and a bucket that can be used to establish all of the possible brackets. The type field indicates what the brackets represent, e.g., item levels or game patches, etc. */
export interface Bracket {
  __typename?: "Bracket";
  /** A float representing the value to increment when moving from bracket 1 to bracket N, etc. */
  bucket: Scalars["Float"]["output"];
  /** An integer representing the value used by bracket N when there are a total of N brackets, etc. */
  max: Scalars["Float"]["output"];
  /** An integer representing the minimum value used by bracket number 1, etc. */
  min: Scalars["Float"]["output"];
  /** The localized name of the bracket type. */
  type?: Maybe<Scalars["String"]["output"]>;
}

/** A player character. Characters can earn individual rankings and appear in reports. */
export interface Character {
  __typename?: "Character";
  /** The canonical ID of the character. If a character renames or transfers, then the canonical id can be used to identify the most recent version of the character. */
  canonicalID: Scalars["Int"]["output"];
  /** Whether this character is claimed by the current user. Only accessible if accessed via the user API with the "view-user-profile" scope. */
  claimed?: Maybe<Scalars["Boolean"]["output"]>;
  /** The class id of the character. */
  classID: Scalars["Int"]["output"];
  /** Encounter rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  encounterRankings?: Maybe<Scalars["JSON"]["output"]>;
  /** The faction of the character. */
  faction: GameFaction;
  /** Cached game data such as gear for the character. This data was fetched from the appropriate source (Blizzard APIs for WoW, Lodestone for FF). This call will only return a cached copy of the data if it exists already. It will not go out to Blizzard or Lodestone to fetch a new copy. */
  gameData?: Maybe<Scalars["JSON"]["output"]>;
  /** The guild rank of the character in their primary guild. This is not the user rank on the site, but the rank according to the game data, e.g., a Warcraft guild rank or an FFXIV Free Company rank. */
  guildRank: Scalars["Int"]["output"];
  /** All guilds that the character belongs to. */
  guilds?: Maybe<Maybe<Guild>[]>;
  /** Whether or not the character has all its rankings hidden. */
  hidden: Scalars["Boolean"]["output"];
  /** The ID of the character. */
  id: Scalars["Int"]["output"];
  /** The level of the character. */
  level: Scalars["Int"]["output"];
  /** The name of the character. */
  name: Scalars["String"]["output"];
  /** Recent reports for the character. */
  recentReports?: Maybe<ReportPagination>;
  /** The server that the character belongs to. */
  server: Server;
  /** Rankings information for a character, filterable to specific zones, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  zoneRankings?: Maybe<Scalars["JSON"]["output"]>;
}

/** A player character. Characters can earn individual rankings and appear in reports. */
export interface CharacterEncounterRankingsArgs {
  byBracket?: InputMaybe<Scalars["Boolean"]["input"]>;
  className?: InputMaybe<Scalars["String"]["input"]>;
  compare?: InputMaybe<RankingCompareType>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  includeCombatantInfo?: InputMaybe<Scalars["Boolean"]["input"]>;
  includePrivateLogs?: InputMaybe<Scalars["Boolean"]["input"]>;
  metric?: InputMaybe<CharacterRankingMetricType>;
  partition?: InputMaybe<Scalars["Int"]["input"]>;
  role?: InputMaybe<RoleType>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  specName?: InputMaybe<Scalars["String"]["input"]>;
  timeframe?: InputMaybe<RankingTimeframeType>;
}

/** A player character. Characters can earn individual rankings and appear in reports. */
export interface CharacterGameDataArgs {
  forceUpdate?: InputMaybe<Scalars["Boolean"]["input"]>;
  specID?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A player character. Characters can earn individual rankings and appear in reports. */
export interface CharacterRecentReportsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A player character. Characters can earn individual rankings and appear in reports. */
export interface CharacterZoneRankingsArgs {
  byBracket?: InputMaybe<Scalars["Boolean"]["input"]>;
  className?: InputMaybe<Scalars["String"]["input"]>;
  compare?: InputMaybe<RankingCompareType>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  includePrivateLogs?: InputMaybe<Scalars["Boolean"]["input"]>;
  metric?: InputMaybe<CharacterRankingMetricType>;
  partition?: InputMaybe<Scalars["Int"]["input"]>;
  role?: InputMaybe<RoleType>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  specName?: InputMaybe<Scalars["String"]["input"]>;
  timeframe?: InputMaybe<RankingTimeframeType>;
  zoneID?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The CharacterData object enables the retrieval of single characters or filtered collections of characters. */
export interface CharacterData {
  __typename?: "CharacterData";
  /** Obtain a specific character either by id or by name/server_slug/server_region. */
  character?: Maybe<Character>;
  /** A collection of characters for a specific guild. */
  characters?: Maybe<CharacterPagination>;
}

/** The CharacterData object enables the retrieval of single characters or filtered collections of characters. */
export interface CharacterDataCharacterArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
}

/** The CharacterData object enables the retrieval of single characters or filtered collections of characters. */
export interface CharacterDataCharactersArgs {
  guildID?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface CharacterPagination {
  __typename?: "CharacterPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<Character>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** All the possible metrics. */
export enum CharacterRankingMetricType {
  /** Boss cDPS is unique to FFXIV and is damage done to the boss adjusted for raid-contributing buffs and debuffs. */
  Bosscdps = "bosscdps",
  /** Boss damage per second. */
  Bossdps = "bossdps",
  /** Boss nDPS is unique to FFXIV and is damage done to the boss adjusted for raid-contributing buffs and debuffs. */
  Bossndps = "bossndps",
  /** Boss rDPS is unique to FFXIV and is damage done to the boss adjusted for raid-contributing buffs and debuffs. */
  Bossrdps = "bossrdps",
  /** cDPS is unique to FFXIV and is damage done adjusted for raid-contributing buffs and debuffs. */
  Cdps = "cdps",
  /** Choose an appropriate default depending on the other selected parameters. */
  Default = "default",
  /** Damage per second. */
  Dps = "dps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedbosscdps = "healercombinedbosscdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedbossdps = "healercombinedbossdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedbossndps = "healercombinedbossndps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedbossrdps = "healercombinedbossrdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedcdps = "healercombinedcdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombineddps = "healercombineddps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedndps = "healercombinedndps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of healers in eight player content. */
  Healercombinedrdps = "healercombinedrdps",
  /** Healing per second. */
  Hps = "hps",
  /** Survivability ranking for tanks. Deprecated. Only supported for some older WoW zones. */
  Krsi = "krsi",
  /** nDPS is unique to FFXIV and is damage done adjusted for raid-contributing buffs and debuffs. */
  Ndps = "ndps",
  /** Score. Used by WoW Mythic dungeons and by ESO trials. */
  Playerscore = "playerscore",
  /** Speed. Not supported by every zone. */
  Playerspeed = "playerspeed",
  /** rDPS is unique to FFXIV and is damage done adjusted for raid-contributing buffs and debuffs. */
  Rdps = "rdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedbosscdps = "tankcombinedbosscdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedbossdps = "tankcombinedbossdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedbossndps = "tankcombinedbossndps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedbossrdps = "tankcombinedbossrdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedcdps = "tankcombinedcdps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombineddps = "tankcombineddps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedndps = "tankcombinedndps",
  /** Unique to FFXIV. Represents the combined ranking for a pair of tanks in eight player content. */
  Tankcombinedrdps = "tankcombinedrdps",
  /** Healing done per second to tanks. */
  Tankhps = "tankhps",
  /** Weighted damage per second. Unique to WoW currently. Used to remove pad damage and reward damage done to high priority targets. */
  Wdps = "wdps",
}

/** A single difficulty for a given raid zone. Difficulties have an integer value representing the actual difficulty, a localized name that describes the difficulty level, and a list of valid sizes for the difficulty level. */
export interface Difficulty {
  __typename?: "Difficulty";
  /** An integer representing a specific difficulty level within a zone. For example, in World of Warcraft, this could be Mythic. In FF, it could be Savage, etc. */
  id: Scalars["Int"]["output"];
  /** The localized name for the difficulty level. */
  name: Scalars["String"]["output"];
  /** A list of supported sizes for the difficulty level. An empty result means that the difficulty level has a flexible raid size. */
  sizes?: Maybe<Maybe<Scalars["Int"]["output"]>[]>;
}

/** A single encounter for the game. */
export interface Encounter {
  __typename?: "Encounter";
  /** Player rankings information for a zone. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  characterRankings?: Maybe<Scalars["JSON"]["output"]>;
  /** Fight rankings information for a zone. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  fightRankings?: Maybe<Scalars["JSON"]["output"]>;
  /** The ID of the encounter. */
  id: Scalars["Int"]["output"];
  /** The Blizzard journal ID, used as the identifier in the encounter journal and various Blizzard APIs like progression. */
  journalID: Scalars["Int"]["output"];
  /** The localized name of the encounter. */
  name: Scalars["String"]["output"];
  /** The zone that this encounter is found in. */
  zone: Zone;
}

/** A single encounter for the game. */
export interface EncounterCharacterRankingsArgs {
  bracket?: InputMaybe<Scalars["Int"]["input"]>;
  className?: InputMaybe<Scalars["String"]["input"]>;
  covenantID?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  externalBuffs?: InputMaybe<ExternalBuffRankFilter>;
  filter?: InputMaybe<Scalars["String"]["input"]>;
  hardModeLevel?: InputMaybe<HardModeLevelRankFilter>;
  includeCombatantInfo?: InputMaybe<Scalars["Boolean"]["input"]>;
  leaderboard?: InputMaybe<LeaderboardRank>;
  metric?: InputMaybe<CharacterRankingMetricType>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  partition?: InputMaybe<Scalars["Int"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  soulbindID?: InputMaybe<Scalars["Int"]["input"]>;
  specName?: InputMaybe<Scalars["String"]["input"]>;
}

/** A single encounter for the game. */
export interface EncounterFightRankingsArgs {
  bracket?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  filter?: InputMaybe<Scalars["String"]["input"]>;
  hardModeLevel?: InputMaybe<HardModeLevelRankFilter>;
  leaderboard?: InputMaybe<LeaderboardRank>;
  metric?: InputMaybe<FightRankingMetricType>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  partition?: InputMaybe<Scalars["Int"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface EncounterPhases {
  __typename?: "EncounterPhases";
  encounterID: Scalars["Int"]["output"];
  /** Phase metadata for all phases in this encounter. */
  phases?: Maybe<PhaseMetadata[]>;
  /** Whether the phases can be used to separate wipes in the report UI. */
  separatesWipes?: Maybe<Scalars["Boolean"]["output"]>;
}

/** The type of events or tables to examine. */
export enum EventDataType {
  /** All Events */
  All = "All",
  /** Buffs. */
  Buffs = "Buffs",
  /** Casts. */
  Casts = "Casts",
  /** Combatant info events (includes gear). */
  CombatantInfo = "CombatantInfo",
  /** Damage done. */
  DamageDone = "DamageDone",
  /** Damage taken. */
  DamageTaken = "DamageTaken",
  /** Deaths. */
  Deaths = "Deaths",
  /** Debuffs. */
  Debuffs = "Debuffs",
  /** Dispels. */
  Dispels = "Dispels",
  /** Healing done. */
  Healing = "Healing",
  /** Interrupts. */
  Interrupts = "Interrupts",
  /** Resources. */
  Resources = "Resources",
  /** Summons */
  Summons = "Summons",
  /** Threat. */
  Threat = "Threat",
}

/** A single expansion for the game. */
export interface Expansion {
  __typename?: "Expansion";
  /** The ID of the expansion. */
  id: Scalars["Int"]["output"];
  /** The localized name of the expansion. */
  name: Scalars["String"]["output"];
  /** The zones (e.g., raids and dungeons) supported for this expansion. */
  zones?: Maybe<Maybe<Zone>[]>;
}

/** Whether to include ranks with major external buffs. Not all metrics, zones and games support this. It will be ignored if unsupported. */
export enum ExternalBuffRankFilter {
  /** Include all ranks, regardless of external buffs. */
  Any = "Any",
  /** Only include ranks that DO NOT CONTAIN external buffs. */
  Exclude = "Exclude",
  /** Only include ranks that DO CONTAIN external buffs. */
  Require = "Require",
}

/** All the possible metrics. */
export enum FightRankingMetricType {
  /** Choose an appropriate default depending on the other selected parameters. */
  Default = "default",
  /** A metric that rewards minimizing deaths and damage taken. */
  Execution = "execution",
  /** Feats of strength in WoW or Challenges in FF. */
  Feats = "feats",
  /** Progress metric, based off when the fight was defeated. */
  Progress = "progress",
  /** For Mythic+ dungeons in WoW, represents the team's score. Used for ESO trials and dungeons also. */
  Score = "score",
  /** Speed metric, based off the duration of the fight. */
  Speed = "speed",
}

/** A single ability for the game. */
export interface GameAbility {
  __typename?: "GameAbility";
  /** The icon for the ability. */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The ID of the ability. */
  id: Scalars["Int"]["output"];
  /** The localized name of the ability. Will be null if no localization information exists for the ability. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameAbilityPagination {
  __typename?: "GameAbilityPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameAbility>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A single achievement for the game. */
export interface GameAchievement {
  __typename?: "GameAchievement";
  /** The icon for the achievement. */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The ID of the achievement. */
  id: Scalars["Int"]["output"];
  /** The localized name of the achievement. Will be null if no localization information exists for the achievement. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameAchievementPagination {
  __typename?: "GameAchievementPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameAchievement>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A single affix for Mythic Keystone dungeons. */
export interface GameAffix {
  __typename?: "GameAffix";
  /** The icon for the affix. */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The ID of the affix. */
  id: Scalars["Int"]["output"];
  /** The localized name of the affix. Will be null if no localization information exists for the affix. */
  name?: Maybe<Scalars["String"]["output"]>;
}

/** A single player class for the game. */
export interface GameClass {
  __typename?: "GameClass";
  /** An integer used to identify the class. */
  id: Scalars["Int"]["output"];
  /** The localized name of the class. */
  name: Scalars["String"]["output"];
  /** A slug used to identify the class. */
  slug: Scalars["String"]["output"];
  /** The specs supported by the class. */
  specs?: Maybe<Maybe<GameSpec>[]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameData {
  __typename?: "GameData";
  /** The player and enemy abilities for the game. */
  abilities?: Maybe<GameAbilityPagination>;
  /** Obtain a single ability for the game. */
  ability?: Maybe<GameAbility>;
  /** Obtain a single achievement for the game. */
  achievement?: Maybe<GameAchievement>;
  /** Achievements for the game. */
  achievements?: Maybe<GameAchievementPagination>;
  /** Obtain a single affix for the game. */
  affix?: Maybe<GameAffix>;
  /** The affixes for the game. */
  affixes?: Maybe<Maybe<GameAffix>[]>;
  /** Obtain a single class for the game. */
  class?: Maybe<GameClass>;
  /** Obtain the supported classes for the game. */
  classes?: Maybe<Maybe<GameClass>[]>;
  /** Obtain a single enchant for the game. */
  enchant?: Maybe<GameEnchant>;
  /** Enchants for the game. */
  enchants?: Maybe<GameEnchantPagination>;
  /** Obtain all the factions that guilds and players can belong to. */
  factions?: Maybe<Maybe<GameFaction>[]>;
  /** Obtain a single item for the game. */
  item?: Maybe<GameItem>;
  /** Obtain a single item set for the game. */
  item_set?: Maybe<GameItemSet>;
  /** Item sets for the game. */
  item_sets?: Maybe<GameItemSetPagination>;
  /** Items for the game. */
  items?: Maybe<GameItemPagination>;
  /** Obtain a single map for the game. */
  map?: Maybe<GameMap>;
  /** Maps for the game. */
  maps?: Maybe<GameMapPagination>;
  /** Obtain a single NPC for the game. */
  npc?: Maybe<GameNpc>;
  /** NPCs for the game. */
  npcs?: Maybe<GameNpcPagination>;
  /** Obtain a single zone for the game, not to be confused with the worldData zones for ranking bosses and dungeons. */
  zone?: Maybe<GameZone>;
  /** Zones for the game. */
  zones?: Maybe<GameZonePagination>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataAbilitiesArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataAbilityArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataAchievementArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataAchievementsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataAffixArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataClassArgs {
  faction_id?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  zone_id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataClassesArgs {
  faction_id?: InputMaybe<Scalars["Int"]["input"]>;
  zone_id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataEnchantArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataEnchantsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataItemArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataItem_SetArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataItem_SetsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataItemsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataMapArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataMapsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataNpcArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataNpcsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataZoneArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The game object contains collections of data such as NPCs, classes, abilities, items, maps, etc. Game data only changes when major game patches are released, so you should cache results for as long as possible and only update when new content is released for the game. */
export interface GameDataZonesArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single enchant for the game. */
export interface GameEnchant {
  __typename?: "GameEnchant";
  /** The ID of the enchant. */
  id: Scalars["Int"]["output"];
  /** The localized name of the enchant. Will be null if no localization information exists for the enchant. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameEnchantPagination {
  __typename?: "GameEnchantPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameEnchant>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A faction that a player or guild can belong to. Factions have an integer id used to identify them throughout the API and a localized name describing the faction. */
export interface GameFaction {
  __typename?: "GameFaction";
  /** An integer representing the faction id. */
  id: Scalars["Int"]["output"];
  /** The localized name of the faction. */
  name: Scalars["String"]["output"];
}

/** A single item for the game. */
export interface GameItem {
  __typename?: "GameItem";
  /** The icon for the item. */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The ID of the item. */
  id: Scalars["Int"]["output"];
  /** The localized name of the item. Will be null if no localization information exists for the item. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameItemPagination {
  __typename?: "GameItemPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameItem>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A single item set for the game. */
export interface GameItemSet {
  __typename?: "GameItemSet";
  /** The ID of the item set. */
  id: Scalars["Int"]["output"];
  /** The localized name of the item set. Will be null if no localization information exists for the item set. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameItemSetPagination {
  __typename?: "GameItemSetPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameItemSet>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A single map for the game. */
export interface GameMap {
  __typename?: "GameMap";
  /** The ID of the map. */
  id: Scalars["Int"]["output"];
  /** The localized name of the map. Will be null if no localization information exists for the map. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameMapPagination {
  __typename?: "GameMapPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameMap>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A single NPC for the game. */
export interface GameNpc {
  __typename?: "GameNPC";
  /** The ID of the NPC. */
  id: Scalars["Int"]["output"];
  /** The localized name of the NPC. Will be null if no localization information exists for the NPC. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameNpcPagination {
  __typename?: "GameNPCPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameNpc>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A spec for a given player class. */
export interface GameSpec {
  __typename?: "GameSpec";
  /** The player class that the spec belongs to. */
  class?: Maybe<GameClass>;
  /** An integer used to identify the spec. */
  id: Scalars["Int"]["output"];
  /** The localized name of the class. */
  name: Scalars["String"]["output"];
  /** A slug used to identify the spec. */
  slug: Scalars["String"]["output"];
}

/** A single zone for the game. */
export interface GameZone {
  __typename?: "GameZone";
  /** The ID of the zone. */
  id: Scalars["Float"]["output"];
  /** The localized name of the zone. Will be null if no localization information exists for the zone. */
  name?: Maybe<Scalars["String"]["output"]>;
}

export interface GameZonePagination {
  __typename?: "GameZonePagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GameZone>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** The type of graph to examine. */
export enum GraphDataType {
  /** Buffs. */
  Buffs = "Buffs",
  /** Casts. */
  Casts = "Casts",
  /** Damage done. */
  DamageDone = "DamageDone",
  /** Damage taken. */
  DamageTaken = "DamageTaken",
  /** Deaths. */
  Deaths = "Deaths",
  /** Debuffs. */
  Debuffs = "Debuffs",
  /** Dispels. */
  Dispels = "Dispels",
  /** Healing done. */
  Healing = "Healing",
  /** Interrupts. */
  Interrupts = "Interrupts",
  /** Resources. */
  Resources = "Resources",
  /** Summary Overview */
  Summary = "Summary",
  /** Summons */
  Summons = "Summons",
  /** Survivability (death info across multiple pulls). */
  Survivability = "Survivability",
  /** Threat. */
  Threat = "Threat",
}

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export interface Guild {
  __typename?: "Guild";
  attendance: GuildAttendancePagination;
  /** Whether or not the guild has competition mode enabled. */
  competitionMode: Scalars["Boolean"]["output"];
  /** The current user's rank within the guild. Only accessible via user authentication with the "view-user-profile" scope. */
  currentUserRank?: Maybe<GuildRank>;
  /** The description for the guild that is displayed with the guild name on the site. */
  description: Scalars["String"]["output"];
  /** The faction of the guild. */
  faction: GameFaction;
  /** The ID of the guild. */
  id: Scalars["Int"]["output"];
  /** The member roster for a specific guild. The result of this query is a paginated list of characters. This query only works for games where the guild roster is verifiable, e.g., it does not work for Classic Warcraft. */
  members: CharacterPagination;
  /** The name of the guild. */
  name: Scalars["String"]["output"];
  /** The server that the guild belongs to. */
  server: Server;
  /** Whether or not the guild has stealth mode enabled. */
  stealthMode: Scalars["Boolean"]["output"];
  /** The tags used to label reports. In the site UI, these are called raid teams. */
  tags?: Maybe<Maybe<GuildTag>[]>;
  /** The guild's ranking for a zone. If `zoneId` is unset or null, uses the latest zone. */
  zoneRanking: GuildZoneRankings;
}

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export interface GuildAttendanceArgs {
  guildTagID?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  zoneID?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export interface GuildMembersArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single guild. Guilds earn their own rankings and contain characters. They may correspond to a guild in-game or be a custom guild created just to hold reports and rankings. */
export interface GuildZoneRankingArgs {
  zoneId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Attendance for a specific report within a guild. */
export interface GuildAttendance {
  __typename?: "GuildAttendance";
  /** The code of the report for the raid night. */
  code: Scalars["String"]["output"];
  /** The players that attended that raid night. */
  players?: Maybe<Maybe<PlayerAttendance>[]>;
  /** The start time of the raid night. */
  startTime?: Maybe<Scalars["Float"]["output"]>;
  /** The principal zone of the raid night. */
  zone?: Maybe<Zone>;
}

export interface GuildAttendancePagination {
  __typename?: "GuildAttendancePagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<GuildAttendance>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export interface GuildData {
  __typename?: "GuildData";
  /** Obtain a specific guild either by id or by name/serverSlug/serverRegion. */
  guild?: Maybe<Guild>;
  /** The set of all guilds supported by the site. Can be optionally filtered to a specific server id. */
  guilds?: Maybe<GuildPagination>;
}

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export interface GuildDataGuildArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
}

/** The GuildData object enables the retrieval of single guilds or filtered collections of guilds. */
export interface GuildDataGuildsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  serverID?: InputMaybe<Scalars["Int"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
}

export interface GuildPagination {
  __typename?: "GuildPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<Guild>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** Rank within a guild or team on the website. This is separate from in-game ranks and does NOT correspond to the rank of the user or character in-game. */
export enum GuildRank {
  Applicant = "Applicant",
  GuildMaster = "GuildMaster",
  Member = "Member",
  /** The user is not a member of this guild or team. */
  NonMember = "NonMember",
  Officer = "Officer",
  Recruit = "Recruit",
}

/** The tag for a specific guild. Tags can be used to categorize reports within a guild. In the site UI, they are referred to as report tags. */
export interface GuildTag {
  __typename?: "GuildTag";
  /** The guild that the tag belongs to. */
  guild: Guild;
  /** The ID of the tag. */
  id: Scalars["Int"]["output"];
  /** The name of the tag. */
  name: Scalars["String"]["output"];
}

/** A guild's rankings within a zone. */
export interface GuildZoneRankings {
  __typename?: "GuildZoneRankings";
  /** The complete raid speed ranks for the guild. Most non-Classic WoW zones do not support complete raid ranks. */
  completeRaidSpeed?: Maybe<WorldRegionServerRankPositions>;
  /** The progress ranks for the guild. Always uses the highest difficulty. */
  progress?: Maybe<WorldRegionServerRankPositions>;
  /** The all-star based speed rank for the guild. */
  speed?: Maybe<WorldRegionServerRankPositions>;
}

/** A guild's rankings within a zone. */
export interface GuildZoneRankingsCompleteRaidSpeedArgs {
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A guild's rankings within a zone. */
export interface GuildZoneRankingsProgressArgs {
  size?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A guild's rankings within a zone. */
export interface GuildZoneRankingsSpeedArgs {
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Hard mode level filter. Used for WoW Classic Hard Modes. For ESO hard modes, use `difficulty`. Hard mode levels range from 0-4, with 0 being normal mode and 4 being the highest hard mode. */
export enum HardModeLevelRankFilter {
  /** Any hard mode level (including normal mode). */
  Any = "Any",
  /** The highest hard mode level. Convenience alias for hard mode level 4. */
  Highest = "Highest",
  /** Hard mode level 0. */
  Level0 = "Level0",
  /** Hard mode level 1. */
  Level1 = "Level1",
  /** Hard mode level 2. */
  Level2 = "Level2",
  /** Hard mode level 3. */
  Level3 = "Level3",
  /** Hard mode level 4. */
  Level4 = "Level4",
  /** The normal (non-hard) mode level. Convenience alias for hard mode level 0. */
  NormalMode = "NormalMode",
}

/** Whether or not to fetch information for friendlies or enemies. */
export enum HostilityType {
  /** Fetch information for enemies. */
  Enemies = "Enemies",
  /** Fetch information for friendlies. */
  Friendlies = "Friendlies",
}

/** A filter for kills vs wipes and encounters vs trash. */
export enum KillType {
  /** Include trash and encounters. */
  All = "All",
  /** Only include encounters (kills and wipes). */
  Encounters = "Encounters",
  /** Only include encounters that end in a kill. */
  Kills = "Kills",
  /** Only include trash. */
  Trash = "Trash",
  /** Only include encounters that end in a wipe. */
  Wipes = "Wipes",
}

/** Source of the rank. Most ranks only support log ranks, but some games (ESO) and content types (Retail WoW M+) support leaderboard ranks with no backing log. */
export enum LeaderboardRank {
  /** All ranks are included. */
  Any = "Any",
  /** Only include ranks with a backing log. */
  LogsOnly = "LogsOnly",
}

/** A single partition for a given raid zone. Partitions have an integer value representing the actual partition and a localized name that describes what the partition represents. Partitions contain their own rankings, statistics and all stars. */
export interface Partition {
  __typename?: "Partition";
  /** The compact localized name for the partition. Typically an abbreviation to conserve space. */
  compactName: Scalars["String"]["output"];
  /** Whether or not the partition is the current default when viewing rankings or statistics for the zone. */
  default: Scalars["Boolean"]["output"];
  /** An integer representing a specific partition within a zone. */
  id: Scalars["Int"]["output"];
  /** The localized name for partition. */
  name: Scalars["String"]["output"];
}

/** Information about a phase from a boss encounter. */
export interface PhaseMetadata {
  __typename?: "PhaseMetadata";
  /** Phase ID. 1-indexed */
  id: Scalars["Int"]["output"];
  /** Whether this phase represents an intermission. */
  isIntermission?: Maybe<Scalars["Boolean"]["output"]>;
  name: Scalars["String"]["output"];
}

/** A spartan representation of phase transitions during a fight. */
export interface PhaseTransition {
  __typename?: "PhaseTransition";
  /** The 1-indexed id of the phase. Phase IDs are absolute within a fight: phases with the same ID correspond to the same semantic phase. */
  id: Scalars["Int"]["output"];
  /** The report-relative timestamp of the transition into the phase. The phase ends at the beginning of the next phase, or at the end of the fight. */
  startTime: Scalars["Int"]["output"];
}

/** Attendance for a specific player on a specific raid night. */
export interface PlayerAttendance {
  __typename?: "PlayerAttendance";
  /** The name of the player. */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Presence info for the player. A value of 1 means the player was present. A value of 2 indicates present but on the bench. */
  presence?: Maybe<Scalars["Int"]["output"]>;
  /** The class of the player. */
  type?: Maybe<Scalars["String"]["output"]>;
}

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export interface ProgressRaceData {
  __typename?: "ProgressRaceData";
  /** Detailed composition data for a given guild and encounter. */
  detailedComposition?: Maybe<Scalars["JSON"]["output"]>;
  /** Progress race information including best percentages, pull counts and streams for top guilds. This API is only active when there is an ongoing race. The format of this JSON may change without notice and is not considered frozen. */
  progressRace?: Maybe<Scalars["JSON"]["output"]>;
}

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export interface ProgressRaceDataDetailedCompositionArgs {
  competitionID?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  guildID?: InputMaybe<Scalars["Int"]["input"]>;
  guildName?: InputMaybe<Scalars["String"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A way to obtain data for the top guilds involved in an ongoing world first or realm first progress race. */
export interface ProgressRaceDataProgressRaceArgs {
  competitionID?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  guildID?: InputMaybe<Scalars["Int"]["input"]>;
  guildName?: InputMaybe<Scalars["String"]["input"]>;
  serverRegion?: InputMaybe<Scalars["String"]["input"]>;
  serverSlug?: InputMaybe<Scalars["String"]["input"]>;
  serverSubregion?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  zoneID?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface Query {
  __typename?: "Query";
  /** Obtain the character data object that allows the retrieval of individual characters or filtered collections of characters. */
  characterData?: Maybe<CharacterData>;
  /** Obtain the game data object that holds collections of static data such as abilities, achievements, classes, items, NPCs, etc.. */
  gameData?: Maybe<GameData>;
  /** Obtain the guild data object that allows the retrieval of individual guilds or filtered collections of guilds. */
  guildData?: Maybe<GuildData>;
  /** Obtain information about an ongoing world first or realm first race. Inactive when no race is occurring. This data only updates once every 30 seconds, so you do not need to fetch this information more often than that. */
  progressRaceData?: Maybe<ProgressRaceData>;
  /** Obtain the rate limit data object to see how many points have been spent by this key. */
  rateLimitData?: Maybe<RateLimitData>;
  /** Obtain the report data object that allows the retrieval of individual reports or filtered collections of reports by guild or by user. */
  reportData?: Maybe<ReportData>;
  /** Obtain the user object that allows the retrieval of the authorized user's id and username. */
  userData?: Maybe<UserData>;
  /** Obtain the world data object that holds collections of data such as all expansions, regions, subregions, servers, dungeon/raid zones, and encounters. */
  worldData?: Maybe<WorldData>;
}

export interface Rank {
  __typename?: "Rank";
  /** The color class used by the site for this rank. */
  color: Scalars["String"]["output"];
  /** The ordinal rank (usually written "Rank N"). Rank 1 = highest. */
  number: Scalars["Int"]["output"];
  /** The percentile of the rank as an integer in [0, 100]. Always null for guild ranks. */
  percentile?: Maybe<Scalars["Int"]["output"]>;
}

/** Whether or not rankings are compared against best scores for the entire tier or against all parses in a two week window. */
export enum RankingCompareType {
  /** Compare against all parses in a two week window. */
  Parses = "Parses",
  /** Compare against rankings. */
  Rankings = "Rankings",
}

/** Whether or not rankings are today or historical. */
export enum RankingTimeframeType {
  /** Compare against historical rankings. */
  Historical = "Historical",
  /** Compare against today's rankings. */
  Today = "Today",
}

/** A way to obtain your current rate limit usage. */
export interface RateLimitData {
  __typename?: "RateLimitData";
  /** The total amount of points this API key can spend per hour. */
  limitPerHour: Scalars["Int"]["output"];
  /** The number of seconds remaining until the points reset. */
  pointsResetIn: Scalars["Int"]["output"];
  /** The total amount of points spent during this hour. */
  pointsSpentThisHour: Scalars["Float"]["output"];
}

/** A single region for the game. */
export interface Region {
  __typename?: "Region";
  /** The localized compact name of the region, e.g., US for United States. */
  compactName: Scalars["String"]["output"];
  /** The ID of the region. */
  id: Scalars["Int"]["output"];
  /** The localized name of the region. */
  name: Scalars["String"]["output"];
  /** The servers found within this region. */
  servers?: Maybe<ServerPagination>;
  /** The slug for the region, usable when looking up characters and guilds by server. */
  slug: Scalars["String"]["output"];
  /** The subregions found within this region. */
  subregions?: Maybe<Maybe<Subregion>[]>;
}

/** A single region for the game. */
export interface RegionServersArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface Report {
  __typename?: "Report";
  /** Whether this report has been archived. Events, tables, and graphs for archived reports are inaccessible unless the retrieving user has a subscription including archive access. */
  archiveStatus?: Maybe<ReportArchiveStatus>;
  /** The report code, a unique value used to identify the report. */
  code: Scalars["String"]["output"];
  /** The end time of the report. This is a UNIX timestamp representing the timestamp of the last event contained in the report. */
  endTime: Scalars["Float"]["output"];
  /** A set of paginated report events, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  events?: Maybe<ReportEventPaginator>;
  /** The number of exported segments in the report. This is how many segments have been processed for rankings. */
  exportedSegments: Scalars["Int"]["output"];
  /** A set of fights with details about participating players. */
  fights?: Maybe<Maybe<ReportFight>[]>;
  /** A graph of information for a report, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  graph?: Maybe<Scalars["JSON"]["output"]>;
  /** The guild that the report belongs to. If this is null, then the report was uploaded to the user's personal logs. */
  guild?: Maybe<Guild>;
  /** The guild tag that the report belongs to. If this is null, then the report was not tagged. */
  guildTag?: Maybe<GuildTag>;
  /** Data from the report's master file. This includes version info, all of the players, NPCs and pets that occur in the report, and all the game abilities used in the report. */
  masterData?: Maybe<ReportMasterData>;
  /** The user that uploaded the report. */
  owner?: Maybe<User>;
  /** Phase information for all boss encounters observed in this report. This requires loading fight data, but does not double-charge API points if you load fights and phases. */
  phases?: Maybe<EncounterPhases[]>;
  /** A table of information for the players of a report, including their specs, talents, gear, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  playerDetails?: Maybe<Scalars["JSON"]["output"]>;
  /** A list of all characters that ranked on kills in the report. */
  rankedCharacters?: Maybe<Maybe<Character>[]>;
  /** Rankings information for a report, filterable to specific fights, bosses, metrics, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  rankings?: Maybe<Scalars["JSON"]["output"]>;
  /** The region of the report. */
  region?: Maybe<Region>;
  /** The revision of the report. This number is increased when reports get re-exported. */
  revision: Scalars["Int"]["output"];
  /** The number of uploaded segments in the report. */
  segments: Scalars["Int"]["output"];
  /** The start time of the report. This is a UNIX timestamp representing the timestamp of the first event contained in the report. */
  startTime: Scalars["Float"]["output"];
  /** A table of information for a report, filterable via arguments like type, source, target, ability, etc. This data is not considered frozen, and it can change without notice. Use at your own risk. */
  table?: Maybe<Scalars["JSON"]["output"]>;
  /** A title for the report. */
  title: Scalars["String"]["output"];
  /** The visibility level of the report. The possible values are 'public', 'private', and 'unlisted'. */
  visibility: Scalars["String"]["output"];
  /** The principal zone that the report contains fights for. Null if no supported zone exists. */
  zone?: Maybe<Zone>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportEventsArgs {
  abilityID?: InputMaybe<Scalars["Float"]["input"]>;
  dataType?: InputMaybe<EventDataType>;
  death?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  endTime?: InputMaybe<Scalars["Float"]["input"]>;
  fightIDs?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  filterExpression?: InputMaybe<Scalars["String"]["input"]>;
  hostilityType?: InputMaybe<HostilityType>;
  includeResources?: InputMaybe<Scalars["Boolean"]["input"]>;
  killType?: InputMaybe<KillType>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sourceAurasAbsent?: InputMaybe<Scalars["String"]["input"]>;
  sourceAurasPresent?: InputMaybe<Scalars["String"]["input"]>;
  sourceClass?: InputMaybe<Scalars["String"]["input"]>;
  sourceID?: InputMaybe<Scalars["Int"]["input"]>;
  sourceInstanceID?: InputMaybe<Scalars["Int"]["input"]>;
  startTime?: InputMaybe<Scalars["Float"]["input"]>;
  targetAurasAbsent?: InputMaybe<Scalars["String"]["input"]>;
  targetAurasPresent?: InputMaybe<Scalars["String"]["input"]>;
  targetClass?: InputMaybe<Scalars["String"]["input"]>;
  targetID?: InputMaybe<Scalars["Int"]["input"]>;
  targetInstanceID?: InputMaybe<Scalars["Int"]["input"]>;
  translate?: InputMaybe<Scalars["Boolean"]["input"]>;
  useAbilityIDs?: InputMaybe<Scalars["Boolean"]["input"]>;
  useActorIDs?: InputMaybe<Scalars["Boolean"]["input"]>;
  viewOptions?: InputMaybe<Scalars["Int"]["input"]>;
  wipeCutoff?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportFightsArgs {
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  fightIDs?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  killType?: InputMaybe<KillType>;
  translate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportGraphArgs {
  abilityID?: InputMaybe<Scalars["Float"]["input"]>;
  dataType?: InputMaybe<GraphDataType>;
  death?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  endTime?: InputMaybe<Scalars["Float"]["input"]>;
  fightIDs?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  filterExpression?: InputMaybe<Scalars["String"]["input"]>;
  hostilityType?: InputMaybe<HostilityType>;
  killType?: InputMaybe<KillType>;
  sourceAurasAbsent?: InputMaybe<Scalars["String"]["input"]>;
  sourceAurasPresent?: InputMaybe<Scalars["String"]["input"]>;
  sourceClass?: InputMaybe<Scalars["String"]["input"]>;
  sourceID?: InputMaybe<Scalars["Int"]["input"]>;
  sourceInstanceID?: InputMaybe<Scalars["Int"]["input"]>;
  startTime?: InputMaybe<Scalars["Float"]["input"]>;
  targetAurasAbsent?: InputMaybe<Scalars["String"]["input"]>;
  targetAurasPresent?: InputMaybe<Scalars["String"]["input"]>;
  targetClass?: InputMaybe<Scalars["String"]["input"]>;
  targetID?: InputMaybe<Scalars["Int"]["input"]>;
  targetInstanceID?: InputMaybe<Scalars["Int"]["input"]>;
  translate?: InputMaybe<Scalars["Boolean"]["input"]>;
  viewBy?: InputMaybe<ViewType>;
  viewOptions?: InputMaybe<Scalars["Int"]["input"]>;
  wipeCutoff?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportMasterDataArgs {
  translate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportPlayerDetailsArgs {
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  endTime?: InputMaybe<Scalars["Float"]["input"]>;
  fightIDs?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  killType?: InputMaybe<KillType>;
  startTime?: InputMaybe<Scalars["Float"]["input"]>;
  translate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportRankingsArgs {
  compare?: InputMaybe<RankingCompareType>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  fightIDs?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  playerMetric?: InputMaybe<ReportRankingMetricType>;
  timeframe?: InputMaybe<RankingTimeframeType>;
}

/** A single report uploaded by a player to a guild or personal logs. */
export interface ReportTableArgs {
  abilityID?: InputMaybe<Scalars["Float"]["input"]>;
  dataType?: InputMaybe<TableDataType>;
  death?: InputMaybe<Scalars["Int"]["input"]>;
  difficulty?: InputMaybe<Scalars["Int"]["input"]>;
  encounterID?: InputMaybe<Scalars["Int"]["input"]>;
  endTime?: InputMaybe<Scalars["Float"]["input"]>;
  fightIDs?: InputMaybe<InputMaybe<Scalars["Int"]["input"]>[]>;
  filterExpression?: InputMaybe<Scalars["String"]["input"]>;
  hostilityType?: InputMaybe<HostilityType>;
  killType?: InputMaybe<KillType>;
  sourceAurasAbsent?: InputMaybe<Scalars["String"]["input"]>;
  sourceAurasPresent?: InputMaybe<Scalars["String"]["input"]>;
  sourceClass?: InputMaybe<Scalars["String"]["input"]>;
  sourceID?: InputMaybe<Scalars["Int"]["input"]>;
  sourceInstanceID?: InputMaybe<Scalars["Int"]["input"]>;
  startTime?: InputMaybe<Scalars["Float"]["input"]>;
  targetAurasAbsent?: InputMaybe<Scalars["String"]["input"]>;
  targetAurasPresent?: InputMaybe<Scalars["String"]["input"]>;
  targetClass?: InputMaybe<Scalars["String"]["input"]>;
  targetID?: InputMaybe<Scalars["Int"]["input"]>;
  targetInstanceID?: InputMaybe<Scalars["Int"]["input"]>;
  translate?: InputMaybe<Scalars["Boolean"]["input"]>;
  viewBy?: InputMaybe<ViewType>;
  viewOptions?: InputMaybe<Scalars["Int"]["input"]>;
  wipeCutoff?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The ReportAbility represents a single ability that occurs in the report. */
export interface ReportAbility {
  __typename?: "ReportAbility";
  /** The game ID of the ability. */
  gameID?: Maybe<Scalars["Float"]["output"]>;
  /** An icon to use for the ability. */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The name of the actor. */
  name?: Maybe<Scalars["String"]["output"]>;
  /** The type of the ability. This represents the type of damage (e.g., the spell school in WoW). */
  type?: Maybe<Scalars["String"]["output"]>;
}

/** The ReportActor represents a single player, pet or NPC that occurs in the report. */
export interface ReportActor {
  __typename?: "ReportActor";
  /** The game ID of the actor. */
  gameID?: Maybe<Scalars["Float"]["output"]>;
  /** An icon to use for the actor. For pets and NPCs, this will be the icon the site chose to represent that actor. */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** The name of the actor. */
  name?: Maybe<Scalars["String"]["output"]>;
  /** The report ID of the actor's owner if the actor is a pet. */
  petOwner?: Maybe<Scalars["Int"]["output"]>;
  /** The normalized server name of the actor. */
  server?: Maybe<Scalars["String"]["output"]>;
  /** The sub-type of the actor, for players it's their class, and for NPCs, they are further subdivided into normal NPCs and bosses. */
  subType?: Maybe<Scalars["String"]["output"]>;
  /** The type of the actor, i.e., if it is a player, pet or NPC. */
  type?: Maybe<Scalars["String"]["output"]>;
}

/** The archival status of a report. */
export interface ReportArchiveStatus {
  __typename?: "ReportArchiveStatus";
  /** The date on which the report was archived (if it has been archived). */
  archiveDate?: Maybe<Scalars["Int"]["output"]>;
  /** Whether the current user can access the report. Always true if the report is not archived, and always false if not using user authentication. */
  isAccessible: Scalars["Boolean"]["output"];
  /** Whether the report has been archived. */
  isArchived: Scalars["Boolean"]["output"];
}

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export interface ReportData {
  __typename?: "ReportData";
  /** Obtain a specific report by its code. */
  report?: Maybe<Report>;
  /** A set of reports for a specific guild, guild tag, or user. */
  reports?: Maybe<ReportPagination>;
}

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export interface ReportDataReportArgs {
  code?: InputMaybe<Scalars["String"]["input"]>;
}

/** The ReportData object enables the retrieval of single reports or filtered collections of reports. */
export interface ReportDataReportsArgs {
  endTime?: InputMaybe<Scalars["Float"]["input"]>;
  gameZoneID?: InputMaybe<Scalars["Int"]["input"]>;
  guildID?: InputMaybe<Scalars["Int"]["input"]>;
  guildName?: InputMaybe<Scalars["String"]["input"]>;
  guildServerRegion?: InputMaybe<Scalars["String"]["input"]>;
  guildServerSlug?: InputMaybe<Scalars["String"]["input"]>;
  guildTagID?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  startTime?: InputMaybe<Scalars["Float"]["input"]>;
  userID?: InputMaybe<Scalars["Int"]["input"]>;
  zoneID?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The ReportDungeonPull represents a single pull that occurs in a containing dungeon. */
export interface ReportDungeonPull {
  __typename?: "ReportDungeonPull";
  /** The bounding box that encloses the positions of all players/enemies in the fight. */
  boundingBox?: Maybe<ReportMapBoundingBox>;
  /** The encounter ID of the fight. If the ID is 0, the fight is considered a trash fight. */
  encounterID: Scalars["Int"]["output"];
  /** The end time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  endTime: Scalars["Float"]["output"];
  /** Information about enemies involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  enemyNPCs?: Maybe<Maybe<ReportDungeonPullNpc>[]>;
  /** The report ID of the fight. This ID can be used to fetch only events, tables or graphs for this fight. */
  id: Scalars["Int"]["output"];
  /** Whether or not the fight was a boss kill, i.e., successful. If this field is false, it means the fight was an incomplete run, etc.. */
  kill?: Maybe<Scalars["Boolean"]["output"]>;
  /** All the maps that were involved in a pull. */
  maps?: Maybe<Maybe<ReportMap>[]>;
  /** The name of the fight. */
  name: Scalars["String"]["output"];
  /** The start time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  startTime: Scalars["Float"]["output"];
  /** The x position of the first mob damaged in the pull at the time this damage happens. Used to establish a marker position to represent where the pull took place. */
  x: Scalars["Int"]["output"];
  /** The y position of the first mob damaged in the pull at the time this damage happens. Used to establish a marker position to represent where the pull took place. */
  y: Scalars["Int"]["output"];
}

/** The ReportDungeonPullNPC represents participation info within a single dungeon pull for an NPC. */
export interface ReportDungeonPullNpc {
  __typename?: "ReportDungeonPullNPC";
  /** The game ID of the actor, e.g., so it can be looked up on external Web sites. */
  gameID?: Maybe<Scalars["Int"]["output"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** The highest instance group ID seen during the pull. */
  maximumInstanceGroupID?: Maybe<Scalars["Int"]["output"]>;
  /** The highest instance ID seen during the pull. */
  maximumInstanceID?: Maybe<Scalars["Int"]["output"]>;
  /** The lowest instance group ID seen during the pull. */
  minimumInstanceGroupID?: Maybe<Scalars["Int"]["output"]>;
  /** The lowest instance ID seen during the pull. */
  minimumInstanceID?: Maybe<Scalars["Int"]["output"]>;
}

/** The ReportEventPaginator represents a paginated list of report events. */
export interface ReportEventPaginator {
  __typename?: "ReportEventPaginator";
  /** The list of events obtained. */
  data?: Maybe<Scalars["JSON"]["output"]>;
  /** A timestamp to pass in as the start time when fetching the next page of data. */
  nextPageTimestamp?: Maybe<Scalars["Float"]["output"]>;
}

/** The ReportFight represents a single fight that occurs in the report. */
export interface ReportFight {
  __typename?: "ReportFight";
  /** The average item level of the players in the fight. */
  averageItemLevel?: Maybe<Scalars["Float"]["output"]>;
  /** The percentage health of the active boss or bosses at the end of a fight. */
  bossPercentage?: Maybe<Scalars["Float"]["output"]>;
  /** The bounding box that encloses the positions of all players/enemies in the fight. */
  boundingBox?: Maybe<ReportMapBoundingBox>;
  /** The season ID of a Classic fight. Will only be nonzero for Season of Mastery in Vanilla for now. */
  classicSeasonID?: Maybe<Scalars["Int"]["output"]>;
  /** Whether or not a fight represents an entire raid from start to finish, e.g., in Classic WoW a complete run of Blackwing Lair. */
  completeRaid: Scalars["Boolean"]["output"];
  /** The difficulty setting for the raid, dungeon, or arena. Null for trash. */
  difficulty?: Maybe<Scalars["Int"]["output"]>;
  /** For a dungeon, a list of pulls that occurred in the dungeon. Pulls have details such as the enemies involved in the pull and map info showing where the pull took place. */
  dungeonPulls?: Maybe<Maybe<ReportDungeonPull>[]>;
  /** The encounter ID of the fight. If the ID is 0, the fight is considered a trash fight. */
  encounterID: Scalars["Int"]["output"];
  /** The end time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  endTime: Scalars["Float"]["output"];
  /** Information about enemy NPCs involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  enemyNPCs?: Maybe<Maybe<ReportFightNpc>[]>;
  /** Information about enemy pets involved in the fight. Includes report IDs, instance counts, and instance group counts for each pet. */
  enemyPets?: Maybe<Maybe<ReportFightNpc>[]>;
  /** The IDs of all players involved in a fight. These players can be referenced in the master data actors table to get detailed information about each participant. */
  enemyPlayers?: Maybe<Maybe<Scalars["Int"]["output"]>[]>;
  /** The actual completion percentage of the fight. This is the field used to indicate how far into a fight a wipe was, since fights can be complicated and have multiple bosses, no bosses, bosses that heal, etc. */
  fightPercentage?: Maybe<Scalars["Float"]["output"]>;
  /** Information about friendly NPCs involved in the fight. Includes report IDs, instance counts, and instance group counts for each NPC. */
  friendlyNPCs?: Maybe<Maybe<ReportFightNpc>[]>;
  /** Information about friendly pets involved in the fight. Includes report IDs, instance counts, and instance group counts for each pet. */
  friendlyPets?: Maybe<Maybe<ReportFightNpc>[]>;
  /** The IDs of all players involved in a fight. These players can be referenced in the master data actors table to get detailed information about each participant. */
  friendlyPlayers?: Maybe<Maybe<Scalars["Int"]["output"]>[]>;
  /** The game zone the fight takes place in. This should not be confused with the zones used by the sites for rankings. This is the actual in-game zone info. */
  gameZone?: Maybe<GameZone>;
  /** The hard mode level of the fight. Most fights don't support optional hard modes. This only applies to bosses like Sartharion. */
  hardModeLevel?: Maybe<Scalars["Int"]["output"]>;
  /** The report ID of the fight. This ID can be used to fetch only events, tables or graphs for this fight. */
  id: Scalars["Int"]["output"];
  /** Whether or not the fight is still in progress. If this field is false, it means the entire fight has been uploaded. */
  inProgress?: Maybe<Scalars["Boolean"]["output"]>;
  /** The affixes for a Mythic+ dungeon. */
  keystoneAffixes?: Maybe<Maybe<Scalars["Int"]["output"]>[]>;
  /** The bonus field represents Bronze, Silver or Gold in Challenge Modes, or +1-+3 pushing of Mythic+ keys. It has the values 1, 2, and 3. */
  keystoneBonus?: Maybe<Scalars["Int"]["output"]>;
  /** The keystone level for a Mythic+ dungeon. */
  keystoneLevel?: Maybe<Scalars["Int"]["output"]>;
  /** The completion time for a Challenge Mode or Mythic+ Dungeon. This is the official time used on Blizzard leaderboards. */
  keystoneTime?: Maybe<Scalars["Int"]["output"]>;
  /** Whether or not the fight was a boss kill, i.e., successful. If this field is false, it means the fight was a wipe or a failed run, etc.. */
  kill?: Maybe<Scalars["Boolean"]["output"]>;
  /** The phase that the encounter was in when the fight ended. Counts up from 1 based off the phase type (i.e., normal phase vs intermission). */
  lastPhase?: Maybe<Scalars["Int"]["output"]>;
  /** The phase that the encounter was in when the fight ended. Always increases from 0, so a fight with three real phases and two intermissions would count up from 0 to 4. */
  lastPhaseAsAbsoluteIndex?: Maybe<Scalars["Int"]["output"]>;
  /** Whether or not the phase that the encounter was in when the fight ended was an intermission or not. */
  lastPhaseIsIntermission?: Maybe<Scalars["Boolean"]["output"]>;
  /** The layer of a Torghast run. */
  layer?: Maybe<Scalars["Int"]["output"]>;
  /** All the maps that were involved in a fight. For single bosses this will usually be a single map, but for dungeons it will typically be multiple maps. */
  maps?: Maybe<Maybe<ReportMap>[]>;
  /** The name of the fight. */
  name: Scalars["String"]["output"];
  /** Some boss fights may be converted to trash fights (encounterID = 0). When this occurs, `originalEncounterID` contains the original ID of the encounter. */
  originalEncounterID?: Maybe<Scalars["Int"]["output"]>;
  /** List of observed phase transitions during the fight. */
  phaseTransitions?: Maybe<PhaseTransition[]>;
  /** The official Blizzard rating for a completed Mythic+ dungeon or Torghast run. */
  rating?: Maybe<Scalars["Int"]["output"]>;
  /** The group size for the raid, dungeon, or arena. Null for trash. */
  size?: Maybe<Scalars["Int"]["output"]>;
  /** The start time of the fight. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  startTime: Scalars["Float"]["output"];
  /** The import/export code for a Retail Dragonflight talent build. Will be null for a classic or pre-Dragonflight fight. */
  talentImportCode?: Maybe<Scalars["String"]["output"]>;
  /** If a wipe was explicitly called using the Companion app, then this field will contain the time. This is a timestamp with millisecond precision that is relative to the start of the report, i.e., the start of the report is considered time 0. */
  wipeCalledTime?: Maybe<Scalars["Float"]["output"]>;
}

/** The ReportFight represents a single fight that occurs in the report. */
export interface ReportFightTalentImportCodeArgs {
  actorID: Scalars["Int"]["input"];
}

/** The ReportFightNPC represents participation info within a single fight for an NPC. */
export interface ReportFightNpc {
  __typename?: "ReportFightNPC";
  /** The game ID of the actor. This ID is used in events to identify sources and targets. */
  gameID?: Maybe<Scalars["Int"]["output"]>;
  /** How many packs of the NPC were seen during the fight. */
  groupCount?: Maybe<Scalars["Int"]["output"]>;
  /** The report ID of the actor. This ID is used in events to identify sources and targets. */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** How many instances of the NPC were seen during the fight. */
  instanceCount?: Maybe<Scalars["Int"]["output"]>;
  /** The report ID of the actor that owns this NPC (if it is a pet). This ID is used in events to identify sources and targets. */
  petOwner?: Maybe<Scalars["Int"]["output"]>;
}

/** The ReportMap represents a single map that a fight can occur on. */
export interface ReportMap {
  __typename?: "ReportMap";
  /** The map's game ID. */
  id: Scalars["Int"]["output"];
}

/** The ReportMapBoundingBox is a box that encloses the positions of all players and enemies in a fight or dungeon pull. */
export interface ReportMapBoundingBox {
  __typename?: "ReportMapBoundingBox";
  /** The largest X position. */
  maxX: Scalars["Int"]["output"];
  /** The largest Y position. */
  maxY: Scalars["Int"]["output"];
  /** The smallest X position. */
  minX: Scalars["Int"]["output"];
  /** The smallest Y position. */
  minY: Scalars["Int"]["output"];
}

/** The ReporMastertData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export interface ReportMasterData {
  __typename?: "ReportMasterData";
  /** A list of every ability that occurs in the report. */
  abilities?: Maybe<Maybe<ReportAbility>[]>;
  /** A list of every actor (player, NPC, pet) that occurs in the report. */
  actors?: Maybe<Maybe<ReportActor>[]>;
  /** The version of the game that generated the log file. Used to distinguish Classic and Retail Warcraft primarily. */
  gameVersion?: Maybe<Scalars["Int"]["output"]>;
  /** The auto-detected locale of the report. This is the source language of the original log file. */
  lang?: Maybe<Scalars["String"]["output"]>;
  /** The version of the client parser that was used to parse and upload this log file. */
  logVersion: Scalars["Int"]["output"];
}

/** The ReporMastertData object contains information about the log version of a report, as well as the actors and abilities used in the report. */
export interface ReportMasterDataActorsArgs {
  subType?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ReportPagination {
  __typename?: "ReportPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<Report>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** All the possible metrics. */
export enum ReportRankingMetricType {
  /** Boss damage per second. */
  Bossdps = "bossdps",
  /** Boss rDPS is unique to FFXIV and is damage done to the boss adjusted for raid-contributing buffs and debuffs. */
  Bossrdps = "bossrdps",
  /** Choose an appropriate default depending on the other selected parameters. */
  Default = "default",
  /** Damage per second. */
  Dps = "dps",
  /** Healing per second. */
  Hps = "hps",
  /** Survivability ranking for tanks. Deprecated. Only supported for some older WoW zones. */
  Krsi = "krsi",
  /** Score. Used by WoW Mythic dungeons and by ESO trials. */
  Playerscore = "playerscore",
  /** Speed. Not supported by every zone. */
  Playerspeed = "playerspeed",
  /** rDPS is unique to FFXIV and is damage done adjusted for raid-contributing buffs and debuffs. */
  Rdps = "rdps",
  /** Healing done per second to tanks. */
  Tankhps = "tankhps",
  /** Weighted damage per second. Unique to WoW currently. Used to remove pad damage and reward damage done to high priority targets. */
  Wdps = "wdps",
}

/** Used to specify a tank, healer or DPS role. */
export enum RoleType {
  /** Fetch any role.. */
  Any = "Any",
  /** Fetch the DPS role only. */
  Dps = "DPS",
  /** Fetch the healer role only. */
  Healer = "Healer",
  /** Fetch the tanking role only. */
  Tank = "Tank",
}

/** A single server. Servers correspond to actual game servers that characters and guilds reside on. */
export interface Server {
  __typename?: "Server";
  /** The characters found on this server (and any servers connected to this one. */
  characters?: Maybe<CharacterPagination>;
  /** The guilds found on this server (and any servers connected to this one. */
  guilds?: Maybe<GuildPagination>;
  /** The ID of the server. */
  id: Scalars["Int"]["output"];
  /** The name of the server in the locale of the subregion that the server belongs to. */
  name: Scalars["String"]["output"];
  /** The normalized name is a transformation of the name, dropping spaces. It is how the server appears in a World of Warcraft log file. */
  normalizedName: Scalars["String"]["output"];
  /** The region that this server belongs to. */
  region: Region;
  /** The server slug, also a transformation of the name following Blizzard rules. For retail World of Warcraft realms, this slug will be in English. For all other games, the slug is just a transformation of the name field. */
  slug: Scalars["String"]["output"];
  /** The subregion that this server belongs to. */
  subregion: Subregion;
}

/** A single server. Servers correspond to actual game servers that characters and guilds reside on. */
export interface ServerCharactersArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A single server. Servers correspond to actual game servers that characters and guilds reside on. */
export interface ServerGuildsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface ServerPagination {
  __typename?: "ServerPagination";
  /** Current page of the cursor */
  current_page: Scalars["Int"]["output"];
  /** List of items on the current page */
  data?: Maybe<Maybe<Server>[]>;
  /** Number of the first item returned */
  from?: Maybe<Scalars["Int"]["output"]>;
  /** Determines if cursor has more pages after the current page */
  has_more_pages: Scalars["Boolean"]["output"];
  /** The last page (number of pages) */
  last_page: Scalars["Int"]["output"];
  /** Number of items returned per page */
  per_page: Scalars["Int"]["output"];
  /** Number of the last item returned */
  to?: Maybe<Scalars["Int"]["output"]>;
  /** Number of total items selected by the query */
  total: Scalars["Int"]["output"];
}

/** A single subregion. Subregions are used to divide a region into sub-categories, such as French or German subregions of a Europe region. */
export interface Subregion {
  __typename?: "Subregion";
  /** The ID of the subregion. */
  id: Scalars["Int"]["output"];
  /** The localized name of the subregion. */
  name: Scalars["String"]["output"];
  /** The region that this subregion is found in. */
  region: Region;
  /** The servers found within this region. */
  servers?: Maybe<ServerPagination>;
}

/** A single subregion. Subregions are used to divide a region into sub-categories, such as French or German subregions of a Europe region. */
export interface SubregionServersArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The type of Subscription. */
export enum SubscriptionStatus {
  /** Gold Tier subscription */
  Gold = "Gold",
  /**
   * Legacy Gold Tier subscription
   * @deprecated Legacy Gold subscriptions are not available for new users.
   */
  LegacyGold = "LegacyGold",
  /**
   * Legacy Platinum Tier subscription
   * @deprecated Legacy Platinum subscriptions are not available for new users.
   */
  LegacyPlatinum = "LegacyPlatinum",
  /**
   * Legacy Silver Tier subscription
   * @deprecated Legacy Silver subscriptions are not available for new users.
   */
  LegacySilver = "LegacySilver",
  /** Platinum Tier subscription */
  Platinum = "Platinum",
  /** Silver Tier subscription */
  Silver = "Silver",
}

/** The type of table to examine. */
export enum TableDataType {
  /** Buffs. */
  Buffs = "Buffs",
  /** Casts. */
  Casts = "Casts",
  /** Damage done. */
  DamageDone = "DamageDone",
  /** Damage taken. */
  DamageTaken = "DamageTaken",
  /** Deaths. */
  Deaths = "Deaths",
  /** Debuffs. */
  Debuffs = "Debuffs",
  /** Dispels. */
  Dispels = "Dispels",
  /** Healing done. */
  Healing = "Healing",
  /** Interrupts. */
  Interrupts = "Interrupts",
  /** Resources. */
  Resources = "Resources",
  /** Summary Overview */
  Summary = "Summary",
  /** Summons */
  Summons = "Summons",
  /** Survivability (death info across multiple pulls). */
  Survivability = "Survivability",
  /** Threat. */
  Threat = "Threat",
}

/** A single user of the site. Most fields can only be accessed when authenticated as that user with the "view-user-profile" scope. */
export interface User {
  __typename?: "User";
  /** The battle tag of the user if they have linked it. */
  battleTag?: Maybe<Scalars["String"]["output"]>;
  /** The characters claimed by this user. Only accessible via user authentication when you have the "view-user-profile" scope. */
  characters?: Maybe<Maybe<Character>[]>;
  /** The list of guilds to which the user belongs. Only accessible via user authentication when you have the "view-user-profile" scope. */
  guilds?: Maybe<Maybe<Guild>[]>;
  /** The ID of the user. */
  id: Scalars["Int"]["output"];
  /** The name of the user. */
  name: Scalars["String"]["output"];
}

/** The user data object contains basic information about users and lets you retrieve specific users (or the current user if using the user endpoint). */
export interface UserData {
  __typename?: "UserData";
  /** Obtain the current user (only works with user endpoint). */
  currentUser?: Maybe<User>;
  /** Obtain a specific user by id. */
  user?: Maybe<User>;
}

/** The user data object contains basic information about users and lets you retrieve specific users (or the current user if using the user endpoint). */
export interface UserDataUserArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Whether the view is by source, target, or ability. */
export enum ViewType {
  /** View by ability. */
  Ability = "Ability",
  /** Use the same default that the web site picks based off the other selected parameters. */
  Default = "Default",
  /** View. by source. */
  Source = "Source",
  /** View by target. */
  Target = "Target",
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldData {
  __typename?: "WorldData";
  /** Obtain a specific encounter by id. */
  encounter?: Maybe<Encounter>;
  /** A single expansion obtained by ID. */
  expansion?: Maybe<Expansion>;
  /** The set of all expansions supported by the site. */
  expansions?: Maybe<Maybe<Expansion>[]>;
  /** Obtain a specific region by its ID. */
  region?: Maybe<Region>;
  /** The set of all regions supported by the site. */
  regions?: Maybe<Maybe<Region>[]>;
  /** Obtain a specific server either by id or by slug and region. */
  server?: Maybe<Server>;
  /** Obtain a specific subregion by its ID. */
  subregion?: Maybe<Subregion>;
  /** Obtain a specific zone by its ID. */
  zone?: Maybe<Zone>;
  /** Obtain a set of all zones supported by the site. */
  zones?: Maybe<Maybe<Zone>[]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataEncounterArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataExpansionArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataRegionArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataServerArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  slug?: InputMaybe<Scalars["String"]["input"]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataSubregionArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataZoneArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** The world data object contains collections of data such as expansions, zones, encounters, regions, subregions, etc. */
export interface WorldDataZonesArgs {
  expansion_id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A collection containing some combination of world, region, and server ranks. */
export interface WorldRegionServerRankPositions {
  __typename?: "WorldRegionServerRankPositions";
  regionRank?: Maybe<Rank>;
  serverRank?: Maybe<Rank>;
  worldRank?: Maybe<Rank>;
}

/** A single zone from an expansion that represents a raid, dungeon, arena, etc. */
export interface Zone {
  __typename?: "Zone";
  /** The bracket information for this zone. This field will be null if the zone does not support brackets. */
  brackets?: Maybe<Bracket>;
  /** A list of all the difficulties supported for this zone. */
  difficulties?: Maybe<Maybe<Difficulty>[]>;
  /** The encounters found within this zone. */
  encounters?: Maybe<Maybe<Encounter>[]>;
  /** The expansion that this zone belongs to. */
  expansion: Expansion;
  /** Whether or not the entire zone (including all its partitions) is permanently frozen. When a zone is frozen, data involving that zone will never change and can be cached forever. */
  frozen: Scalars["Boolean"]["output"];
  /** The ID of the zone. */
  id: Scalars["Int"]["output"];
  /** The name of the zone. */
  name: Scalars["String"]["output"];
  /** A list of all the partitions supported for this zone. */
  partitions?: Maybe<Maybe<Partition>[]>;
}

export type GetFightsQueryVariables = Exact<{
  reportID: Scalars["String"]["input"];
}>;

export interface GetFightsQuery {
  __typename?: "Query";
  reportData?: {
    __typename?: "ReportData";
    report?: {
      __typename?: "Report";
      title: string;
      startTime: number;
      region?: { __typename?: "Region"; slug: string } | null;
      fights?:
        | ({
            __typename?: "ReportFight";
            id: number;
            startTime: number;
            endTime: number;
            difficulty?: number | null;
            encounterID: number;
            friendlyPlayers?: (number | null)[] | null;
            kill?: boolean | null;
            fightPercentage?: number | null;
          } | null)[]
        | null;
    } | null;
  } | null;
}

export type GetPlayerDetailsQueryVariables = Exact<{
  reportID: Scalars["String"]["input"];
  fightIDs:
    | InputMaybe<Scalars["Int"]["input"]>[]
    | InputMaybe<Scalars["Int"]["input"]>;
}>;

export interface GetPlayerDetailsQuery {
  __typename?: "Query";
  reportData?: {
    __typename?: "ReportData";
    report?: { __typename?: "Report"; playerDetails?: any | null } | null;
  } | null;
}

export type GetPhysicalDamageTakenEventsQueryVariables = Exact<{
  reportID: Scalars["String"]["input"];
  startTime: Scalars["Float"]["input"];
  endTime: Scalars["Float"]["input"];
}>;

export interface GetPhysicalDamageTakenEventsQuery {
  __typename?: "Query";
  reportData?: {
    __typename?: "ReportData";
    report?: {
      __typename?: "Report";
      events?: {
        __typename?: "ReportEventPaginator";
        data?: any | null;
        nextPageTimestamp?: number | null;
      } | null;
    } | null;
  } | null;
}

export const GetFightsDocument = gql`
  query getFights($reportID: String!) {
    reportData {
      report(code: $reportID) {
        title
        startTime
        region {
          slug
        }
        fights(translate: true) {
          id
          startTime
          endTime
          difficulty
          encounterID
          friendlyPlayers
          kill
          fightPercentage
        }
      }
    }
  }
`;
export const GetPlayerDetailsDocument = gql`
  query getPlayerDetails($reportID: String!, $fightIDs: [Int]!) {
    reportData {
      report(code: $reportID) {
        playerDetails(fightIDs: $fightIDs)
      }
    }
  }
`;
export const GetPhysicalDamageTakenEventsDocument = gql`
  query getPhysicalDamageTakenEvents(
    $reportID: String!
    $startTime: Float!
    $endTime: Float!
  ) {
    reportData {
      report(code: $reportID) {
        events(
          dataType: DamageTaken
          endTime: $endTime
          filterExpression: "ability.type = 1"
          startTime: $startTime
        ) {
          data
          nextPageTimestamp
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    getFights(
      variables: GetFightsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetFightsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetFightsQuery>(GetFightsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "getFights",
        "query",
        variables,
      );
    },
    getPlayerDetails(
      variables: GetPlayerDetailsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetPlayerDetailsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPlayerDetailsQuery>(
            GetPlayerDetailsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "getPlayerDetails",
        "query",
        variables,
      );
    },
    getPhysicalDamageTakenEvents(
      variables: GetPhysicalDamageTakenEventsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetPhysicalDamageTakenEventsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetPhysicalDamageTakenEventsQuery>(
            GetPhysicalDamageTakenEventsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "getPhysicalDamageTakenEvents",
        "query",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
