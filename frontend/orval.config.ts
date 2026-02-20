import { defineConfig } from 'orval';

export default defineConfig({
  'fuzzy-poetry-transformer': {
    output: {
      mode: 'single',
      target: './src/api.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api-client.ts',
          name: 'customAxiosInstance',
        },
      },
    },
    input: {
      target: '../openapi.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});