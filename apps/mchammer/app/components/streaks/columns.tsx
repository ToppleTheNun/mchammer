import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "#app/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#app/components/ui/dropdown-menu.tsx";
import type { Region } from "#app/constants.ts";

export type DodgeParryMissStreak = {
  id: number;
  region: Region;
  realm: string;
  character: string;
  dodge: number;
  parry: number;
  miss: number;
  streak: number;
};

export const columns: ColumnDef<DodgeParryMissStreak>[] = [
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => {
      const region = row.getValue("region");
      if (typeof region === "string") {
        return <div>{region.toUpperCase()}</div>;
      }
      return <div>???</div>;
    },
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
    header: () => <div className="text-right">Dodge</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("dodge"));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "parry",
    header: () => <div className="text-right">Parry</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("parry"));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "miss",
    header: () => <div className="text-right">Miss</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("miss"));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "streak",
    header: () => <div className="text-right">Streak</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("streak"));
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const streak = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View streak details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View streak on WarcraftLogs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
