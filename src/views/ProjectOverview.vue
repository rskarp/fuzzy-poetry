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
  <div class="overview">
    <h1 class="text-violet-500 text-2xl">Project Overview</h1>
    <p class="py-1">
      Fuzzy Poetry begins by selecting a few poems by modernist authors taking them from the website
      of the
      <a class="link" href="https://www.poetryfoundation.org/">Poetry Foundation</a>. Then, Python
      Natural Language Toolkit, or NLTK (a set of libraries and programs for symbolic and
      statistical natural language processing for English written in Python's programming language),
      is deployed to run through each poem and identify nouns, adjectives, adverbs, and verbs that
      are good candidates for replacement.
    </p>
    <p class="py-1">
      Substitute words are automatically chosen by the Datamuse Application Programming Interface or
      API, an engine that enables users to find words that reflect a set of specific constraints. In
      order to yield the best substitution, various restrictions on meaning, spelling, and sound can
      be placed on the engine. For Fuzzy Poetry, the replacement words are either synonyms (e.g.,
      beautiful replacing pretty), or words commonly used with the original (e.g., wildlife
      substituting conservation).
    </p>
    <p class="py-1">
      Combining all these substitutions creates several “variations” of the original poems. In order
      to train an AI to discard bad replacements and use/suggest more adequate ones, a large number
      of such “variations” are rated, using Labelbox, as either good, mediocre, or bad. A good
      replacement creates a unique and unexpected sentence; while being grammatically and
      semantically correct, mediocre substitutions are just run-of-the-mill speech. Bad replacements
      are either grammatically or semantically unfit for the given context. Here are some examples
      of good substitutions:
    </p>
    <ul class="indent-4 list-decimal list-inside">
      <li>
        A <span class="text-pink-400">slug</span> roaming across the fields (with the original word
        being <span class="text-pink-400">low</span>)
      </li>
      <li>
        And thee, across the <span class="text-pink-400">escort</span> (with the original being
        <span class="text-pink-400">harbor</span>)
      </li>
      <li>
        In the <span class="text-pink-400">wickedness</span> of the day (with the original being
        <span class="text-pink-400">darkness</span>)
      </li>
      <li>
        I am <span class="text-pink-400">demolished</span> (with the original being
        <span class="text-pink-400">old</span>)
      </li>
      <li>
        That was near your <span class="text-pink-400">blood</span> (with the original being
        <span class="text-pink-400">heart</span>)
      </li>
      <li>
        It was in <span class="text-pink-400">ill</span> time (with the original being
        <span class="text-pink-400">Bad</span>)
      </li>
      <li>
        The <span class="text-pink-400">skeletons</span> of the sea (with the original being
        <span class="text-pink-400">Coral</span>)
      </li>
      <li>
        Gin the <span class="text-pink-400">ladyship</span> (with the original being
        <span class="text-pink-400">goodwife</span>)
      </li>
      <li>
        Before the <span class="text-pink-400">daylight</span> (with the original being
        <span class="text-pink-400">clocks</span>)
      </li>
      <li>
        The reflection of your <span class="text-pink-400">ghost</span> (with the original being
        <span class="text-pink-400">shadow</span>)
      </li>
    </ul>
    <p class="py-1">
      The data collected from Labelbox is then used to fine-tune the AI code. At this stage, three
      different lines of research were attempted. The first attempt consisted of sending
      <a class="link" href="https://openai.com/">OPEN AI</a>, an American artificial intelligence
      research laboratory and owner of chatgpt, the original poems with the labeled poems. Then,
      using chatgpt 3, OPEN AI updates our code and sends back the newer version, which ideally
      produces more of the word replacement labeled as good and less of the substitutions we labeled
      as bad.
    </p>
    <p class="py-1">
      The second attempt involves training the AI ourselves, meaning that instead of sending the old
      version of the code and the labeled poems to OPEN AI, a custom Python code that trains our AI
      will be created. The method is beneficial because there will be more control over the code.
      Two drawbacks are that it requires more labor leading to having to write the code, and an
      older version of chatgpt (chatgpt 2) would have to be used as chatgpt 3 is not public yet, and
      only people from OPEN AI can access it.
    </p>
    <p class="py-1">
      The third attempt consists of combining multiple versions of the same poem to make the best
      variation. This method involves taking the original version of the poem and generating
      numerous variations with different word replacements. This will require finding and labeling
      the best replacement for all the variations. Lastly, a code combining the variations into one
      poem will be produced, utilizing only the lines labeled as the best among the variations.
    </p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .overview {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
