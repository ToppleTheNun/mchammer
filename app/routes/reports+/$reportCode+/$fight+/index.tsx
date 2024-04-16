import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import {
  PlayerList,
  PlayerListError,
  PlayerListSkeleton,
} from "~/components/PlayerList.tsx";
import { H1, Lead } from "~/components/typography.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
import { getCachedFight, getCachedReport } from "~/lib/query/report.server.ts";
import { PositiveIntegerSchema, ReportCodeSchema } from "~/lib/schemas.ts";
import { makeTimings, time } from "~/lib/timing.server.ts";

// region Loader
const ParamsSchema = z.object({
  reportCode: ReportCodeSchema,
  fight: PositiveIntegerSchema,
});
export async function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("reports/$reportCode/$fight loader");

  const { reportCode, fight: selectedFight } = await time(
    () => ParamsSchema.parseAsync(params),
    {
      timings,
      type: "params parse",
    },
  );

  const cachedReport = getCachedReport({ reportID: reportCode }, { timings });
  const cachedSelectedFight = cachedReport.then((report) => {
    return getCachedFight(report, selectedFight, { timings });
  });

  return defer({
    report: cachedReport.then((report) => ({
      title: report.title,
      reportCode: report.reportCode,
    })),
    fight: cachedSelectedFight,
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

function FightNameBreadcrumbItem() {
  const { fight } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{t("breadcrumbs.selection.fight")}</BreadcrumbItem>
        </>
      }
    >
      <Await
        resolve={fight}
        errorElement={
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t("breadcrumbs.selection.fight")}</BreadcrumbItem>
          </>
        }
      >
        {(resolved) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {t(`difficulty.${String(resolved.difficulty)}`)}{" "}
              {t(`encounter.${String(resolved.encounter.id)}`)}
            </BreadcrumbItem>
          </>
        )}
      </Await>
    </Suspense>
  );
}

function Header() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <H1>{t("reports.selection.player.heading")}</H1>
      <Lead>{t("reports.selection.player.description")}</Lead>
    </div>
  );
}
// endregion

// region Route
export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default function ReportsFightRoute() {
  const { fight } = useLoaderData<typeof loader>();
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
            <FightNameBreadcrumbItem />
          </BreadcrumbList>
        </Breadcrumb>
        <Header />
      </div>
      <section>
        <Suspense fallback={<PlayerListSkeleton />}>
          <Await resolve={fight} errorElement={<PlayerListError />}>
            {(resolved) => (
              <PlayerList fight={resolved} players={resolved.players} />
            )}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
// endregion
