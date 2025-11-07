<script lang="ts">
import VersionItem from './VersionItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import { type GraphQLQuery } from '@aws-amplify/api'
import { type ReplacementTypeCounts, type GenerateMultimodalVariationMutation } from '../API'

export default {
  components: {
    VersionItem,
    DocumentationIcon
  },
  data() {
    return {
      text: '',
      inputType: 'url', // 'text', 'url', or 'image'
      imageFile: null as File | null,
      model: '',
      passImageToModel: false,
      modelOptions: [
        { label: 'Deepseek R1', value: 'deepseek-r1' },
        { label: 'Claude Opus 4.1', value: 'claude-opus-4_1' },
        { label: 'Claude Opus 4', value: 'claude-opus-4' },
        { label: 'Claude Sonnet 4', value: 'claude-sonnet-4' },
        { label: 'GPT 4.1 Nano', value: 'gpt-4.1-nano' }
      ],
      numRelatedImages: 3,
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
    onImageChange(e: Event) {
      const target = e.target as HTMLInputElement | null;
      this.imageFile = target && target.files ? target.files[0] : null;
    },
    callApi(event: MouseEvent) {
      let inputValue = this.text;
      // if (this.inputType === 'image' && this.imageFile) {
      //   upload image
      //   this.loading = false;
      //   return;
      // }
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
      API.graphql<GraphQLQuery<GenerateMultimodalVariationMutation>>({
        query: mutations.generateMultimodalVariation,
        variables: { inputImageUrl: inputValue, replacementTypeCounts: replacementTypeCounts, model: this.model, numRelatedImages: this.numRelatedImages, passImageToModel: this.passImageToModel }
      })
        .then((result) => {
          let resultString = result.data?.generateMultimodalVariation ?? ''
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
    <template #heading>
      <span class="text-violet-500 text-2xl">Image Input</span>
    </template>
    <div class="flex flex-row gap-4 mb-2">
      <label class="cursor-pointer">
        <input type="radio" value="url" v-model="inputType" /> URL
      </label>
      <label class="cursor-pointer">
        <input type="radio" value="image" v-model="inputType" /> Image Upload
      </label>
    </div>
    <div v-if="inputType === 'url'">
  <span>For example, try: <a class="link" href="https://live.staticflickr.com/65535/54638556216_146f8ac2b6_k.jpg">https://live.staticflickr.com/65535/54638556216_146f8ac2b6_k.jpg</a></span>
      <input
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="Enter image URL here..."
        v-model="text"
      />
    </div>
    <div v-else-if="inputType === 'image'">
      <input
        type="file"
        accept="image/*"
        class="file-input file-input-bordered file-input-sm w-full"
        @change="onImageChange"
      />
      <span class="text-violet-500">Select an image to upload.</span>
    </div>
  </VersionItem>
  <details class="w-full mb-2" style="padding-left:0;">
    <summary class="cursor-pointer text-violet-500 font-medium flex items-center gap-2" style="list-style: none; padding-left:0;">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <!-- right-pointing chevron -->
        <path fill-rule="evenodd" d="M7.21 14.78a.75.75 0 010-1.06L10.94 9 7.21 5.28a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06L8.27 14.78a.75.75 0 01-1.06 0z" clip-rule="evenodd" />
      </svg>
      <span>Advanced Image Settings</span>
    </summary>
    <div
      class="form-control w-full flex flex-row flex-wrap items-center justify-self-center justify-center content-center mt-1"
    >
      <span class="text-violet-500">Settings: </span>
      <label class="cursor-pointer label">
        <span class="label-text p-1"># Related Images from Dataset</span>
        <input
          type="number"
          v-model="numRelatedImages"
          class="input focus:outline-primary input-bordered input-xs w-12"
          min="1"
          max="10"
        />
      </label>
      <label class="cursor-pointer label">
        <span class="label-text p-1">Model</span>
        <select
          v-model="model"
          class="select select-bordered select-xs w-32 focus:outline-primary"
        >
          <option disabled value="">Select model</option>
          <option v-for="option in modelOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <label class="cursor-pointer label">
        <span class="label-text p-1">Include Image in Submission to LLM</span>
        <input type="checkbox" v-model="passImageToModel" class="checkbox checkbox-primary" />
      </label>
    </div>
  </details>
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

<style scoped>
details summary svg {
  transform: rotate(0deg);
  transition: transform 150ms ease-in-out;
}
details[open] summary svg {
  transform: rotate(90deg);
}
summary {
  list-style: none;
}
</style>
