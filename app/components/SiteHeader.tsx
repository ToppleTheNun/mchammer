import { NavLink } from "@remix-run/react";

import { MainNav } from "#app/components/MainNav.tsx";
import { MobileNav } from "#app/components/MobileNav.tsx";
import { ModeToggle } from "#app/components/ModeToggle.tsx";
import { SeasonSwitcher } from "#app/components/SeasonSwitcher.tsx";
import { buttonVariants } from "#app/components/ui/button.tsx";
import { Icon } from "#app/components/ui/icon.tsx";
import { siteConfig } from "#app/config/site.ts";
import type { Theme } from "#app/lib/theme.server.ts";
import { cn } from "#app/lib/utils.ts";

export const SiteHeader = ({ theme }: { theme: Theme | null }) => (
  <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
    <div className="container flex h-14 items-center">
      <MainNav />
      <MobileNav />
      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <SeasonSwitcher />
        </div>
        <nav className="flex items-center">
          <NavLink
            to={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={cn(buttonVariants({ variant: "ghost" }), "w-9 px-0")}
            >
              <Icon name="github-logo" className="h-4 w-4">
                <span className="sr-only">GitHub</span>
              </Icon>
            </div>
          </NavLink>
          <ModeToggle userPreference={theme} />
        </nav>
      </div>
    </div>
  </header>
);
