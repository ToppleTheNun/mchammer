import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { invariantResponse } from "@epic-web/invariant";

import { serverTiming } from "~/constants.ts";
import { combineHeaders } from "~/lib/misc.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { type Season, findSeasonByName } from "~/seasons.ts";
import { StreaksDataTable } from "~/components/streaks/data-table.tsx";
import { H1, Lead } from "~/components/typography.tsx";
import { AppLayout } from "~/components/layouts/AppLayout.tsx";
import { SeasonSwitcher } from "~/components/SeasonSwitcher.tsx";

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
    <div className="pb-8 space-y-2">
      <H1>Can&apos;t touch this.</H1>
      <Lead>
        Consecutive parry, dodge, and miss leaderboard for instanced World of
        Warcraft content in {season.name}.
      </Lead>
    </div>
  );
}

function SeasonRoute() {
  const { season } = useLoaderData<typeof loader>();

  return (
    <AppLayout
      siteHeaderChildren={
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <SeasonSwitcher />
        </div>
      }
    >
      <Header season={season} />
      <StreaksDataTable />
    </AppLayout>
  );
}

export default SeasonRoute;
