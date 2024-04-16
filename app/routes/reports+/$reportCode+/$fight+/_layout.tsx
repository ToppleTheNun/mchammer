import { invariant } from "@epic-web/invariant";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { z } from "zod";

import {
  getCachedPlayerDetails,
  getCachedReport,
} from "~/lib/query/report.server.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { ReportCodeLayoutSchema } from "~/routes/reports+/$reportCode+/_layout.tsx";

const FightIdSchema = z.coerce.number().int();
const ReportCodeFightLayoutSchema = ReportCodeLayoutSchema.extend({
  fight: FightIdSchema,
  player: z.coerce.number().int().optional(),
});

export function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("report code fight action");

  const {
    reportCode,
    fight: fightParam,
    player: selectedPlayer,
  } = ReportCodeFightLayoutSchema.parse(params);

  const cachedReport = getCachedReport({ reportID: reportCode }, { timings });
  const cachedReportFight = cachedReport.then((report) =>
    report.fights.find((fight) => fight.fightID === fightParam),
  );
  const cachedReportFightPlayers = cachedReportFight.then((fight) => {
    if (!fight) {
      return null;
    }
    return getCachedPlayerDetails(
      {
        reportID: reportCode,
        fightIDs: [fight.fightID],
      },
      { timings },
    );
  });
  const cachedSelectedPlayer = cachedReportFightPlayers.then((players) => {
    if (!selectedPlayer || !players) {
      return null;
    }
    return players.find((it) => it.id === selectedPlayer) ?? null;
  });

  return defer({
    reportFight: cachedReportFight,
    fightPlayers: cachedReportFightPlayers,
    selectedPlayer: cachedSelectedPlayer,
  });
}

export function useReportCodeFightLoaderData() {
  const data = useRouteLoaderData<typeof loader>(
    "routes/reports+/$reportCode+/$fight+/_layout",
  );

  invariant(
    data,
    "useReportCodeFightLoaderData must be used within the reports/$reportCode+/$fight+ folder structure",
  );

  return data;
}
