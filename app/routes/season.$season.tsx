import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/PageHeader.tsx";
import { PageLayout } from "~/components/PageLayout.tsx";
import { Lead } from "~/components/typography.tsx";
import { serverTiming } from "~/constants.ts";
import { combineHeaders, invariantResponse } from "~/lib/misc.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { type Season, findSeasonByName } from "~/seasons.ts";

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
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <Lead>
              Hey, we&apos;re building here. Mind looking somewhere else?
            </Lead>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default SeasonRoute;
