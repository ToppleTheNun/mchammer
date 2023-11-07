import "dotenv/config";

import { writeFileSync } from "fs";
import type { IntrospectionQuery } from "graphql";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { resolve } from "path";

import { error, info } from "#app/lib/log.server.ts";

import { getGqlClient } from "../client.server.ts";

const loadSchema = async () => {
  const client = await getGqlClient();

  const response = await client.query<IntrospectionQuery>(
    getIntrospectionQuery(),
    {},
  );
  if (!response.data) {
    throw new Error("Unable to load introspection data!");
  }

  const schema = printSchema(buildClientSchema(response.data));

  const targetPath = resolve("app/wcl/gql/schema.graphql");
  writeFileSync(targetPath, schema);

  info("gql schema loaded");
};

loadSchema().catch(error);