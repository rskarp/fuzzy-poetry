<script lang="ts">
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <div class="about">
    <h1 class="text-violet-500">
      <ul>
        <li>TODO:</li>
        <li>Project Overview</li>
        <li>Context</li>
        <li>People</li>
      </ul>
    </h1>
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
