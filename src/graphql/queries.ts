/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPoemVariation = /* GraphQL */ `
  query GetPoemVariation($id: ID!) {
    getPoemVariation(id: $id) {
      id
      original_text
      variation_text
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPoemVariations = /* GraphQL */ `
  query ListPoemVariations(
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
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPoemVariations = /* GraphQL */ `
  query SyncPoemVariations(
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
      }
      nextToken
      startedAt
    }
  }
`;
