import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
    }),
    tsconfigPaths(),
    Unfonts({
      fontsource: {
        families: ["Inter Variable"],
      },
    }),
    sentryVitePlugin({
      org: "topplethenun",
      project: "mchammer",
    }),
  ],
});
