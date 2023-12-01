import type { ReactNode } from "react";

export function PageLayout({
  children,
  pageHeader,
}: {
  children: ReactNode;
  pageHeader?: ReactNode;
}) {
  return (
    <main className="container relative">
      {pageHeader}
      {children}
    </main>
  );
}
