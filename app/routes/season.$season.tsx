import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/PageHeader.tsx";
import { PageLayout } from "~/components/PageLayout.tsx";
import { serverTiming } from "~/constants.ts";
import { combineHeaders, invariantResponse } from "~/lib/misc.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { type Season, findSeasonByName } from "~/seasons.ts";
import { StreaksDataTable } from "~/components/streaks/data-table.tsx";

export function loader({ params }: DataFunctionArgs) {
  invariantResponse(
    "season" in params && params.season,
    "Missing season parameter",
  );

  const season = findSeasonByName(params.season);
  invariantResponse(season, "Unable to find season by provided name");

  const timings = makeTimings(`${season.name} loader`);

  return json(
    { season },
    {
      headers: combineHeaders({ [serverTiming]: timings.toString() }),
    },
  );
}

function Header({ season }: { season: Season }) {
  return (
    <PageHeader className="pb-8">
      <PageHeaderHeading>Can&apos;t touch this.</PageHeaderHeading>
      <PageHeaderDescription>
        Consecutive parry, dodge, and miss leaderboard for instanced World of
        Warcraft content in {season.name}.
      </PageHeaderDescription>
    </PageHeader>
  );
}

function SeasonRoute() {
  const { season } = useLoaderData<typeof loader>();

  return (
    <PageLayout pageHeader={<Header season={season} />}>
      <StreaksDataTable />
    </PageLayout>
  );
}

export default SeasonRoute;
