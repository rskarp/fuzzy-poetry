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
    <h1>
      This is an about page. Put more text here describing the project and its contributors etc.
    </h1>
    <button class="btn" @click="callApi">Test API</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>
