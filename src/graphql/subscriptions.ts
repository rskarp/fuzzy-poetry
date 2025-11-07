/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePoemVariation = /* GraphQL */ `subscription OnCreatePoemVariation(
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePoemVariationSubscriptionVariables,
  APITypes.OnCreatePoemVariationSubscription
>;
export const onUpdatePoemVariation = /* GraphQL */ `subscription OnUpdatePoemVariation(
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePoemVariationSubscriptionVariables,
  APITypes.OnUpdatePoemVariationSubscription
>;
export const onDeletePoemVariation = /* GraphQL */ `subscription OnDeletePoemVariation(
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePoemVariationSubscriptionVariables,
  APITypes.OnDeletePoemVariationSubscription
>;
