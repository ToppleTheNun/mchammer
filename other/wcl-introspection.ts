import "dotenv/config";

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

import type { IntrospectionQuery } from "graphql";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";

import { error, info } from "~/lib/log.server.ts";
import { makeTimings } from "~/lib/timing.server.ts";
import { getGqlClient } from "~/lib/wcl/client.server.ts";

async function loadSchema() {
  const timings = makeTimings("wcl introspection");
  const client = await getGqlClient({ timings });

  const response = await client.request<IntrospectionQuery>(
    getIntrospectionQuery(),
  );

  const schema = printSchema(buildClientSchema(response));

  const targetPath = resolve("app/lib/wcl/gql/schema.graphql");
  writeFileSync(targetPath, schema);

  info("wcl gql schema loaded");
}

loadSchema().catch((err: unknown) => {
  error("Unable to load WCL GraphQL schema", err);
  process.exit(1);
});
