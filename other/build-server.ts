import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'
import fsExtra from 'fs-extra'
import { globSync } from 'glob'

import pkg from "../package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const here = (...s: string[]) => path.join(__dirname, ...s)
const globsafe = (s: string) => s.replace(/\\/g, '/')

const allFiles = globSync(globsafe(here('../server/**/*.*')), {
  ignore: [
    'server/dev-server.js', // for development only
    '**/tsconfig.json',
    '**/eslint*',
    '**/__tests__/**',
  ],
})

const entries = []
for (const file of allFiles) {
  if (/\.(ts|js|tsx|jsx)$/.test(file)) {
    entries.push(file)
  } else {
    const dest = file.replace(here('../server'), here('../server-build'))
    fsExtra.ensureDirSync(path.parse(dest).dir)
    fsExtra.copySync(file, dest)
    console.log(`copied: ${file.replace(`${here('../server')}/`, '')}`)
  }
}

console.log()
console.log('building...')

try {
  await build({
    entryPoints: entries,
    outdir: here('../server-build'),
    target: [`node${pkg.engines.node}`],
    platform: 'node',
    sourcemap: true,
    format: 'esm',
    logLevel: 'info',
  });
} catch (error: unknown) {
  console.error(error);
  process.exit(1);
}