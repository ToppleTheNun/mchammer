import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  FightList,
  FightListError,
  FightListSkeleton,
} from "~/components/FightList.tsx";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import { H1, Lead } from "~/components/typography.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
import { getCachedReport } from "~/lib/query/report.server.ts";
import { ReportCodeSchema } from "~/lib/schemas.ts";
import { makeTimings, time } from "~/lib/timing.server.ts";

// region Loader
const ParamsSchema = z.object({
  reportCode: ReportCodeSchema,
});
export async function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("reports2/reportCode loader");

  const { reportCode } = await time(() => ParamsSchema.parseAsync(params), {
    timings,
    type: "params parse",
  });

  const cachedReport = getCachedReport({ reportID: reportCode }, { timings });

  return defer({
    report: cachedReport,
  });
}
// endregion

// region Components
function ReportNameBreadcrumbItem() {
  const { report } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <BreadcrumbItem>{t("breadcrumbs.selection.report")}</BreadcrumbItem>
      }
    >
      <Await
        resolve={report}
        errorElement={
          <BreadcrumbItem>{t("breadcrumbs.selection.report")}</BreadcrumbItem>
        }
      >
        {(resolved) => <BreadcrumbItem>{resolved.title}</BreadcrumbItem>}
      </Await>
    </Suspense>
  );
}

function Header() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <H1>{t("reports.selection.fight.heading")}</H1>
      <Lead>{t("reports.selection.fight.description")}</Lead>
    </div>
  );
}
// endregion

// region Route
export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default function ReportsReportCodeRoute() {
  const { report } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <div className="pb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t("breadcrumbs.home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <ReportNameBreadcrumbItem />
          </BreadcrumbList>
        </Breadcrumb>
        <Header />
      </div>
      <section>
        <Suspense fallback={<FightListSkeleton />}>
          <Await resolve={report} errorElement={<FightListError />}>
            {(resolved) => <FightList fights={resolved.fights} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
// endregion
