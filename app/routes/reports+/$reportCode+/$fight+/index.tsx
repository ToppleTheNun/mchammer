import { Await, Link } from "@remix-run/react";
import { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import { PlayerList, PlayerListSkeleton } from "~/components/PlayerList.tsx";
import { H1, Lead } from "~/components/typography.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
import { useReportCodeLoaderData } from "~/routes/reports+/$reportCode+/_layout.tsx";
import { useReportCodeFightLoaderData } from "~/routes/reports+/$reportCode+/$fight+/_layout.tsx";

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
        {(resolved) => (
          <BreadcrumbItem>
            <BreadcrumbLink href={`/reports/${resolved.reportCode}`}>
              {resolved.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Await>
    </Suspense>
  );
}

function ReportFightNameBreadcrumbItem() {
  const { reportFight } = useReportCodeFightLoaderData();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <BreadcrumbItem>{t("breadcrumbs.selection.fight")}</BreadcrumbItem>
      }
    >
      <Await resolve={reportFight}>
        {(resolved) => (
          <BreadcrumbItem>
            {t(`difficulty.${String(resolved.difficulty)}`)}{" "}
            {t(`encounter.${String(resolved.encounter.id)}`)}
          </BreadcrumbItem>
        )}
      </Await>
    </Suspense>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default function ReportRoute() {
  const { reportFight, fightPlayers } = useReportCodeFightLoaderData();
  const { t } = useTranslation();

  const allData = useMemo(
    () => Promise.all([reportFight, fightPlayers]),
    [fightPlayers, reportFight],
  );

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
            <ReportFightNameBreadcrumbItem />
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <H1>{t("reports.selection.player.heading")}</H1>
          <Lead>{t("reports.selection.player.description")}</Lead>
        </div>
      </div>
      <section>
        <Suspense fallback={<PlayerListSkeleton />}>
          <Await resolve={allData}>
            {([fight, players]) => (
              <PlayerList fight={fight} players={players} />
            )}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
