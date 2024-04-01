import { Await, Link } from "@remix-run/react";
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
import { useReportCodeLoaderData } from "~/routes/reports+/$reportCode+/_layout.tsx";

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

function ReportNameBreadcrumbItem() {
  const { reportFights } = useReportCodeLoaderData();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <BreadcrumbItem>{t("breadcrumbs.selection.report")}</BreadcrumbItem>
      }
    >
      <Await resolve={reportFights}>
        {(resolved) => <BreadcrumbItem>{resolved.title}</BreadcrumbItem>}
      </Await>
    </Suspense>
  );
}

export default function ReportRoute() {
  const { reportFights } = useReportCodeLoaderData();
  const { t } = useTranslation();

  return (
    <>
      <div className="pb-8 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="hover:text-foreground">
                {t("breadcrumbs.home")}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <ReportNameBreadcrumbItem />
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
