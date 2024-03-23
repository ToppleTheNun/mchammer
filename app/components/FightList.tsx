import { useTranslation } from "react-i18next";

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

interface FightListItemProps {
  fight: ReportFight;
}
export function FightListItem({ fight }: FightListItemProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center rounded-md border p-4"
      key={fight.fightID}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {t(`difficulty.${String(fight.difficulty)}`)}{" "}
          {t(`encounter.${String(fight.encounterID)}`)}
        </p>
        <p className="text-sm text-muted-foreground">
          {String(fight.difficulty)}
        </p>
      </div>
    </div>
  );
}

interface FightListProps {
  fights: ReportFight[];
}

export function FightList({ fights }: FightListProps) {
  return (
    <div className="space-y-8">
      {fights.map((fight) => (
        <FightListItem key={fight.fightID} fight={fight} />
      ))}
    </div>
  );
}
