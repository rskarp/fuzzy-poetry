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
      const test = await API.get('fuzzyPoetryApi','/poem-variation',{})
    // `this` inside methods points to the current active instance
    // alert(`Hello ${this.greeting}!`)
    // `event` is the native DOM event
    // if (test) {
      alert(JSON.stringify(test))
    // }
  }
  }
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="callApi">Test API</button>
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
