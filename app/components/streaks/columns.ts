import type { ColumnDef } from "@tanstack/react-table";

import type { Region } from "~/constants.ts";

export interface DodgeParryMissStreak {
  id: number;
  region: Region;
  realm: string;
  character: string;
  dodge: number;
  parry: number;
  miss: number;
  streak: number;
}

export const columns: ColumnDef<DodgeParryMissStreak>[] = [
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "realm",
    header: "Realm",
  },
  {
    accessorKey: "character",
    header: "Character",
  },
  {
    accessorKey: "dodge",
    header: "Dodge",
  },
  {
    accessorKey: "parry",
    header: "Parry",
  },
  {
    accessorKey: "miss",
    header: "Miss",
  },
  {
    accessorKey: "streak",
    header: "Streak",
  },
];
