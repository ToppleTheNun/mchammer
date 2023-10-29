import type { ReactNode } from "react";

export const PageLayout = ({
  children,
  pageHeader,
}: {
  children: ReactNode;
  pageHeader?: ReactNode;
}) => (
  <main className="container relative">
    {pageHeader}
    {children}
  </main>
);
