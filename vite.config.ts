import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
    }),
    sentryVitePlugin({
      org: "topplethenun",
      project: "mchammer",
    }),
  ],
});
