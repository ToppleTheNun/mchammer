import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { IntrospectionQuery } from 'graphql';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';

import { getGqlClient } from '~/wcl/client.server.ts';

async function loadSchema() {
  const client = await getGqlClient();

  const response = await client.request<IntrospectionQuery>(
    getIntrospectionQuery(),
  );

  const schema = printSchema(buildClientSchema(response));

  const targetPath = resolve('app/wcl/gql/schema.graphql');
  writeFileSync(targetPath, schema);

  console.log('wcl gql schema loaded');
}

loadSchema().catch(console.error);
