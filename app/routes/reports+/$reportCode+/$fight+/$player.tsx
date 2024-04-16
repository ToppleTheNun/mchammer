import { Await, Link } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { H1, H2, Lead } from "~/components/typography.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
import type { PlayerDetailWithRole } from "~/lib/query/report.server.ts";
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
            <BreadcrumbLink
              href={`/reports/${resolved.reportCode}/${String(resolved.fightID)}`}
            >
              {t(`difficulty.${String(resolved.difficulty)}`)}{" "}
              {t(`encounter.${String(resolved.encounter.id)}`)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Await>
    </Suspense>
  );
}

function ReportPlayerNameBreadcrumbItem() {
  const { selectedPlayer } = useReportCodeFightLoaderData();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <BreadcrumbItem>{t("breadcrumbs.selection.player")}</BreadcrumbItem>
      }
    >
      <Await resolve={selectedPlayer}>
        {(resolved) => (
          <BreadcrumbItem>
            {resolved ? resolved.name : t("errors.unknown-player")}
          </BreadcrumbItem>
        )}
      </Await>
    </Suspense>
  );
}

function ReportPlayerStreaks({
  player,
}: {
  player: PlayerDetailWithRole | null;
}) {
  if (!player) {
    return (
      <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
        <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
          <H2>Player not found</H2>
          <Lead>Unable to find a player with the given ID in this fight.</Lead>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <H2>Streaks for {player.name} go here</H2>
        <Lead>
          Streaks for {player.name} will eventually go here. It&apos;ll be neat.
        </Lead>
      </div>
    </div>
  );
}

export default function PlayerRoute() {
  const { selectedPlayer } = useReportCodeFightLoaderData();
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
            <ReportFightNameBreadcrumbItem />
            <BreadcrumbSeparator />
            <ReportPlayerNameBreadcrumbItem />
          </BreadcrumbList>
        </Breadcrumb>
        <div className="space-y-2">
          <H1>{t("reports.selection.player.heading")}</H1>
          <Lead>{t("reports.selection.player.description")}</Lead>
        </div>
      </div>
      <section>
        <Suspense
          fallback={
            <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
              <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
                <H2>Streaks go here</H2>
                <Lead>
                  Streaks will eventually go here. It&apos;ll be neat.
                </Lead>
              </div>
            </div>
          }
        >
          <Await resolve={selectedPlayer}>
            {(resolved) => <ReportPlayerStreaks player={resolved} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
