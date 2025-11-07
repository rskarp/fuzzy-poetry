/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPoemVariation = /* GraphQL */ `query GetPoemVariation($id: ID!) {
  getPoemVariation(id: $id) {
    id
    original_text
    variation_text
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPoemVariationQueryVariables,
  APITypes.GetPoemVariationQuery
>;
export const listPoemVariations = /* GraphQL */ `query ListPoemVariations(
  $filter: ModelPoemVariationFilterInput
  $limit: Int
  $nextToken: String
) {
  listPoemVariations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      original_text
      variation_text
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPoemVariationsQueryVariables,
  APITypes.ListPoemVariationsQuery
>;
export const syncPoemVariations = /* GraphQL */ `query SyncPoemVariations(
  $filter: ModelPoemVariationFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncPoemVariations(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      original_text
      variation_text
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncPoemVariationsQueryVariables,
  APITypes.SyncPoemVariationsQuery
>;
