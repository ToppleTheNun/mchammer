import { Link } from "@remix-run/react";

import { siteConfig } from "#app/config/site.ts";

export const MainNav = () => (
  <div className="mr-4 hidden md:flex">
    <Link to="/" className="mr-6 flex items-center space-x-2">
      <img
        src="/logo.webp"
        alt="Logo"
        height="128"
        width="128"
        className="h-8 w-8"
      />
      <span className="hidden font-bold sm:inline-block">
        {siteConfig.name}
      </span>
    </Link>
  </div>
);
