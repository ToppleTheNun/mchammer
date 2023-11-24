import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

import type { IntrospectionQuery } from "graphql";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";

import { getGqlClient } from "../src/client.js";
import type { WCLAuth } from "../src/index.js";

const getWCLAuthentication = async (): Promise<WCLAuth | null> => null;
async function setWCLAuthentication(): Promise<void> {}

async function loadSchema() {
  const clientId = process.env.WARCRAFT_LOGS_CLIENT_ID;
  const clientSecret = process.env.WARCRAFT_LOGS_CLIENT_SECRET;
  if (!clientId)
    throw new Error("WARCRAFT_LOGS_CLIENT_ID not defined");

  if (!clientSecret)
    throw new Error("WARCRAFT_LOGS_CLIENT_SECRET not defined");

  const client = await getGqlClient({
    getWCLAuthentication,
    setWCLAuthentication,
    clientId,
    clientSecret,
  });

  const response = await client.query<IntrospectionQuery>(
    getIntrospectionQuery(),
    {},
  );
  if (!response.data)
    throw new Error("Unable to load introspection data!");

  const schema = printSchema(buildClientSchema(response.data));

  const targetPath = resolve("src/gql/schema.graphql");
  writeFileSync(targetPath, schema);

  console.log("gql schema loaded");
}

loadSchema().catch(console.error);
