import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { init } from "@topplethenun/mchammer-env";
import type { IntrospectionQuery } from "graphql";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";

import { getGqlClient } from "../src/client.js";
import { type WCLAuth, type WCLOAuthResponse } from "../src/index.js";

const getWCLAuthentication = async (): Promise<WCLAuth | null> => null;
const setWCLAuthentication = async (
  wclOAuthResponse: WCLOAuthResponse,
): Promise<void> => {};

const loadSchema = async () => {
  const clientId = process.env.WARCRAFT_LOGS_CLIENT_ID;
  const clientSecret =  process.env.WARCRAFT_LOGS_CLIENT_SECRET;
  if (!clientId) {
    throw new Error("WARCRAFT_LOGS_CLIENT_ID not defined");
  }
  if (!clientSecret) {
    throw new Error("WARCRAFT_LOGS_CLIENT_SECRET not defined");
  }

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
  if (!response.data) {
    throw new Error("Unable to load introspection data!");
  }

  const schema = printSchema(buildClientSchema(response.data));

  const targetPath = resolve("src/gql/schema.graphql");
  writeFileSync(targetPath, schema);

  console.log("gql schema loaded");
};

init({
  BUILD_TIME: "",
  BUILD_TIMESTAMP: "",
  COMMIT_SHA: "",
});
loadSchema().catch(console.error);
