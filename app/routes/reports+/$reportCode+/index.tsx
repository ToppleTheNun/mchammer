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
import { Progress } from "~/components/ui/progress.tsx";
import { Skeleton } from "~/components/ui/skeleton.tsx";
import { getErrorMessage } from "~/lib/misc.ts";
import {
  getCachedReport,
  type ReportFight,
} from "~/lib/query/report.server.ts";
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

function FightListItemSkeleton() {
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

function FightListSkeleton() {
  return (
    <div className="space-y-8">
      <FightListItemSkeleton />
    </div>
  );
}

function FightListItem({ fight }: { fight: ReportFight }) {
  const { t } = useTranslation();

  return (
    <Link
      className="flex items-center rounded-md border p-4"
      to={`/reports/${fight.reportCode}/${String(fight.fightID)}`}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={fight.encounter.icon} alt="Avatar" />
        <AvatarFallback>
          {t(`encounter.${String(fight.encounter.id)}`).substring(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">
          {t(`difficulty.${String(fight.difficulty)}`)}{" "}
          {t(`encounter.${String(fight.encounter.id)}`)}
        </p>
        <Progress value={fight.percentage} />
      </div>
    </Link>
  );
}

function FightList({ fights }: { fights: ReportFight[] }) {
  return (
    <div className="space-y-8">
      {fights.map((fight) => (
        <FightListItem key={fight.fightID} fight={fight} />
      ))}
    </div>
  );
}

function FightListError() {
  const error = useAsyncError();
  captureRemixErrorBoundaryError(error);

  const message = getErrorMessage(error);
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <H2>{t("errors.report.DEFAULT")}</H2>
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
