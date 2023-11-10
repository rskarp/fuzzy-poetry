// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ReplacementType = {
  "MEANS_LIKE": "MEANS_LIKE",
  "TRIGGERED_BY": "TRIGGERED_BY",
  "ANAGRAM": "ANAGRAM",
  "SPELLED_LIKE": "SPELLED_LIKE",
  "CONSONANT_MATCH": "CONSONANT_MATCH",
  "HOMOPHONE": "HOMOPHONE"
};

const { PoemVariation } = initSchema(schema);

export {
  PoemVariation,
  ReplacementType
};