<script setup lang="ts">
import type AlgorithmVersion1Vue from '@/components/AlgorithmVersion1.vue'
import AlgorithmVersion1 from '../components/AlgorithmVersion1.vue'
import AlgorithmVersion2 from '../components/AlgorithmVersion2.vue'
</script>

<template>
  <main>
    <h1 class="text-violet-500 text-2xl">Select an algorithm version to generate a poem.</h1>
    <div class="flex flex-col space-y-1">
      <div class="collapse bg-base-200">
        <input type="checkbox" class="peer" />
        <div
          class="collapse-title text-primary-content peer-checked:bg-primary peer-checked:text-secondary-content"
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

      <div class="collapse bg-base-200">
        <input type="checkbox" class="peer" />
        <div
          class="collapse-title text-primary-content peer-checked:bg-primary peer-checked:text-secondary-content"
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
  </main>
</template>
