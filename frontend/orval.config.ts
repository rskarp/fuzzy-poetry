import { defineConfig } from 'orval';

export default defineConfig({
  'fuzzy-poetry-transformer': {
    output: {
      mode: 'single',
      target: './src/api.ts',
      schemas: './src/model',
      client: 'react-query',
    },
    input: {
      target: '../openapi.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});