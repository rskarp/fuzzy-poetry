/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPoemVariation = /* GraphQL */ `
  mutation CreatePoemVariation(
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
    }
  }
`;
export const updatePoemVariation = /* GraphQL */ `
  mutation UpdatePoemVariation(
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
    }
  }
`;
export const deletePoemVariation = /* GraphQL */ `
  mutation DeletePoemVariation(
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
    }
  }
`;
export const generatePoemVariation = /* GraphQL */ `
  mutation GeneratePoemVariation(
    $originalPoem: String
    $replacementTypes: [ReplacementType]
  ) {
    generatePoemVariation(
      originalPoem: $originalPoem
      replacementTypes: $replacementTypes
    )
  }
`;
export const generateCombinedVariation = /* GraphQL */ `
  mutation GenerateCombinedVariation(
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
`;
export const sendEmail = /* GraphQL */ `
  mutation SendEmail(
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
`;
