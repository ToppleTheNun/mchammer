import type { CodegenConfig } from "@graphql-codegen/cli";

export default {
  overwrite: true,
  schema: "./app/wcl/gql/schema.graphql",
  documents: "./app/wcl/**/*.graphql",
  generates: {
    "./app/wcl/types.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: {
        gqlImport: "@urql/core#gql",
        useTypeImports: true,
        withHooks: false,
      },
    },
    "./schema.json": {
      plugins: ["introspection"],
    },
  },
} satisfies CodegenConfig;
