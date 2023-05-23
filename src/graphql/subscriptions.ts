/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePoemVariation = /* GraphQL */ `
  subscription OnCreatePoemVariation(
    $filter: ModelSubscriptionPoemVariationFilterInput
  ) {
    onCreatePoemVariation(filter: $filter) {
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
export const onUpdatePoemVariation = /* GraphQL */ `
  subscription OnUpdatePoemVariation(
    $filter: ModelSubscriptionPoemVariationFilterInput
  ) {
    onUpdatePoemVariation(filter: $filter) {
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
export const onDeletePoemVariation = /* GraphQL */ `
  subscription OnDeletePoemVariation(
    $filter: ModelSubscriptionPoemVariationFilterInput
  ) {
    onDeletePoemVariation(filter: $filter) {
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
