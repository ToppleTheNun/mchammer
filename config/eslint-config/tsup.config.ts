import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  sourcemap: true,
  target: 'node18',
  ...options,
}));
