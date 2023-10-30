import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { error, info } from "@topplethenun/mchammer-logger";
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
  const client = await getGqlClient({
    getWCLAuthentication,
    setWCLAuthentication,
    clientId: process.env.WARCRAFT_LOGS_CLIENT_ID,
    clientSecret: process.env.WARCRAFT_LOGS_CLIENT_SECRET,
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

  info("gql schema loaded");
};

init({
  BUILD_TIME: "",
  BUILD_TIMESTAMP: "",
  COMMIT_SHA: "",
});
loadSchema().catch(error);
