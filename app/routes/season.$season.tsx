import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { invariantResponse } from "@epic-web/invariant";

import { nanoid } from "nanoid";
import {
  cacheControl,
  eTag,
  expires,
  lastModified,
  serverTiming,
  setCookie,
} from "~/constants.ts";
import { combineHeaders } from "~/lib/misc.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { type Season, findSeasonByName } from "~/seasons.ts";
import { StreaksDataTable } from "~/components/streaks/data-table.tsx";
import { H1, H2, Lead } from "~/components/typography.tsx";
import { AppLayout } from "~/components/layouts/AppLayout.tsx";
import { SeasonSwitcher } from "~/components/SeasonSwitcher.tsx";
import type { DodgeParryMissStreak } from "~/components/streaks/columns.tsx";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const loaderCache = loaderHeaders.get(cacheControl);

  const headers: HeadersInit = {
    [cacheControl]: loaderCache ?? "public",
  };

  const expiresDate = loaderHeaders.get(expires);

  if (expiresDate) {
    // gets overwritten by cacheControl if present anyways
    headers.Expires = expiresDate;
  }

  const lastModifiedDate = loaderHeaders.get(lastModified);

  if (lastModifiedDate) {
    headers[lastModified] = lastModifiedDate;
  }

  const maybeETag = loaderHeaders.get(eTag);

  if (maybeETag) {
    headers[eTag] = maybeETag;
  }

  const maybeSetCookie = loaderHeaders.get(setCookie);

  if (maybeSetCookie) {
    headers[setCookie] = maybeSetCookie;
  }

  const serverTimings = loaderHeaders.get(serverTiming);

  if (serverTimings) {
    headers[serverTiming] = serverTimings;
  }

  return headers;
};

const generateStreak = () => {
  const characters = "DPM";
  const length = Math.ceil(Math.random() * 10);
  return Array.from({ length })
    .fill("")
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");
};

const generateDodgeParryMissStreak = (): DodgeParryMissStreak => {
  const streak = generateStreak();
  const dodge = (streak.match(/D/g) || []).length;
  const parry = (streak.match(/P/g) || []).length;
  const miss = (streak.match(/M/g) || []).length;
  return {
    id: nanoid(),
    region: "us",
    realm: "Area 52",
    character: "Toppledh",
    dodge,
    parry,
    miss,
    streak,
  };
};

export function loader({ params }: LoaderFunctionArgs) {
  invariantResponse(
    "season" in params && params.season,
    "Missing season parameter",
  );

  const season = findSeasonByName(params.season);
  invariantResponse(season, "Unable to find season by provided name");

  const timings = makeTimings(`${season.name} loader`);

  const enhancedSeason = {
    ...season,
    streaks: [
      generateDodgeParryMissStreak(),
      generateDodgeParryMissStreak(),
      generateDodgeParryMissStreak(),
    ],
  };

  return json(
    { season: enhancedSeason },
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

export function ErrorBoundary() {
  return (
    <AppLayout
      siteHeaderChildren={
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <SeasonSwitcher />
        </div>
      }
    >
      <div className="pb-8 space-y-2">
        <H1>Apparently, you could touch this.</H1>
        <Lead>
          We were only able to dodge, parry, or make you miss for so long.
        </Lead>
      </div>
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <H2>404</H2>
            <Lead>Unable to find season</Lead>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

export default function SeasonRoute() {
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
      <StreaksDataTable data={season.streaks} />
    </AppLayout>
  );
}
