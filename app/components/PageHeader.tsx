import { NavLink } from "@remix-run/react";

import { H1, Lead } from "#app/components/typography.tsx";

export const IndexPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <H1>MCHammer</H1>
    </NavLink>
    <Lead>
      "Can&apos;t touch this" leaderboard for World of Warcraft instanced
      content.
    </Lead>
  </div>
);

export const ErrorPageHeader = () => (
  <div className="space-y-2">
    <NavLink to="/">
      <H1>MCHammer</H1>
    </NavLink>
    <Lead>
      We&apos;d say &quot;can&apos;t&quot; touch this, but that would be a lie.
    </Lead>
  </div>
);
