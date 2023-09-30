import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
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

import { ErrorPageHeader } from "~/components/PageHeader";
import { PageLayout } from "~/components/PageLayout";
import { SiteFooter } from "~/components/SiteFooter";
import { TailwindIndicator } from "~/components/TailwindIndicator";
import { H2, Lead } from "~/components/typography";
import { siteConfig } from "~/config/site";
import fontStylesheetUrl from "~/font.css";
import { getEnv } from "~/lib/env.server";
import tailwindStylesheetUrl from "~/tailwind.css";
import { isPresent } from "~/typeGuards";

export const links: LinksFunction = () => {
  return [
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

export const loader = () => {
  return json({
    ENV: getEnv(),
  });
};

const Document = ({ children }: { children: ReactNode }) => {
  return (
    <html className="dark" lang="en" dir="auto">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
        <TailwindIndicator />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  captureRemixErrorBoundaryError(error);

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <PageLayout>
              <ErrorPageHeader />
              <div className="pb-12 pt-8">
                <H2>
                  {error.status} {error.statusText}
                </H2>
                <Lead>{error.data}</Lead>
              </div>
            </PageLayout>
          </div>
          <SiteFooter />
        </div>
      </Document>
    );
  }

  if (error instanceof Error) {
    return (
      <Document>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            <PageLayout>
              <ErrorPageHeader />
              <div className="pb-12 pt-8">
                <H2>Error</H2>
                <Lead>{error.message}</Lead>
                <Lead>Stack Trace</Lead>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {error.stack}
                </code>
              </div>
            </PageLayout>
          </div>
          <SiteFooter />
        </div>
      </Document>
    );
  }

  return (
    <Document>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <PageLayout>
            <ErrorPageHeader />
            <div className="pb-12 pt-8">
              <H2>Unknown Error</H2>
              <Lead>
                If you&apos;re seeing this, bug Topple relentlessly until he
                fixes this.
              </Lead>
            </div>
          </PageLayout>
        </div>
        <SiteFooter />
      </div>
    </Document>
  );
};

function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <Document>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      <ScrollRestoration />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
      <Analytics />
    </Document>
  );
}

export default withSentry(App);
