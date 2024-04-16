import { Link, useAsyncError } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar.tsx";
import { Skeleton } from "~/components/ui/skeleton.tsx";
import type {
  EnhancedFight,
  PlayerDetailType,
  PlayerDetailWithRole,
  Role,
} from "~/lib/query/report.server.ts";
import { cn } from "~/lib/utils.ts";

function PlayerListItemSkeleton() {
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

export function PlayerListSkeleton() {
  return (
    <div className="space-y-8">
      <PlayerListItemSkeleton />
    </div>
  );
}

export function PlayerListError() {
  throw useAsyncError();
}

export const specToTextClassNameMap: Record<PlayerDetailType, string> = {
  DeathKnight: "text-wow-class-deathknight",
  DemonHunter: "text-wow-class-demonhunter",
  Druid: "text-wow-class-druid",
  Evoker: "text-wow-class-evoker",
  Hunter: "text-wow-class-hunter",
  Mage: "text-wow-class-mage",
  Monk: "text-wow-class-monk",
  Paladin: "text-wow-class-paladin",
  Priest: "text-wow-class-priest",
  Rogue: "text-wow-class-rogue",
  Shaman: "text-wow-class-shaman",
  Warlock: "text-wow-class-warlock",
  Warrior: "text-wow-class-warrior",
};
export const roleToBorderClassNameMap: Record<Role, string> = {
  tank: "border-t-wow-role-tank",
  healer: "border-t-wow-role-healer",
  dps: "border-t-wow-role-dps",
};

interface PlayerListItemProps {
  fight: EnhancedFight;
  player: PlayerDetailWithRole;
}
export function PlayerListItem({ fight, player }: PlayerListItemProps) {
  const { t } = useTranslation();

  const spec = player.specs.at(0)?.spec;

  return (
    <Link
      className={cn(
        "flex items-center rounded-md border p-4",
        roleToBorderClassNameMap[player.role],
      )}
      to={`/reports/${fight.reportCode}/${String(fight.fightID)}/${String(player.id)}`}
    >
      <Avatar className="h-9 w-9">
        {spec ? (
          <AvatarImage
            src={`/img/specs/${player.type.toLowerCase()}/${spec.toLowerCase()}.png`}
            alt="Avatar"
          />
        ) : null}
        <AvatarFallback>{player.name.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{player.name}</p>
        <p
          className={cn(
            "text-sm font-medium leading-none",
            specToTextClassNameMap[player.type],
          )}
        >
          {spec
            ? t(`specs.${player.type.toLowerCase()}.${spec.toLowerCase()}`)
            : t(`specs.${player.type.toLowerCase()}.DEFAULT`)}
        </p>
      </div>
    </Link>
  );
}

interface PlayerListProps {
  fight: EnhancedFight;
  players: PlayerDetailWithRole[];
}

export function PlayerList({ fight, players }: PlayerListProps) {
  return (
    <div className="space-y-8">
      {players.map((player) => (
        <PlayerListItem key={player.guid} fight={fight} player={player} />
      ))}
    </div>
  );
}
