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
    <h1>
      This is an about page. Put more text here describing the project and its contributors etc.
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
