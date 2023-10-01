import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "#app/components/PageHeader.tsx";
import { PageLayout } from "#app/components/PageLayout.tsx";
import { Lead } from "#app/components/typography.tsx";

const Header = () => (
  <PageHeader className="pb-8">
    <PageHeaderHeading>Can&apos;t touch this.</PageHeaderHeading>
    <PageHeaderDescription>
      Consecutive parry, dodge, and miss leaderboard for instanced World of
      Warcraft content.
    </PageHeaderDescription>
  </PageHeader>
);

const IndexRoute = () => (
  <PageLayout pageHeader={<Header />}>
    <section className="hidden md:block">
      <div className="overflow-hidden rounded-lg border bg-background px-4 shadow">
        <div className="flex h-[50vh] items-center justify-center">
          <Lead>
            Hey, we&apos;re building here. Mind looking somewhere else?
          </Lead>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default IndexRoute;
