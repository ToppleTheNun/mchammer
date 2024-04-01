import { invariant, invariantResponse } from "@epic-web/invariant";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { z } from "zod";

import { getCachedFights } from "~/lib/query/report.server.ts";
import { makeTimings } from "~/lib/timing.server.ts";

export const ReportCodeSchema = z
  .string()
  .length(16)
  .or(z.string().startsWith("a:").length(18));
export const ReportCodeLayoutSchema = z.object({
  reportCode: ReportCodeSchema,
});

export function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("report code action");

  const { reportCode } = ReportCodeLayoutSchema.parse(params);
  invariantResponse(reportCode, "reportCode parameter is required");
  invariantResponse(
    reportCode.length === 16,
    "reportCode must be 16 characters long",
  );

  const reportFights = getCachedFights({ reportID: reportCode }, { timings });

  return defer({ reportFights });
}

export function useReportCodeLoaderData() {
  const data = useRouteLoaderData<typeof loader>(
    "routes/reports+/$reportCode+/_layout",
  );

  invariant(
    data,
    "useReportCodeLoaderData must be used within the reports/$reportCode+ folder structure",
  );

  return data;
}
