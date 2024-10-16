import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from '@aws-amplify/datastore'
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from '@aws-amplify/datastore'

export enum ReplacementType {
  MEANS_LIKE = 'MEANS_LIKE',
  TRIGGERED_BY = 'TRIGGERED_BY',
  ANAGRAM = 'ANAGRAM',
  SPELLED_LIKE = 'SPELLED_LIKE',
  CONSONANT_MATCH = 'CONSONANT_MATCH',
  HOMOPHONE = 'HOMOPHONE'
}

type EagerPoemVariation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PoemVariation, 'id'>
    readOnlyFields: 'createdAt' | 'updatedAt'
  }
  readonly id: string
  readonly original_text?: string | null
  readonly variation_text?: string | null
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
}

type LazyPoemVariation = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PoemVariation, 'id'>
    readOnlyFields: 'createdAt' | 'updatedAt'
  }
  readonly id: string
  readonly original_text?: string | null
  readonly variation_text?: string | null
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
}

export declare type PoemVariation = LazyLoading extends LazyLoadingDisabled
  ? EagerPoemVariation
  : LazyPoemVariation

export declare const PoemVariation: (new (init: ModelInit<PoemVariation>) => PoemVariation) & {
  copyOf(
    source: PoemVariation,
    mutator: (draft: MutableModel<PoemVariation>) => MutableModel<PoemVariation> | void
  ): PoemVariation
}
