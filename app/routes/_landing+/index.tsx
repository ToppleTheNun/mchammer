import { parseWithZod } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";

import { H1, H2, Lead } from "~/components/typography.tsx";
import { getReportLinkData, ReportLinkUrlSchema } from "~/lib/report-links.ts";
import { isPresent } from "~/lib/typeGuards.ts";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: ReportLinkUrlSchema,
  });

  invariantResponse(submission.status === "success", "Invalid url received");

  const url = submission.value;

  const reportLinkData = getReportLinkData(url);

  const redirectUrl = [
    "reports",
    reportLinkData.reportCode,
    reportLinkData.fight,
    reportLinkData.player,
  ]
    .filter(isPresent)
    .join("/");

  return redirect(`/${redirectUrl}`);
}

export default function IndexRoute() {
  return (
    <>
      <div className="pb-8 space-y-2">
        <H1>Can&apos;t touch this.</H1>
        <Lead>
          Paste a Warcraft Logs link below to see dodge, parry, and miss
          streaks.
        </Lead>
      </div>
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
          <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
            <H2>WCL link input go here</H2>
            <Lead>
              WCL link input will eventually go here. It&apos;ll be neat.
            </Lead>
          </div>
        </div>
      </section>
    </>
  );
}
