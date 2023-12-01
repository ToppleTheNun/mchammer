import type { CodegenConfig } from '@graphql-codegen/cli';

export default {
  overwrite: true,
  schema: './app/wcl/gql/schema.graphql',
  documents: './app/wcl/gql/queries.graphql',
  emitLegacyCommonJSImports: false,
  ignoreNoDocuments: true,
  generates: {
    './app/wcl/types.server.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        useTypeImports: true,
      },
    },
    './app/wcl/gql/schema.json': {
      plugins: ['introspection'],
    },
  },
  hooks: {
    afterOneFileWrite: ['tsx other/fix-graphql-request-import.ts', 'eslint --fix'],
  },
} satisfies CodegenConfig;
