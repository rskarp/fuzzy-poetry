/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePoemVariationInput = {
  id?: string | null,
  original_text?: string | null,
  variation_text?: string | null,
  _version?: number | null,
};

export type ModelPoemVariationConditionInput = {
  original_text?: ModelStringInput | null,
  variation_text?: ModelStringInput | null,
  and?: Array< ModelPoemVariationConditionInput | null > | null,
  or?: Array< ModelPoemVariationConditionInput | null > | null,
  not?: ModelPoemVariationConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type PoemVariation = {
  __typename: "PoemVariation",
  id: string,
  original_text?: string | null,
  variation_text?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdatePoemVariationInput = {
  id: string,
  original_text?: string | null,
  variation_text?: string | null,
  _version?: number | null,
};

export type DeletePoemVariationInput = {
  id: string,
  _version?: number | null,
};

export enum ReplacementType {
  MEANS_LIKE = "MEANS_LIKE",
  TRIGGERED_BY = "TRIGGERED_BY",
}


export type ModelPoemVariationFilterInput = {
  id?: ModelIDInput | null,
  original_text?: ModelStringInput | null,
  variation_text?: ModelStringInput | null,
  and?: Array< ModelPoemVariationFilterInput | null > | null,
  or?: Array< ModelPoemVariationFilterInput | null > | null,
  not?: ModelPoemVariationFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelPoemVariationConnection = {
  __typename: "ModelPoemVariationConnection",
  items:  Array<PoemVariation | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelSubscriptionPoemVariationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  original_text?: ModelSubscriptionStringInput | null,
  variation_text?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPoemVariationFilterInput | null > | null,
  or?: Array< ModelSubscriptionPoemVariationFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreatePoemVariationMutationVariables = {
  input: CreatePoemVariationInput,
  condition?: ModelPoemVariationConditionInput | null,
};

export type CreatePoemVariationMutation = {
  createPoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdatePoemVariationMutationVariables = {
  input: UpdatePoemVariationInput,
  condition?: ModelPoemVariationConditionInput | null,
};

export type UpdatePoemVariationMutation = {
  updatePoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeletePoemVariationMutationVariables = {
  input: DeletePoemVariationInput,
  condition?: ModelPoemVariationConditionInput | null,
};

export type DeletePoemVariationMutation = {
  deletePoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type GeneratePoemVariationMutationVariables = {
  originalPoem?: string | null,
  replacementTypes?: Array< ReplacementType | null > | null,
};

export type GeneratePoemVariationMutation = {
  generatePoemVariation?: string | null,
};

export type GetPoemVariationQueryVariables = {
  id: string,
};

export type GetPoemVariationQuery = {
  getPoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListPoemVariationsQueryVariables = {
  filter?: ModelPoemVariationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPoemVariationsQuery = {
  listPoemVariations?:  {
    __typename: "ModelPoemVariationConnection",
    items:  Array< {
      __typename: "PoemVariation",
      id: string,
      original_text?: string | null,
      variation_text?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncPoemVariationsQueryVariables = {
  filter?: ModelPoemVariationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPoemVariationsQuery = {
  syncPoemVariations?:  {
    __typename: "ModelPoemVariationConnection",
    items:  Array< {
      __typename: "PoemVariation",
      id: string,
      original_text?: string | null,
      variation_text?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreatePoemVariationSubscriptionVariables = {
  filter?: ModelSubscriptionPoemVariationFilterInput | null,
};

export type OnCreatePoemVariationSubscription = {
  onCreatePoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdatePoemVariationSubscriptionVariables = {
  filter?: ModelSubscriptionPoemVariationFilterInput | null,
};

export type OnUpdatePoemVariationSubscription = {
  onUpdatePoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeletePoemVariationSubscriptionVariables = {
  filter?: ModelSubscriptionPoemVariationFilterInput | null,
};

export type OnDeletePoemVariationSubscription = {
  onDeletePoemVariation?:  {
    __typename: "PoemVariation",
    id: string,
    original_text?: string | null,
    variation_text?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
