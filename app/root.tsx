import "unfonts.css";
import "~/tailwind.css";

import type {
  DataFunctionArgs,
  HeadersFunction,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import type { ReactNode } from "react";

import { AppErrorBoundary } from "~/components/AppErrorBoundary.tsx";
import { SiteFooter } from "~/components/SiteFooter.tsx";
import { SiteHeader } from "~/components/SiteHeader.tsx";
import { TailwindIndicator } from "~/components/TailwindIndicator.tsx";
import { href as iconsHref } from "~/components/ui/icon.tsx";
import { siteConfig } from "~/config/site.ts";
import { serverTiming } from "~/constants.ts";
import { useTheme } from "~/hooks/useTheme.ts";
import { ClientHintCheck, getHints } from "~/lib/client-hints.tsx";
import { getEnv } from "~/lib/env.server.ts";
import { combineHeaders, getDomainUrl } from "~/lib/misc.ts";
import { useNonce } from "~/lib/nonce-provider.ts";
import type { Theme } from "~/lib/theme.server.ts";
import { getTheme } from "~/lib/theme.server.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { isPresent } from "~/typeGuards.ts";
import { TooltipProvider } from "~/components/ui/tooltip.tsx";

export const links: LinksFunction = () => {
  return [
    // Preload svg sprite as a resource to avoid render blocking
    { rel: "preload", href: iconsHref, as: "image" },

    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png?v=1",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png?v=1",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png?v=1",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico?v=1",
    },
    { rel: "manifest", href: "/site.webmanifest?v=1" },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg?v=1",
      color: "#5bbad5",
    },
  ].filter(isPresent);
};

export const meta: MetaFunction = () => {
  return [
    { title: siteConfig.title },
    { property: "og:url", content: siteConfig.url },
    { property: "twitter:url", content: siteConfig.url },
    { property: "image:alt", content: siteConfig.title },
    { property: "og:type", content: "website" },
    { property: "og:title", content: siteConfig.title },
    { property: "og:site_name", content: siteConfig.title },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: siteConfig.ogImage },
    { property: "og:image:alt", content: siteConfig.title },
    { property: "og:description", content: siteConfig.description },
    { property: "twitter:description", content: siteConfig.description },
    { property: "twitter:creator", content: "@ToppleTheNun" },
    { property: "twitter:title", content: siteConfig.title },
    { property: "twitter:image", content: siteConfig.ogImage },
    { property: "twitter:image:alt", content: siteConfig.title },
    { property: "twitter:card", content: "summary" },
    { property: "description", content: siteConfig.description },
    { property: "name", content: siteConfig.title },
    { property: "author", content: "Richard Harrah" },
    { property: "revisit-after", content: "7days" },
    { property: "distribution", content: "global" },
    { property: "msapplication-TileColor", content: "#da532c" },
    { property: "theme-color", content: "#ffffff" },
  ];
};

export function loader({ request }: DataFunctionArgs) {
  const timings = makeTimings("root loader");

  return json(
    {
      ENV: getEnv(),
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: {
          theme: getTheme(request),
        },
      },
    },
    { headers: combineHeaders({ [serverTiming]: timings.toString() }) },
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Server-Timing": loaderHeaders.get("Server-Timing") ?? "",
  };
};

function Document({
  children,
  nonce,
  theme,
  env,
}: {
  children: ReactNode;
  nonce: string;
  theme?: Theme;
  env?: Record<string, string>;
}) {
  return (
    <html className={theme} lang="en" dir="auto">
      <head>
        <ClientHintCheck nonce={nonce} />
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <TailwindIndicator />
        <LiveReload nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const nonce = useNonce();

  captureRemixErrorBoundaryError(error);

  return (
    <Document nonce={nonce}>
      <AppErrorBoundary error={error} />
    </Document>
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const theme = useTheme();

  return (
    <Document nonce={nonce} theme={theme} env={data.ENV}>
      <TooltipProvider>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader theme={data.requestInfo.userPrefs.theme} />
          <div className="flex-1">
            <Outlet />
          </div>
          <SiteFooter />
        </div>
      </TooltipProvider>
    </Document>
  );
}

export default withSentry(App);
