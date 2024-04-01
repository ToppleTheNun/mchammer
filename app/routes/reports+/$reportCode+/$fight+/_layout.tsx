import { invariant } from "@epic-web/invariant";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { z } from "zod";

import { getCachedFight } from "~/lib/query/report.server.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { ReportCodeLayoutSchema } from "~/routes/reports+/$reportCode+/_layout.tsx";

const FightIdSchema = z.coerce.number().int();
const ReportCodeFightLayoutSchema = ReportCodeLayoutSchema.extend({
  fight: FightIdSchema,
});

export function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("report code fight action");

  const { reportCode, fight } = ReportCodeFightLayoutSchema.parse(params);

  const reportFight = getCachedFight(
    fight,
    { reportID: reportCode },
    { timings },
  );

  return defer({ reportFight });
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
