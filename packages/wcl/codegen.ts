import type { CodegenConfig } from "@graphql-codegen/cli";

export default {
  overwrite: true,
  schema: "./src/gql/schema.graphql",
  documents: "./src/**/*.graphql",
  emitLegacyCommonJSImports: false,
  generates: {
    "./src/types.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        gqlImport: "@urql/core#gql",
        useTypeImports: true,
        withHooks: false,
      },
    },
  },
} satisfies CodegenConfig;
