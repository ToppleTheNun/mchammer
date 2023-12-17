import type { ReactNode } from "react";

export function PageLayout({
  children,
  pageHeader,
}: {
  children: ReactNode;
  pageHeader?: ReactNode;
}) {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      {pageHeader}
      {children}
    </main>
  );
}
