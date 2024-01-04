import "unfonts.css";
import "~/tailwind.css";

import type {
  HeadersArgs,
  LinksFunction,
  LoaderFunctionArgs,
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
import {
  PreventFlashOnWrongTheme,
  type Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { AppErrorBoundary } from "~/components/AppErrorBoundary.tsx";
import { TailwindIndicator } from "~/components/TailwindIndicator.tsx";
import { href as iconsHref } from "~/components/ui/icon.tsx";
import { siteConfig } from "~/config/site.ts";
import { serverTiming } from "~/constants.ts";
import { ClientHintCheck, getHints } from "~/lib/client-hints.tsx";
import { getEnv } from "~/lib/env.server.ts";
import { combineHeaders, getDomainUrl } from "~/lib/misc.ts";
import { useNonce } from "~/lib/nonce-provider.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { isPresent } from "~/typeGuards.ts";
import { TooltipProvider } from "~/components/ui/tooltip.tsx";
import { themeSessionResolver } from "~/sessions.server.ts";
import { cn } from "~/lib/utils.ts";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const timings = makeTimings("root loader");
  const { getTheme } = await themeSessionResolver(request);

  return json(
    {
      ENV: getEnv(),
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: {},
      },
      theme: getTheme(),
    },
    { headers: combineHeaders({ [serverTiming]: timings.toString() }) },
  );
}

export function headers({ loaderHeaders }: HeadersArgs) {
  return {
    "Server-Timing": loaderHeaders.get("Server-Timing") ?? "",
  };
}

function Document({
  children,
  nonce,
  theme,
  env,
}: {
  children: ReactNode;
  nonce: string;
  theme: Theme | null;
  env?: Record<string, string>;
}) {
  return (
    <html className={cn(theme)} lang="en" dir="auto">
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
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
    <ThemeProvider specifiedTheme={null} themeAction="/action/set-theme">
      <TooltipProvider>
        <Document nonce={nonce} theme={null}>
          <AppErrorBoundary error={error} />
        </Document>
      </TooltipProvider>
    </ThemeProvider>
  );
}

function App() {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const [theme] = useTheme();

  return (
    <Document nonce={nonce} env={data.ENV} theme={theme}>
      <Outlet />
    </Document>
  );
}

function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default withSentry(AppWithProviders);
