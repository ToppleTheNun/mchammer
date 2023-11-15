import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((env) => ({
  build: {
    sourcemap: true,
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "topplethenun",
      project: "mchammer",
    }),
  ],
}));
