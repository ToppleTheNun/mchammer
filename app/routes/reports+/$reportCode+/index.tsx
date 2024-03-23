import { invariantResponse } from "@epic-web/invariant";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData, useParams } from "@remix-run/react";
import { Suspense } from "react";

import { FightList } from "~/components/FightList.tsx";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import { H1, H2, Lead } from "~/components/typography.tsx";
import { getCachedFights } from "~/lib/query/report.server.ts";
import { makeTimings } from "~/lib/timing.server.ts";

export function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("report code action");

  const { reportCode } = params;
  invariantResponse(reportCode, "reportCode parameter is required");
  invariantResponse(
    reportCode.length === 16,
    "reportCode must be 16 characters long",
  );

  const reportFights = getCachedFights({ reportID: reportCode }, { timings });

  return defer({ reportFights });
}

function ReportSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <H2>Eligible fights go here</H2>
        <Lead>Fights will eventually go here. It&apos;ll be neat.</Lead>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default function ReportRoute() {
  const { reportCode } = useParams();
  const { reportFights } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="pb-8 space-y-2">
        <H1>Can&apos;t touch this.</H1>
        <Lead>Select a fight below from report with code {reportCode}.</Lead>
      </div>
      <section>
        <Suspense fallback={<ReportSkeleton />}>
          <Await resolve={reportFights}>
            {(resolved) => <FightList fights={resolved.fights} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
