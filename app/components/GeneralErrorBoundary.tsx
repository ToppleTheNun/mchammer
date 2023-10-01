import { isRouteErrorResponse } from "@remix-run/react";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "#app/components/PageHeader.tsx";
import { PageLayout } from "#app/components/PageLayout.tsx";
import { SiteFooter } from "#app/components/SiteFooter.tsx";
import { H2, Lead } from "#app/components/typography.tsx";

const Header = () => (
  <PageHeader className="pb-8">
    <PageHeaderHeading>Apparently, you could touch this.</PageHeaderHeading>
    <PageHeaderDescription>
      We were only able to dodge, parry, or make you miss for so long.
    </PageHeaderDescription>
  </PageHeader>
);

export const GeneralErrorBoundary = ({ error }: { error: unknown }) => {
  if (isRouteErrorResponse(error)) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <PageLayout pageHeader={<Header />}>
            <section className="hidden md:block">
              <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
                <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
                  <H2>
                    {error.status} {error.statusText}
                  </H2>
                  <Lead>{error.data}</Lead>
                </div>
              </div>
            </section>
          </PageLayout>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <PageLayout pageHeader={<Header />}>
            <section className="hidden md:block">
              <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
                <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
                  <H2>Error</H2>
                  <Lead>{error.message}</Lead>
                  <Lead>Stack Trace</Lead>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {error.stack}
                  </code>
                </div>
              </div>
            </section>
          </PageLayout>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">
        <PageLayout pageHeader={<Header />}>
          <section className="hidden md:block">
            <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
              <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
                <H2>Unknown Error</H2>
                <Lead>
                  If you&apos;re seeing this, bug Topple relentlessly until he
                  fixes this.
                </Lead>
              </div>
            </div>
          </section>
        </PageLayout>
      </div>
      <SiteFooter />
    </div>
  );
};
