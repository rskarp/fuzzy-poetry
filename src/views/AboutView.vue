<script lang="ts">
import { API } from 'aws-amplify'
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  },
  methods: {
    async callApi(event: MouseEvent) {
      const test = await API.get('fuzzyPoetryApi', '/poem-variation', {})
      alert(JSON.stringify(test))
    }
  }
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button class="btn" @click="callApi">Test API</button>
    <div class="bg-white text-green-500 sm:bg-green md:bg-blue md:text-red lg:bg-red xl:bg-orange">
      Tailwind Test
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
