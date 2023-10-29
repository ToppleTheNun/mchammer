/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  serverModuleFormat: "esm",
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  watchPaths: ["./tailwind.config.ts"],
}
