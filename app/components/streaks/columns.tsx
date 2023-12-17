import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import { regionSchema } from "~/constants.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.tsx";
import { Button } from "~/components/ui/button.tsx";
import { Icon } from "~/components/ui/icon.tsx";

const dodgeParryMissStreakSchema = z.object({
  id: z.string(),
  region: regionSchema,
  realm: z.string(),
  character: z.string(),
  dodge: z.number().int().gte(0),
  parry: z.number().int().gte(0),
  miss: z.number().int().gte(0),
  streak: z.string(),
});

export type DodgeParryMissStreak = z.infer<typeof dodgeParryMissStreakSchema>;

export const columns: ColumnDef<DodgeParryMissStreak>[] = [
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => {
      return String(row.getValue("region")).toUpperCase();
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
    accessorKey: "streak",
    header: () => <div className="text-left">Streak</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("streak")}</div>
      );
    },
  },
  {
    accessorKey: "dodge",
    header: () => <div className="text-center">Dodge</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("dodge")}</div>
      );
    },
  },
  {
    accessorKey: "parry",
    header: () => <div className="text-center">Parry</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("parry")}</div>
      );
    },
  },
  {
    accessorKey: "miss",
    header: () => <div className="text-center">Miss</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">{row.getValue("miss")}</div>
      );
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
              <Icon name="dots-horizontal" size="sm" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(streak.id)}
            >
              Copy streak ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View character</DropdownMenuItem>
            <DropdownMenuItem>View streak details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
