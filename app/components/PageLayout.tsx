import type { ReactNode } from "react";

export const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="container">
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">{children}</div>
    </main>
  </div>
);
