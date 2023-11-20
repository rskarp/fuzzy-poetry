<script lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations'
import { type GraphQLQuery } from '@aws-amplify/api'
import { ReplacementType, type GeneratePoemVariationMutation } from '../API'

export default {
  components: {
    WelcomeItem,
    DocumentationIcon
  },
  data() {
    return {
      text: '',
      variation: [''],
      loading: false,
      replacement: {
        ml: true,
        rel_trg: false,
        ana: false,
        sp: false,
        rel_cns: false,
        rel_hom: false
      }
    }
  },
  methods: {
    callApi(event: MouseEvent) {
      this.loading = true
      this.variation = []
      if (!Object.values(this.replacement).some((r) => r)) {
        this.replacement.ml = true
      }
      const replacementTypes = [
        ...(this.replacement.ml ? [ReplacementType.MEANS_LIKE] : []),
        ...(this.replacement.rel_trg ? [ReplacementType.TRIGGERED_BY] : []),
        ...(this.replacement.ana ? [ReplacementType.ANAGRAM] : []),
        ...(this.replacement.sp ? [ReplacementType.SPELLED_LIKE] : []),
        ...(this.replacement.rel_cns ? [ReplacementType.CONSONANT_MATCH] : []),
        ...(this.replacement.rel_hom ? [ReplacementType.HOMOPHONE] : [])
      ]
      API.graphql<GraphQLQuery<GeneratePoemVariationMutation>>({
        query: mutations.generatePoemVariation,
        variables: { originalPoem: this.text, replacementTypes }
      })
        .then((result) => {
          this.variation = this.generateWordsList(result.data?.generatePoemVariation ?? '')
        })
        .catch((result) => {
          this.variation = [`An error occurred. ${result.errors?.at(0)?.message}`]
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
  <WelcomeItem>
    <template #heading><span class="text-violet-500 text-2xl">Enter Poem Text</span></template>

    <textarea
      class="textarea textarea-bordered textarea-lg w-full"
      placeholder="Enter text here..."
      v-model="text"
    ></textarea>
  </WelcomeItem>
  <div
    class="form-control w-full flex flex-row flex-wrap items-center justify-self-center justify-center content-center"
  >
    <span class="text-violet-500">REPLACE WITH: </span>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Synonyms</span>
      <input type="checkbox" v-model="replacement.ml" class="checkbox checkbox-primary" />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Related Words</span>
      <input type="checkbox" v-model="replacement.rel_trg" class="checkbox checkbox-primary" />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Anagrams</span>
      <input type="checkbox" v-model="replacement.ana" class="checkbox checkbox-primary" />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Similarly Spelled Words</span>
      <input type="checkbox" v-model="replacement.sp" class="checkbox checkbox-primary" />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Consonant Match</span>
      <input type="checkbox" v-model="replacement.rel_cns" class="checkbox checkbox-primary" />
    </label>
    <label class="cursor-pointer label">
      <span class="label-text p-1">Homophones</span>
      <input type="checkbox" v-model="replacement.rel_hom" class="checkbox checkbox-primary" />
    </label>
  </div>
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
  <WelcomeItem>
    <template #heading><span class="text-violet-500 text-2xl">Generated Variation</span></template>
    <template v-for="(word, idx) in variation" :item="word" :index="idx">
      <span
        v-if="isReplacedWord(word)"
        class="underline text-green-400 tooltip tooltip-success"
        :data-tip="getOriginalWord(word)"
      >
        {{ `${word.split('[#ORIGINAL_')[0]}` }}
      </span>
      <span v-else class="no-underline">{{ word }}</span>
      {{ ' ' }}
    </template>
  </WelcomeItem>
  <!-- 
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Vue’s
    <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a>
    provides you with all information you need to get started.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a href="https://vitejs.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>. The
    recommended IDE setup is
    <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VSCode</a> +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank" rel="noopener">Volar</a>. If
    you need to test your components and web pages, check out
    <a href="https://www.cypress.io/" target="_blank" rel="noopener">Cypress</a> and
    <a href="https://on.cypress.io/component" target="_blank">Cypress Component Testing</a>.

    <br />

    More instructions are available in <code>README.md</code>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>

    Get official tools and libraries for your project:
    <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>,
    <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router</a>,
    <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener">Vue Test Utils</a>, and
    <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener">Vue Dev Tools</a>. If
    you need more resources, we suggest paying
    <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">Awesome Vue</a>
    a visit.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a>, our official
    Discord server, or
    <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener"
      >StackOverflow</a
    >. You should also subscribe to
    <a href="https://news.vuejs.org" target="_blank" rel="noopener">our mailing list</a> and follow
    the official
    <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">@vuejs</a>
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help
    us by
    <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">becoming a sponsor</a>.
  </WelcomeItem> -->
</template>
