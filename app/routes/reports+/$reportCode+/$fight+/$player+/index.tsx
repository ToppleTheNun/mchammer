import { invariant } from "@epic-web/invariant";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useAsyncError, useLoaderData } from "@remix-run/react";
import { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import { H2, Lead } from "~/components/typography.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
import {
  getCachedFight,
  getCachedReport,
  type PlayerDetailWithRole,
} from "~/lib/query/report.server.ts";
import { PositiveIntegerSchema, ReportCodeSchema } from "~/lib/schemas.ts";
import { makeTimings, time } from "~/lib/timing.server.ts";

// region Loader
const ParamsSchema = z.object({
  reportCode: ReportCodeSchema,
  fight: PositiveIntegerSchema,
  player: PositiveIntegerSchema,
});
export async function loader({ params }: LoaderFunctionArgs) {
  const timings = makeTimings("reports/$reportCode/$fight loader");

  const {
    reportCode,
    fight: selectedFight,
    player: selectedPlayer,
  } = await time(() => ParamsSchema.parseAsync(params), {
    timings,
    type: "params parse",
  });

  const cachedReport = getCachedReport({ reportID: reportCode }, { timings });
  const cachedSelectedFight = cachedReport.then((report) => {
    return getCachedFight(report, selectedFight, { timings });
  });
  const cachedSelectedPlayer = cachedSelectedFight.then((fight) => {
    const foundPlayer = fight.players.find((it) => it.id === selectedPlayer);
    invariant(foundPlayer, "Unable to find player with matching ID");
    return foundPlayer;
  });

  return defer({
    report: cachedReport.then((report) => ({
      title: report.title,
      reportCode: report.reportCode,
    })),
    fight: cachedSelectedFight.then((fight) => ({
      id: fight.fightID,
      difficulty: fight.difficulty,
      encounter: fight.encounter,
    })),
    player: cachedSelectedPlayer,
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
  const { report, fight } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  const allPromises = useMemo(
    () => Promise.all([report, fight]),
    [report, fight],
  );

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
        resolve={allPromises}
        errorElement={
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t("breadcrumbs.selection.fight")}</BreadcrumbItem>
          </>
        }
      >
        {([resolvedReport, resolvedFight]) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/reports/${resolvedReport.reportCode}/${String(resolvedFight.id)}`}
              >
                {t(`difficulty.${String(resolvedFight.difficulty)}`)}{" "}
                {t(`encounter.${String(resolvedFight.encounter.id)}`)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </Await>
    </Suspense>
  );
}

function PlayerNameBreadcrumbItem() {
  const { player } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <BreadcrumbItem>{t("breadcrumbs.selection.player")}</BreadcrumbItem>
      }
    >
      <Await resolve={player}>
        {(resolved) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{resolved.name}</BreadcrumbItem>
          </>
        )}
      </Await>
    </Suspense>
  );
}

function Header() {
  return null;
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

function PlayerErrorElement() {
  throw useAsyncError();
}
// endregion

// region Route
export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}

export default function ReportsFightRoute() {
  const { player } = useLoaderData<typeof loader>();
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
            <PlayerNameBreadcrumbItem />
          </BreadcrumbList>
        </Breadcrumb>
        <Header />
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
          <Await resolve={player} errorElement={<PlayerErrorElement />}>
            {(resolved) => <ReportPlayerStreaks player={resolved} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
// endregion
