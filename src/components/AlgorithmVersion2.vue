<script lang="ts">
import VersionItem from './VersionItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import { type GraphQLQuery } from '@aws-amplify/api'
import { type ReplacementTypeCounts, type GenerateCombinedVariationMutation } from '../API'

export default {
  components: {
    VersionItem,
    DocumentationIcon
  },
  data() {
    return {
      text: '',
      variation: [''],
      loading: false,
      tooManyVars: false,
      replacement: {
        ml: 1,
        rel_trg: 0,
        ana: 0,
        sp: 0,
        rel_cns: 0,
        rel_hom: 0
      }
    }
  },
  methods: {
    callApi(event: MouseEvent) {
      this.tooManyVars = false
      this.loading = true
      this.variation = []
      if (!Object.values(this.replacement).some((r) => r)) {
        this.replacement.ml = 1
      } else if (Object.values(this.replacement).reduce((a, b) => a + b, 0) > 60) {
        this.tooManyVars = true
        this.loading = false
        return
      }
      const replacementTypeCounts: ReplacementTypeCounts = {
        means_like: this.replacement.ml,
        triggered_by: this.replacement.rel_trg,
        anagram: this.replacement.ana,
        spelled_like: this.replacement.sp,
        consonant_match: this.replacement.rel_cns,
        homophone: this.replacement.rel_hom
      }
      API.graphql<GraphQLQuery<GenerateCombinedVariationMutation>>({
        query: mutations.generateCombinedVariation,
        variables: { originalPoem: this.text, replacementTypeCounts }
      })
        .then((result) => {
          let resultString = result.data?.generateCombinedVariation ?? ''
          resultString = resultString.replace(/\n/g, ' <br/> ')
          this.variation =
            resultString == ''
              ? ['A good variation was not created. Please try again.']
              : this.generateWordsList(resultString)
        })
        .catch((result) => {
          this.variation = [
            'An error occurred. Please try again or contact us if the error persists.'
          ]
          console.error(result.errors?.at(0)?.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    generateWordsList(poemVariation?: string) {
      const words = poemVariation?.split(/\s+/)
      return words ?? []
    },
    isReplacedWord(word: string) {
      const regex = /\b(\w+)\[#ORIGINAL_.+\]/g
      return regex.test(word)
    },
    getOriginalWord(word: string) {
      const regex = /\[#ORIGINAL_(.+)\]/
      const match = word.match(regex)
      return match && match.at(1) ? match.at(1) : undefined
    }
  }
}
</script>

<template>
  <VersionItem>
    <template #heading><span class="text-violet-500 text-2xl">Enter Poem Text</span></template>

    <textarea
      class="textarea textarea-bordered textarea-lg w-full"
      placeholder="Enter text here..."
      v-model="text"
    ></textarea>
  </VersionItem>
  <div
    class="form-control w-full flex flex-row flex-wrap items-center justify-self-center justify-center content-center"
  >
    <span class="text-violet-500"># VARIATIONS PER REPLACEMENT TYPE: </span>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Synonyms</span>
      <input
        type="number"
        v-model="replacement.ml"
        class="input focus:outline-primary input-bordered input-xs w-12"
        min="0"
        max="10"
      />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Related Words</span>
      <input
        type="number"
        v-model="replacement.rel_trg"
        class="input focus:outline-primary input-bordered input-xs w-12"
        min="0"
        max="10"
      />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Anagrams</span>
      <input
        type="number"
        v-model="replacement.ana"
        class="input focus:outline-primary input-bordered input-xs w-12"
        min="0"
        max="10"
      />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Similarly Spelled Words</span>
      <input
        type="number"
        v-model="replacement.sp"
        class="input focus:outline-primary input-bordered input-xs w-12"
        min="0"
        max="10"
      />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Consonant Match</span>
      <input
        type="number"
        v-model="replacement.rel_cns"
        class="input focus:outline-primary input-bordered input-xs w-12"
        min="0"
        max="10"
      />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Homophones</span>
      <input
        type="number"
        v-model="replacement.rel_hom"
        class="input focus:outline-primary input-bordered input-xs w-12"
        min="0"
        max="10"
      />
    </label>
  </div>

  <span v-if="tooManyVars" class="p-1 w-full flex justify-center text-red-500"
    >The total number of variations cannot exceed 60.</span
  >
  <div class="w-full flex flex-row justify-self-center justify-center content-center">
    <button v-if="!loading" class="btn btn-primary" @click="callApi">Generate Variation</button>
    <button v-else class="btn btn-disabled bg-primary text-white">
      <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Generating...
    </button>
  </div>
  <VersionItem>
    <template v-if="variation.length > 1" #heading
      ><span class="text-violet-500 text-2xl">Generated Variation</span></template
    >
    <template v-for="(word, idx) in variation" :item="word" :index="idx">
      <span
        v-if="isReplacedWord(word)"
        class="underline text-green-400 tooltip tooltip-success"
        :data-tip="getOriginalWord(word)"
      >
        {{ `${word.split('[#ORIGINAL_')[0]}` }}
      </span>
      <span v-else-if="word === '<br/>'">
        <br />
      </span>
      <span v-else class="no-underline">{{ word }}</span>
      {{ ' ' }}
    </template>
  </VersionItem>
</template>
