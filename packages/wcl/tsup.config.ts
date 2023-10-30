import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  ...options,
}));
