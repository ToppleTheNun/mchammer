import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, Link, useAsyncError, useLoaderData } from "@remix-run/react";
import { captureRemixErrorBoundaryError } from "@sentry/remix";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary.tsx";
import { H1, H2, Lead } from "~/components/typography.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb.tsx";
import { Skeleton } from "~/components/ui/skeleton.tsx";
import { getErrorMessage } from "~/lib/misc.ts";
import {
  type EnhancedFight,
  getCachedFight,
  getCachedReport,
  type PlayerDetailType,
  type PlayerDetailWithRole,
  type Role,
} from "~/lib/query/report.server.ts";
import { PositiveIntegerSchema, ReportCodeSchema } from "~/lib/schemas.ts";
import { makeTimings, time } from "~/lib/timing.server.ts";
import { cn } from "~/lib/utils.ts";

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

function PlayerListItemSkeleton() {
  return (
    <div className="flex items-center rounded-md border p-4">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="ml-4 space-y-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function PlayerListSkeleton() {
  return (
    <div className="space-y-8">
      <PlayerListItemSkeleton />
    </div>
  );
}

const specToTextClassNameMap: Record<PlayerDetailType, string> = {
  DeathKnight: "text-wow-class-deathknight",
  DemonHunter: "text-wow-class-demonhunter",
  Druid: "text-wow-class-druid",
  Evoker: "text-wow-class-evoker",
  Hunter: "text-wow-class-hunter",
  Mage: "text-wow-class-mage",
  Monk: "text-wow-class-monk",
  Paladin: "text-wow-class-paladin",
  Priest: "text-wow-class-priest",
  Rogue: "text-wow-class-rogue",
  Shaman: "text-wow-class-shaman",
  Warlock: "text-wow-class-warlock",
  Warrior: "text-wow-class-warrior",
};
const roleToBorderClassNameMap: Record<Role, string> = {
  tank: "border-t-wow-role-tank",
  healer: "border-t-wow-role-healer",
  dps: "border-t-wow-role-dps",
};

function PlayerListItem({
  fight,
  player,
}: {
  fight: EnhancedFight;
  player: PlayerDetailWithRole;
}) {
  const { t } = useTranslation();

  const spec = player.specs.at(0)?.spec;

  return (
    <Link
      className={cn(
        "flex items-center rounded-md border p-4",
        roleToBorderClassNameMap[player.role],
      )}
      to={`/reports/${fight.reportCode}/${String(fight.fightID)}/${String(player.id)}`}
    >
      <Avatar className="h-9 w-9">
        {spec ? (
          <AvatarImage
            src={`/img/specs/${player.type.toLowerCase()}/${spec.toLowerCase()}.png`}
            alt="Avatar"
          />
        ) : null}
        <AvatarFallback>{player.name.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{player.name}</p>
        <p
          className={cn(
            "text-sm font-medium leading-none",
            specToTextClassNameMap[player.type],
          )}
        >
          {spec
            ? t(`specs.${player.type.toLowerCase()}.${spec.toLowerCase()}`)
            : t(`specs.${player.type.toLowerCase()}.DEFAULT`)}
        </p>
      </div>
    </Link>
  );
}

function PlayerList({
  fight,
  players,
}: {
  fight: EnhancedFight;
  players: PlayerDetailWithRole[];
}) {
  return (
    <div className="space-y-8">
      {players.map((player) => (
        <PlayerListItem key={player.guid} fight={fight} player={player} />
      ))}
    </div>
  );
}

function PlayerListError() {
  const error = useAsyncError();
  captureRemixErrorBoundaryError(error);

  const message = getErrorMessage(error);
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <H2>{t("errors.fight.DEFAULT")}</H2>
        <Lead>{message}</Lead>
      </div>
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
