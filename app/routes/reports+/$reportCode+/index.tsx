import { invariantResponse } from "@epic-web/invariant";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { FightList, FightListSkeleton } from "~/components/FightList.tsx";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import { H1, Lead } from "~/components/typography.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
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

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default function ReportRoute() {
  const { reportFights } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <div className="pb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">{t("breadcrumbs.home")}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <Suspense
              fallback={
                <BreadcrumbItem>
                  {t("breadcrumbs.selection.report")}
                </BreadcrumbItem>
              }
            >
              <Await resolve={reportFights}>
                {(resolved) => (
                  <BreadcrumbItem>{resolved.title}</BreadcrumbItem>
                )}
              </Await>
            </Suspense>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t("breadcrumbs.selection.fight")}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <H1>{t("reports.selection.fight.heading")}</H1>
          <Lead>{t("reports.selection.fight.description")}</Lead>
        </div>
      </div>
      <section>
        <Suspense fallback={<FightListSkeleton />}>
          <Await resolve={reportFights}>
            {(resolved) => <FightList fights={resolved.fights} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
