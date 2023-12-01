import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const argv = process.argv.slice(2);
const file = argv.at(0);
if (file) {
  const path = join(process.cwd(), file);
  const contents = readFileSync(path, { encoding: 'utf-8' })
    .replace('import type { GraphQLClient } from \'graphql-request\';', 'import type { GraphQLClient, RequestOptions  } from \'graphql-request\';')
    .replace('import type { GraphQLClientRequestHeaders } from \'graphql-request/build/esm/types.js\';', 'type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];');
  writeFileSync(path, contents, { encoding: 'utf-8' });
}
