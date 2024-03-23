import { invariant } from "@epic-web/invariant";
import { z } from "zod";

export const allowedWarcraftLogsHostnames = [
  // German
  "de.warcraftlogs.com",
  // English
  "www.warcraftlogs.com",
  // Spanish
  "es.warcraftlogs.com",
  // French
  "fr.warcraftlogs.com",
  // Italian
  "it.warcraftlogs.com",
  // Brazilian
  "br.warcraftlogs.com",
  // Russion
  "ru.warcraftlogs.com",
  // Korean
  "ko.warcraftlogs.com",
  // Taiwanese
  "tw.warcraftlogs.com",
  // Chinese
  "cn.warcraftlogs.com",
] as const;

export const CharacterLinkUrlSchema = z.object({
  type: z.literal("character"),
  url: z
    .string()
    .url()
    .transform((val) => new URL(val))
    .refine((url) => allowedWarcraftLogsHostnames.includes(url.hostname), {
      message: "URL must be a valid WarcraftLogs URL",
    })
    .refine((url) => url.pathname.startsWith("/character/id/"), {
      message: "URL must be to a WarcraftLogs character",
    }),
});
export type CharacterLinkUrl = z.infer<typeof CharacterLinkUrlSchema>;

export const GuildLinkUrlSchema = z.object({
  type: z.literal("guild"),
  url: z
    .string()
    .url()
    .transform((val) => new URL(val))
    .refine((url) => allowedWarcraftLogsHostnames.includes(url.hostname), {
      message: "URL must be a valid WarcraftLogs URL",
    })
    .refine((url) => url.pathname.startsWith("/guild/id/"), {
      message: "URL must be to a WarcraftLogs guild",
    }),
});
export type GuildLinkUrl = z.infer<typeof GuildLinkUrlSchema>;

export const ReportLinkUrlSchema = z.object({
  type: z.literal("report"),
  url: z
    .string()
    .url()
    .transform((val) => new URL(val))
    .refine((url) => allowedWarcraftLogsHostnames.includes(url.hostname), {
      message: "URL must be a valid WarcraftLogs URL",
    })
    .refine((url) => url.pathname.startsWith("/reports/"), {
      message: "URL must be to a WarcraftLogs report",
    }),
});
export type ReportLinkUrl = z.infer<typeof ReportLinkUrlSchema>;

export const WarcraftLogsLinkUrlSchema = z.discriminatedUnion("type", [
  CharacterLinkUrlSchema,
  GuildLinkUrlSchema,
  ReportLinkUrlSchema,
]);
export type WarcraftLogsLinkUrl = z.infer<typeof WarcraftLogsLinkUrlSchema>;

export function getReportCode(input: string) {
  const match = input
    .trim()
    .match(
      /^(.*reports\/)?([a:]{2}([a-zA-Z0-9]{16})|([a-zA-Z0-9]{16}))\/?(#.*)?$/,
    );
  return match?.[2];
}

export function getFight(input: string) {
  const match = input.trim().match(/fight=([^&]*)/);
  return match?.[1];
}

export function getPlayer(input: string) {
  const match = input.trim().match(/source=([^&]*)/);
  return match?.[1];
}

export interface ReportLinkData {
  reportCode: string;
  fight: string | undefined;
  player: string | undefined;
}

export function getReportLinkData(
  reportLinkUrl: ReportLinkUrl,
): ReportLinkData {
  const url = reportLinkUrl.url.toString();

  const reportCode = getReportCode(url);
  const fight = getFight(url);
  const player = getPlayer(url);

  invariant(
    reportCode,
    "Unable to determine report code from WarcraftLogs URL",
  );

  return {
    reportCode,
    fight,
    player,
  };
}
