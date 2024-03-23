import { Skeleton } from "~/components/ui/skeleton.tsx";
import type { ReportFight } from "~/lib/query/report.server.ts";

export function FightListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="space-y-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}

interface FightListProps {
  fights: ReportFight[];
}

export function FightList({ fights }: FightListProps) {
  console.log("Rendering FightList", fights);
  return (
    <div className="space-y-8">
      {fights.map((fight) => (
        <div
          className="flex items-center rounded-md border p-4"
          key={fight.fightID}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {fight.encounterID}
            </p>
            <p className="text-sm text-muted-foreground">
              {String(fight.difficulty)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
