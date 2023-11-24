import { useFetcher } from "@remix-run/react";
import { route } from "routes-gen";

import { Button } from "#app/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#app/components/ui/dropdown-menu.tsx";
import { Icon } from "#app/components/ui/icon.tsx";
import { useOptimisticThemeMode } from "#app/hooks/useTheme.ts";
import type { Theme } from "#app/lib/theme.server.ts";
import type { action } from "#app/routes/actions.theme.ts";

export function ModeToggle({
  userPreference,
}: {
  userPreference?: Theme | null
}) {
  const fetcher = useFetcher<typeof action>();

  const optimisticMode = useOptimisticThemeMode();
  const mode = optimisticMode ?? userPreference ?? "system";
  const changeTheme = (theme: typeof mode) => {
    fetcher.submit(
      { theme },
      { action: route("/actions/theme"), method: "POST" },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <Icon
            name="sun"
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            name="moon"
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
