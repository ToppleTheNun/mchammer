import type { Region } from "#app/constants.ts";
import type {
  Character,
  DodgeParryMissStreak,
  Fight,
} from "#app/lib/db/schema.ts";
import type { DamageTakenEvent, PlayerDetail } from "#app/wcl/schema.server.ts";

export type ReportFight = {
  reportID: string;
  reportStartTime: number;
  reportEndTime: number;
  reportRegion: Region;
  id: number;
  /** Relative timestamp from WCL */
  startTime: number;
  /** Relative timestamp from WCL */
  endTime: number;
  difficulty: number;
  encounterID: number;
  friendlyPlayerIDs: number[];
  /** Combined value of {@link ReportFight#reportStartTime} and {@link ReportFight#startTime} */
  absoluteStartTime: number;
  /** Combined value of {@link ReportFight#reportStartTime} and {@link ReportFight#endTime} */
  absoluteEndTime: number;
};

export type IngestibleReportFight = ReportFight & {
  friendlyPlayerDetails: PlayerDetail[];
  friendlyPlayers: string;
};

export type IngestedReportFight = IngestibleReportFight & {
  ingestedFight: Fight;
};

export type RequiredParryDodgeMiss = {
  parry: number;
  dodge: number;
  miss: number;
};

export type ReportDamageTakenEvent = DamageTakenEvent & {
  reportID: string;
  reportRegion: Region;
  fightID: number;
  absoluteTimestamp: number;
};

export type IngestibleReportDamageTakenEvent = ReportDamageTakenEvent & {
  ingestedFight: Fight;
  character: PlayerDetail;
};

export type IngestedReportDamageTakenEvent =
  IngestibleReportDamageTakenEvent & {
    ingestedCharacter: Character;
  };

export type ReportDodgeParryMissStreak = {
  reportID: string;
  fightID: number;
  target: PlayerDetail;
  parry: number;
  dodge: number;
  miss: number;
  /** Relative timestamp from WCL */
  startTime: number;
  /** Relative timestamp from WCL */
  endTime: number;
};

export type IngestibleReportDodgeParryMissStreak =
  ReportDodgeParryMissStreak & {
    region: Region;
    ingestedFight: Fight;
    ingestedCharacter: Character;
    /** Combined value of {@link ReportFight#reportStartTime} and {@link ReportDodgeParryMissStreak#startTime} */
    absoluteStartTime: number;
    /** Combined value of {@link ReportFight#reportStartTime} and {@link ReportDodgeParryMissStreak#endTime} */
    absoluteEndTime: number;
  };

export type IngestedReportDodgeParryMissStreak =
  IngestibleReportDodgeParryMissStreak & {
    ingestedStreak: DodgeParryMissStreak;
  };

export type Report = {
  reportID: string;
  title: string;
  region: Region;
  startTime: number;
  endTime: number;
  reportFights: ReportFight[];
};

export type ReportWithIngestibleFights = Report & {
  fights: IngestibleReportFight[];
};

export type ReportWithIngestedFights = Report & {
  fights: IngestedReportFight[];
};

export type ReportWithIngestibleDamageTakenEvents = ReportWithIngestedFights & {
  damageTakenEvents: IngestibleReportDamageTakenEvent[];
};

export type ReportWithIngestedDamageTakenEvents = ReportWithIngestedFights & {
  damageTakenEvents: IngestedReportDamageTakenEvent[];
};

export type ReportWithIngestibleDodgeParryMissStreaks =
  ReportWithIngestedDamageTakenEvents & {
    dodgeParryMissStreaks: IngestibleReportDodgeParryMissStreak[];
  };

export type ReportWithIngestedDodgeParryMissStreaks =
  ReportWithIngestedDamageTakenEvents & {
    dodgeParryMissStreaks: IngestedReportDodgeParryMissStreak[];
  };
