import { NavLink } from "@remix-run/react";

import type { ReactNode } from "react";
import { MainNav } from "~/components/MainNav.tsx";
import { MobileNav } from "~/components/MobileNav.tsx";
import { ModeToggle } from "~/components/ModeToggle.tsx";
import { buttonVariants } from "~/components/ui/button.tsx";
import { Icon } from "~/components/ui/icon.tsx";
import { siteConfig } from "~/config/site.ts";
import { cn } from "~/lib/utils.ts";

interface SideHeaderProps {
  children?: ReactNode;
}
export function SiteHeader({ children }: SideHeaderProps) {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {children}
          <nav className="flex items-center">
            <NavLink
              to={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(buttonVariants({ variant: "ghost" }), "w-9 px-0")}
              >
                <Icon name="github-logo" size="sm">
                  <span className="sr-only">GitHub</span>
                </Icon>
              </div>
            </NavLink>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
