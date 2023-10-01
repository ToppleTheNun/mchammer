import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { serverTiming } from "#app/constants.ts";
import { combineHeaders, invariantResponse } from "#app/lib/misc.ts";
import { makeTimings, time } from "#app/lib/timing.server.ts";
import { findSeasonByName } from "#app/seasons.ts";

export const loader = async () => {
  const timings = makeTimings("index loader");

  const latest = await time(() => findSeasonByName("latest"), {
    type: "findSeasonByName-latest",
    timings,
  });

  invariantResponse(latest, "Could not determine latest season.", {
    status: 500,
  });

  return redirect(`/season/${latest.slug}`, {
    status: 307,
    headers: combineHeaders({ [serverTiming]: timings.toString() }),
  });
};

const IndexRoute = () => <Outlet />;

export default IndexRoute;
