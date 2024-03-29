import { invariantResponse } from "@epic-web/invariant";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { findSeasonByName } from "~/data/seasons.ts";
import { serverTiming } from "~/lib/constants.ts";
import { combineHeaders } from "~/lib/misc.ts";
import { makeTimings, time } from "~/lib/timing.server.ts";

export async function loader() {
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
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    headers: combineHeaders({ [serverTiming]: timings.toString() }),
  });
}

const IndexRoute = () => <Outlet />;

export default IndexRoute;
