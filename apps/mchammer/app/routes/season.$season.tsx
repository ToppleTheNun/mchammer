import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "#app/components/PageHeader.tsx";
import { PageLayout } from "#app/components/PageLayout.tsx";
import { Lead } from "#app/components/typography.tsx";
import { serverTiming } from "#app/constants.ts";
import { combineHeaders, invariantResponse } from "#app/lib/misc.ts";
import { makeTimings } from "#app/lib/timing.server.ts";
import { findSeasonByName, type Season } from "#app/seasons.ts";

export const loader = ({ params }: DataFunctionArgs) => {
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
};

const Header = ({ season }: { season: Season }) => (
  <PageHeader className="pb-8">
    <PageHeaderHeading>Can&apos;t touch this.</PageHeaderHeading>
    <PageHeaderDescription>
      Consecutive parry, dodge, and miss leaderboard for instanced World of
      Warcraft content in {season.name}.
    </PageHeaderDescription>
  </PageHeader>
);

const SeasonRoute = () => {
  const { season } = useLoaderData<typeof loader>();

  return (
    <PageLayout pageHeader={<Header season={season} />}>
      <section className="hidden md:block">
        <div className="bg-background overflow-hidden rounded-lg border px-4 shadow">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <Lead>
              Hey, we&apos;re building here. Mind looking somewhere else?
            </Lead>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SeasonRoute;
