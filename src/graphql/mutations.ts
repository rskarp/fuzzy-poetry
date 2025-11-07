/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createPoemVariation = /* GraphQL */ `mutation CreatePoemVariation(
  $input: CreatePoemVariationInput!
  $condition: ModelPoemVariationConditionInput
) {
  createPoemVariation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePoemVariationMutationVariables,
  APITypes.CreatePoemVariationMutation
>;
export const updatePoemVariation = /* GraphQL */ `mutation UpdatePoemVariation(
  $input: UpdatePoemVariationInput!
  $condition: ModelPoemVariationConditionInput
) {
  updatePoemVariation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePoemVariationMutationVariables,
  APITypes.UpdatePoemVariationMutation
>;
export const deletePoemVariation = /* GraphQL */ `mutation DeletePoemVariation(
  $input: DeletePoemVariationInput!
  $condition: ModelPoemVariationConditionInput
) {
  deletePoemVariation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePoemVariationMutationVariables,
  APITypes.DeletePoemVariationMutation
>;
export const generatePoemVariation = /* GraphQL */ `mutation GeneratePoemVariation(
  $originalPoem: String
  $replacementTypes: [ReplacementType]
) {
  generatePoemVariation(
    originalPoem: $originalPoem
    replacementTypes: $replacementTypes
  )
}
` as GeneratedMutation<
  APITypes.GeneratePoemVariationMutationVariables,
  APITypes.GeneratePoemVariationMutation
>;
export const generateCombinedVariation = /* GraphQL */ `mutation GenerateCombinedVariation(
  $originalPoem: String
  $replacementTypeCounts: ReplacementTypeCounts
  $algoVersion: String
) {
  generateCombinedVariation(
    originalPoem: $originalPoem
    replacementTypeCounts: $replacementTypeCounts
    algoVersion: $algoVersion
  )
}
` as GeneratedMutation<
  APITypes.GenerateCombinedVariationMutationVariables,
  APITypes.GenerateCombinedVariationMutation
>;
export const generateMultimodalVariation = /* GraphQL */ `mutation GenerateMultimodalVariation(
  $inputImageUrl: String
  $replacementTypeCounts: ReplacementTypeCounts
  $numRelatedImages: Int
  $model: String
) {
  generateMultimodalVariation(
    inputImageUrl: $inputImageUrl
    replacementTypeCounts: $replacementTypeCounts
    numRelatedImages: $numRelatedImages
    model: $model
  )
}
` as GeneratedMutation<
  APITypes.GenerateMultimodalVariationMutationVariables,
  APITypes.GenerateMultimodalVariationMutation
>;
export const sendEmail = /* GraphQL */ `mutation SendEmail(
  $senderName: String
  $senderAddress: String
  $emailContent: String
  $emailSubject: String
) {
  sendEmail(
    senderName: $senderName
    senderAddress: $senderAddress
    emailContent: $emailContent
    emailSubject: $emailSubject
  )
}
` as GeneratedMutation<
  APITypes.SendEmailMutationVariables,
  APITypes.SendEmailMutation
>;
