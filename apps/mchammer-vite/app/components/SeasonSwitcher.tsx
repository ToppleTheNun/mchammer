import { useNavigate, useParams } from "@remix-run/react";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar.tsx";
import { Button } from "~/components/ui/button.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command.tsx";
import { Icon } from "~/components/ui/icon.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover.tsx";
import { cn } from "~/lib/utils.ts";
import { seasons } from "~/seasons.ts";
import { isPresent } from "~/typeGuards.ts";

type Season = { label: string; value: string; icon: string };
type SeasonGroup = { label: string; seasons: Season[] };

const ptrSeasons: SeasonGroup = {
  label: "PTR Seasons",
  seasons: seasons
    .filter((season) => season.ptr)
    .map((season) => ({
      label: season.name,
      value: season.slug,
      icon: season.seasonIcon,
    })),
};
const liveSeasons: SeasonGroup = {
  label: "Live Seasons",
  seasons: seasons
    .filter((season) => !season.ptr)
    .map((season) => ({
      label: season.name,
      value: season.slug,
      icon: season.seasonIcon,
    })),
};

const groups: SeasonGroup[] = [
  ptrSeasons.seasons.length > 0 ? ptrSeasons : null,
  liveSeasons,
].filter(isPresent);

const findMatchingSeason = (name: string | undefined): Season | undefined =>
  groups
    .flatMap((group) => group.seasons)
    .find((season) => season.value === name);

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface SeasonSwitcherProps extends PopoverTriggerProps {}
export const SeasonSwitcher = ({ className }: SeasonSwitcherProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    findMatchingSeason(params.season),
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[200px] justify-between", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={selectedSeason?.icon}
              alt={selectedSeason?.label}
            />
            <AvatarFallback>WoW</AvatarFallback>
          </Avatar>
          {selectedSeason?.label ?? "No Season Selected"}
          <Icon
            name="caret-sort"
            className="ml-auto h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search season..." />
            <CommandEmpty>No season found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.seasons.map((season) => (
                  <CommandItem
                    key={season.value}
                    onSelect={() => {
                      setSelectedSeason(season);
                      setOpen(false);
                      navigate(`/season/${season.value}`);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={season.icon}
                        alt={season.label}
                        className="grayscale"
                      />
                      <AvatarFallback>WoW</AvatarFallback>
                    </Avatar>
                    {season.label}
                    <Icon
                      name="check"
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedSeason?.value === season.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
