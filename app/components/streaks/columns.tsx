import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import type { ClassValue } from "clsx";

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
import { cn } from "~/lib/utils.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card.tsx";

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

export const streaksTextLastFactory = (
  alignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    accessorKey: "dodge",
    header: () => <div className="text-right">Dodge</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("dodge")}</div>
      );
    },
  },
  {
    accessorKey: "parry",
    header: () => <div className="text-right">Parry</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("parry")}</div>
      );
    },
  },
  {
    accessorKey: "miss",
    header: () => <div className="text-right">Miss</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("miss")}</div>
      );
    },
  },
  {
    accessorKey: "streak",
    header: () => <div className={cn(alignment)}>Streak</div>,
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium", alignment)}>
          {row.getValue("streak")}
        </div>
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

export const streaksNumberLastFactory = (
  alignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    accessorKey: "dodge",
    header: () => <div className="text-right">Dodge</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("dodge")}</div>
      );
    },
  },
  {
    accessorKey: "parry",
    header: () => <div className="text-right">Parry</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("parry")}</div>
      );
    },
  },
  {
    accessorKey: "miss",
    header: () => <div className="text-right">Miss</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("miss")}</div>
      );
    },
  },
  {
    accessorKey: "streak",
    header: () => <div className={cn(alignment)}>Streak</div>,
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium", alignment)}>
          {String(row.getValue("streak")).length}
        </div>
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

export const streaksTextFourthFactory = (
  alignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    header: () => <div className={cn(alignment)}>Streak</div>,
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium", alignment)}>
          {row.getValue("streak")}
        </div>
      );
    },
  },
  {
    accessorKey: "dodge",
    header: () => <div className="text-right">Dodge</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("dodge")}</div>
      );
    },
  },
  {
    accessorKey: "parry",
    header: () => <div className="text-right">Parry</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("parry")}</div>
      );
    },
  },
  {
    accessorKey: "miss",
    header: () => <div className="text-right">Miss</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("miss")}</div>
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

export const streaksNumberFourthFactory = (
  alignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    header: () => <div className={cn(alignment)}>Streak</div>,
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium", alignment)}>
          {String(row.getValue("streak")).length}
        </div>
      );
    },
  },
  {
    accessorKey: "dodge",
    header: () => <div className="text-right">Dodge</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("dodge")}</div>
      );
    },
  },
  {
    accessorKey: "parry",
    header: () => <div className="text-right">Parry</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("parry")}</div>
      );
    },
  },
  {
    accessorKey: "miss",
    header: () => <div className="text-right">Miss</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("miss")}</div>
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

export const streaksTextNoSubFactory = (
  alignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    header: () => <div className={cn(alignment)}>Streak</div>,
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium", alignment)}>
          {row.getValue("streak")}
        </div>
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

export const streaksNumberNoSubFactory = (
  alignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    header: () => <div className={cn(alignment)}>Streak</div>,
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium", alignment)}>
          {String(row.getValue("streak")).length}
        </div>
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

export const streaksTextTooltipFactory = (
  headerAlignment: ClassValue,
  flexAlignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    header: () => <div className={cn(headerAlignment)}>Streak</div>,
    cell: ({ row }) => {
      const streak = String(row.getValue("streak"));
      const dodge = (streak.match(/D/g) || []).length;
      const parry = (streak.match(/P/g) || []).length;
      const miss = (streak.match(/M/g) || []).length;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn("font-medium", flexAlignment, "flex", "gap-3")}
              >
                {streak}
                <Icon name="info-circled" size="sm" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <p>{dodge} Dodge</p>
                <p>{parry} Parry</p>
                <p>{miss} Miss</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

export const streaksTextHoverCardFactory = (
  headerAlignment: ClassValue,
  flexAlignment: ClassValue,
): ColumnDef<DodgeParryMissStreak>[] => [
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
    header: () => <div className={cn(headerAlignment)}>Streak</div>,
    cell: ({ row }) => {
      const streak = String(row.getValue("streak"));
      const dodge = (streak.match(/D/g) || []).length;
      const parry = (streak.match(/P/g) || []).length;
      const miss = (streak.match(/M/g) || []).length;
      return (
        <HoverCard>
          <HoverCardTrigger>
            <div className={cn("font-medium", flexAlignment, "flex", "gap-3")}>
              {streak}
              <Icon name="info-circled" size="sm" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div>
              <p>{dodge} Dodge</p>
              <p>{parry} Parry</p>
              <p>{miss} Miss</p>
            </div>
          </HoverCardContent>
        </HoverCard>
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
