import { useParams } from "@remix-run/react";

import { H1, H2, Lead } from "~/components/typography.tsx";

export default function ReportRoute() {
  const { reportCode, fight, player } = useParams();

  return (
    <>
      <div className="pb-8 space-y-2">
        <H1>Can&apos;t touch this.</H1>
        <Lead>
          Streaks below from report with code {reportCode} and fight {fight} and
          player {player}.
        </Lead>
      </div>
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <H2>Streaks go here</H2>
            <Lead>Streaks will eventually go here. It&apos;ll be neat.</Lead>
          </div>
        </div>
      </section>
    </>
  );
}
