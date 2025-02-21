<script setup lang="ts">
import AlgorithmVersion1 from '../components/AlgorithmVersion1.vue'
import AlgorithmVersion2 from '../components/AlgorithmVersion2.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <h1 class="text-violet-500 text-2xl">Try it out: Select an algorithm version to generate a poem.</h1>
    <div class="flex flex-col space-y-2 my-8">
      <div class="collapse group bg-base-200 rounded-md shadow-lg">
        <input type="checkbox" class="peer" />
        <div
          class="collapse-title text-xl text-primary-content group-hover:bg-primary peer-checked:bg-primary peer-checked:text-secondary-content"
        >
          Version 1
        </div>
        <div class="collapse-content text-primary-content peer-checked:text-secondary-content">
          <p class="p-1">
            This version generates a poem variation by finding one replcement for each "content
            word" (noun, verb, adjective, or adverb) in the given poem text.
          </p>
          <AlgorithmVersion1 />
        </div>
      </div>

      <div class="collapse group bg-base-200 rounded-md shadow-lg">
        <input type="checkbox" class="peer" />
        <div
          class="collapse-title text-xl text-primary-content group-hover:bg-primary peer-checked:bg-primary peer-checked:text-secondary-content"
        >
          Version 2
        </div>
        <div class="collapse-content text-primary-content peer-checked:text-secondary-content">
          <p class="p-1">
            This version generates a poem variation by creating many variations using the Version 1
            algorithm, then choosing the best version of each line to include in the final
            variation.
          </p>
          <AlgorithmVersion2 />
        </div>
      </div>
    </div>

    <div class="bg-base-200 flex flex-row space-x-6 text-center items-center p-8 my-2 rounded-md shadow-lg">
      <h1 class="text-violet-500 text-2xl w-1/2">
        Welcome to Fuzzy Poetry, an application that employs generative AI to help you write poetry. Take an existing <a class="link" href="https://www.poetryfoundation.org/">text</a>, run it through our application, get it back reimagined, and <a class="link" href="https://glia.ca/rerites/">carve</a> out an "original" poem. At the bottom of the text box, pick how many and what kind of variations of the input you want to generate. You can use synonyms, anagrams, homophones, or words that are related to, spelled similarly to, or match the consonants of the starting text. These variations will then be distilled into a "new" version, ready to be carved. For more details, see our <RouterLink to="/overview">About Page</RouterLink>.
      </h1>
      <iframe src="https://drive.google.com/file/d/15hxEcmaMWM0WntGliI_-aB81pGNBCmwE/preview" class="rounded-lg shadow-lg" width="50%" height="480" allow="autoplay" allowfullscreen></iframe>
    </div>
  </main>
</template>