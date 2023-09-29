// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ReplacementType = {
  "MEANS_LIKE": "MEANS_LIKE",
  "TRIGGERED_BY": "TRIGGERED_BY"
};

const { PoemVariation } = initSchema(schema);

export {
  PoemVariation,
  ReplacementType
};