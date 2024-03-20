import type { CodegenConfig } from "@graphql-codegen/cli";
import dedent from "ts-dedent";

export default {
  overwrite: true,
  schema: "./app/lib/wcl/gql/schema.graphql",
  documents: "./app/lib/wcl/gql/queries.graphql",
  emitLegacyCommonJSImports: false,
  ignoreNoDocuments: true,
  generates: {
    "./app/lib/wcl/types.server.ts": {
      plugins: [
        {
          add: {
            content: dedent`
              // Generated file, changes will eventually be overwritten!
              /* eslint-disable @typescript-eslint/no-explicit-any */
              /* eslint-disable @typescript-eslint/no-redundant-type-constituents */
              /* eslint-disable @typescript-eslint/no-unused-vars */
            `
          }
        },
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        useTypeImports: true,
      },
    },
    "./app/lib/wcl/gql/schema.json": {
      plugins: ["introspection"],
    },
  },
  hooks: {
    afterOneFileWrite: ["eslint --fix", "prettier --write"],
  },
} satisfies CodegenConfig;
