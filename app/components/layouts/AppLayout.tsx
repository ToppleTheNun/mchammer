import type { ReactNode } from "react";
import { SiteHeader } from "~/components/SiteHeader.tsx";
import { SiteFooter } from "~/components/SiteFooter.tsx";

interface AppLayoutProps {
  children?: ReactNode;
  siteHeaderChildren?: ReactNode;
}
export function AppLayout({ children, siteHeaderChildren }: AppLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader>{siteHeaderChildren}</SiteHeader>
      <div className="flex-1">
        <div className="border-b">
          <div className="container flex-1 items-start">
            <main className="relative py-6 lg:gap-10 lg:py-8">{children}</main>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
