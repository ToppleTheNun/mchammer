import type { Region } from "#app/constants.ts";
import type { DodgeParryMissStreak, Fight } from "#app/lib/db/schema.ts";
import type { DamageTakenEvent, PlayerDetail } from "#app/wcl/schema.server.ts";

export type ReportFight = {
  report: string;
  fightID: number;
  startTime: number;
  endTime: number;
  encounterID: number;
  difficulty: number;
  region: Region;
  friendlyPlayerIds: number[];
};

export type IngestibleReportFight = ReportFight & {
  friendlyPlayerDetails: PlayerDetail[];
  friendlyPlayers: string;
};

export type IngestedReportFight = IngestibleReportFight & {
  fight: Fight;
};

export type RequiredParryDodgeMiss = {
  parry: number;
  dodge: number;
  miss: number;
};

export type ReportDamageTakenEvent = DamageTakenEvent & {
  report: string;
  relativeTimestamp: number;
};

export type IngestibleReportDamageTakenEvent = ReportDamageTakenEvent & {
  region: Region;
  ingestedFightId: string;
  target: PlayerDetail;
};

export type IngestedReportDamageTakenEvent = IngestibleReportDamageTakenEvent;

export type ReportDodgeParryMissStreak = {
  parry: number;
  dodge: number;
  miss: number;
  report: string;
  relativeTimestampStart: number;
  relativeTimestampEnd: number;
};

export type IngestibleReportDodgeParryMissStreak =
  ReportDodgeParryMissStreak & {
    region: Region;
    ingestedFightId: string;
    target: PlayerDetail;
  };

export type IngestedReportDodgeParryMissStreak =
  IngestibleReportDodgeParryMissStreak & {
    dodgeParryMissStreak: DodgeParryMissStreak;
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
