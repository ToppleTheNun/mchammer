import { useParams } from "@remix-run/react";

import { H1, H2, Lead } from "~/components/typography.tsx";

export default function ReportRoute() {
  const { reportCode } = useParams();

  return (
    <>
      <div className="pb-8 space-y-2">
        <H1>Can&apos;t touch this.</H1>
        <Lead>Select a fight below from report with code {reportCode}.</Lead>
      </div>
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <H2>Eligible fights go here</H2>
            <Lead>Fights will eventually go here. It&apos;ll be neat.</Lead>
          </div>
        </div>
      </section>
    </>
  );
}
