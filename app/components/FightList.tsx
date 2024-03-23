import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar.tsx";
import { Progress } from "~/components/ui/progress.tsx";
import { Skeleton } from "~/components/ui/skeleton.tsx";
import type { ReportFight } from "~/lib/query/report.server.ts";

function FightListItemSkeleton() {
  return (
    <div className="flex items-center rounded-md border p-4">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="ml-4 space-y-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function FightListSkeleton() {
  return (
    <div className="space-y-8">
      <FightListItemSkeleton />
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
      <Avatar className="h-9 w-9">
        <AvatarImage src={fight.encounter.icon} alt="Avatar" />
        <AvatarFallback>
          {t(`encounter.${String(fight.encounter.id)}`).substring(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">
          {t(`difficulty.${String(fight.difficulty)}`)}{" "}
          {t(`encounter.${String(fight.encounter.id)}`)}
        </p>
        <Progress value={fight.percentage} />
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
