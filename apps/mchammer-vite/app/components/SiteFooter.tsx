import { siteConfig } from "~/config/site.ts";

export const SiteFooter = () => (
  <footer className="space-y-2 py-6 md:px-8 md:py-0">
    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
        Built by{" "}
        <a
          href={siteConfig.links.twitter}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          ToppleTheNun
        </a>
        . The source code is available on{" "}
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
        Using and inspired by{" "}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          shadcn/ui
        </a>
        .
      </p>
    </div>
  </footer>
);