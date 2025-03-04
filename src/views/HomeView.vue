<script setup lang="ts">
import AlgorithmVersion1 from '../components/AlgorithmVersion1.vue'
import AlgorithmVersion2 from '../components/AlgorithmVersion2.vue'
import AlgorithmVersion3 from '../components/AlgorithmVersion3.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <div class="bg-base-200 flex flex-row space-x-6 text-center items-center p-8 my-2 rounded-md shadow-lg">
      <h1 class="text-violet-500 text-2xl w-1/2">
        Welcome to Fuzzy Poetry, an application that employs generative AI to help you write poetry. Take an existing <a class="link" href="https://www.poetryfoundation.org/">text</a>, run it through our application, get it back reimagined, and <a class="link" href="https://glia.ca/rerites/">carve</a> out an "original" poem. At the bottom of the text box, pick how many and what kind of variations of the input you want to generate. You can use synonyms, anagrams, homophones, or words that are related to, spelled similarly to, or match the consonants of the starting text. These variations will then be distilled into a "new" version, ready to be carved. For more details, see our <RouterLink to="/overview">About Page</RouterLink>.
      </h1>
      <iframe src="https://drive.google.com/file/d/15hxEcmaMWM0WntGliI_-aB81pGNBCmwE/preview" class="rounded-lg shadow-lg" width="50%" height="480" allow="autoplay" allowfullscreen></iframe>
    </div>
    
    <h1 class="text-violet-500 text-2xl">Try it out: Select an algorithm version to generate a poem.</h1>
    <div class="flex flex-col space-y-2 my-2">
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
            variation.  The best variation is determined by using a fine-tuned version of GPT-3.
          </p>
          <div role="alert" class="flex justify-start text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="mx-1">This version often produces an error message on the first try, but typically works as expected for subsequent tries.</span>
          </div>
          <AlgorithmVersion2 />
        </div>
      </div>

      <div class="collapse group bg-base-200 rounded-md shadow-lg">
        <input type="checkbox" class="peer" />
        <div
          class="collapse-title text-xl text-primary-content group-hover:bg-primary peer-checked:bg-primary peer-checked:text-secondary-content"
        >
          Version 3
        </div>
        <div class="collapse-content text-primary-content peer-checked:text-secondary-content">
          <p class="p-1">
            This version generates a poem variation by creating many variations using the Version 1
            algorithm, then choosing the best version of each line to include in the final
            variation. The best variation is determined by using a fine-tuned version of GPT-4o-mini.
          </p>
          <div role="alert" class="flex justify-start text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="mx-1">This version often produces an error message on the first try, but typically works as expected for subsequent tries.</span>
          </div>
          <AlgorithmVersion3 />
        </div>
      </div>
    </div>
  </main>
</template>