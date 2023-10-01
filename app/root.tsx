import { parse } from "@conform-to/zod";
import { cssBundleHref } from "@remix-run/css-bundle";
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
import { Analytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";

import { GeneralErrorBoundary } from "#app/components/GeneralErrorBoundary.tsx";
import { SiteFooter } from "#app/components/SiteFooter.tsx";
import { SiteHeader } from "#app/components/SiteHeader.tsx";
import { TailwindIndicator } from "#app/components/TailwindIndicator.tsx";
import { href as iconsHref } from "#app/components/ui/icon.tsx";
import { siteConfig } from "#app/config/site.ts";
import { serverTiming } from "#app/constants.ts";
import fontStylesheetUrl from "#app/font.css";
import { themeFormSchema, useTheme } from "#app/hooks/useTheme.ts";
import { ClientHintCheck, getHints } from "#app/lib/client-hints.tsx";
import { getEnv } from "#app/lib/env.server.ts";
import { combineHeaders, getDomainUrl } from "#app/lib/misc.ts";
import { useNonce } from "#app/lib/nonce-provider.ts";
import { getTheme, setTheme, type Theme } from "#app/lib/theme.server.ts";
import { makeTimings } from "#app/lib/timing.server.ts";
import tailwindStylesheetUrl from "#app/tailwind.css";
import { isPresent } from "#app/typeGuards.ts";

export const links: LinksFunction = () => {
  return [
    // Preload svg sprite as a resource to avoid render blocking
    { rel: "preload", href: iconsHref, as: "image" },
    // Preload CSS as a resource to avoid render blocking
    { rel: "preload", href: fontStylesheetUrl, as: "style" },
    { rel: "preload", href: tailwindStylesheetUrl, as: "style" },
    cssBundleHref ? { rel: "preload", href: cssBundleHref, as: "style" } : null,

    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
    { rel: "manifest", href: "/site.webmanifest" },
    {
      rel: "mask-icon",
      href: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },

    // These should match the css preloads above to avoid css as render blocking resource
    { rel: "stylesheet", href: fontStylesheetUrl },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    cssBundleHref ? { rel: "stylesheet", href: cssBundleHref } : null,
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

export const loader = ({ request }: DataFunctionArgs) => {
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
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Server-Timing": loaderHeaders.get("Server-Timing") ?? "",
  };
};

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: themeFormSchema,
  });
  if (submission.intent !== "submit") {
    return json({ status: "idle", submission } as const);
  }
  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }
  const { theme } = submission.value;

  const responseInit = {
    headers: { "set-cookie": setTheme(theme) },
  };
  return json({ success: true, submission }, responseInit);
}

const Document = ({
  children,
  nonce,
  theme,
  env,
}: {
  children: ReactNode;
  nonce: string;
  theme?: Theme;
  env?: Record<string, string>;
}) => {
  return (
    <html className={`${theme} h-full overflow-x-hidden`} lang="en" dir="auto">
      <head>
        <ClientHintCheck nonce={nonce} />
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Links />
      </head>
      <body className="bg-background font-sans text-foreground">
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <TailwindIndicator />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  const nonce = useNonce();

  captureRemixErrorBoundaryError(error);

  return (
    <Document nonce={nonce}>
      <GeneralErrorBoundary error={error} />
    </Document>
  );
};

const App = () => {
  const data = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const theme = useTheme();

  return (
    <Document nonce={nonce} theme={theme} env={data.ENV}>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader theme={data.requestInfo.userPrefs.theme} />
        <div className="flex-1">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      <Analytics />
    </Document>
  );
};

export default withSentry(App);
