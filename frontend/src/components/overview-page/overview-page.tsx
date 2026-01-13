const OverviewPage = () => {
  return (
  <div>
    <h1 className="text-violet-500 text-2xl">Project Overview</h1>
    <p className="py-1">
      Using Fuzzy Poetry begins by selecting a few poems written by modernist authors, taking them
      from the website of the <a className="link" href="https://www.poetryfoundation.org/">Poetry Foundation</a>. Then, Python's
      Natural Language Toolkit (NLTK) is used for tokenization and part-of-speech (POS) tagging.
      Essentially, we use it to analyze each poem and identify all "content words" (nouns,
      adjectives, adverbs, and verbs) as they are considered good candidates for replacement.
    </p>
    <p className="py-1">
      Once the content words are identified, replacement words are chosen using the <a className="link" href="https://www.datamuse.com/api/">Datamuse API</a>: a tool that enables
      users to find words that follow a set of specified constraints. These contraints are provided
      as query parmeters and can be used to place various restrictions on meaning, spelling, and
      sound of the words returned in the response. For the first iteration of Fuzzy Poetry, the
      replacement words were either similar meaning words or phrases (e.g., beautiful replacing
      pretty), or words commonly used with the original given word (e.g., wildlife substituting
      conservation).
    </p>
    <p className="py-1">
      Replacing each content word with a different related word results in an entirely new variation
      of the original poem. Repeating this process, randomly choosing a replacement candidate from
      the response of the Datamuse API each time, creates several “variations” of the original
      poems. This is how poems in Version 1 of our pipeline are created. For subsequent versions, we
      introduced the use of AI in our poem generation pipeline. The quality of the poems created
      using the previous steps was classified by human labelers, creating a dataset used to
      fine-tune various large language models for our poetry-specific task. The labeling was done
      using <a className="link" href="https://labelbox.com/">Labelbox</a>, and lines were classified as
      good, mediocre, or bad. A good replacement creates a unique and unexpected sentence, while
      being grammatically and semantically correct; mediocre substitutions are just run-of-the-mill
      speech; and bad replacements are either grammatically or semantically unfit for the given
      context. Here are some examples of good substitutions:
    </p>
    <ul className="indent-4 list-decimal list-inside">
      <li>
        A <span className="text-secondary">slug</span> roaming across the fields (with the original word
        being <span className="text-secondary">low</span>)
      </li>
      <li>
        And thee, across the <span className="text-secondary">escort</span> (with the original being <span className="text-secondary">harbor</span>)
      </li>
      <li>
        In the <span className="text-secondary">wickedness</span> of the day (with the original being <span className="text-secondary">darkness</span>)
      </li>
      <li>
        I am <span className="text-secondary">demolished</span> (with the original being <span className="text-secondary">old</span>)
      </li>
      <li>
        That was near your <span className="text-secondary">blood</span> (with the original being <span className="text-secondary">heart</span>)
      </li>
      <li>
        It was in <span className="text-secondary">ill</span> time (with the original being <span className="text-secondary">Bad</span>)
      </li>
      <li>
        The <span className="text-secondary">skeletons</span> of the sea (with the original being <span className="text-secondary">Coral</span>)
      </li>
      <li>
        Gin the <span className="text-secondary">ladyship</span> (with the original being <span className="text-secondary">goodwife</span>)
      </li>
      <li>
        Before the <span className="text-secondary">daylight</span> (with the original being <span className="text-secondary">clocks</span>)
      </li>
      <li>
        The reflection of your <span className="text-secondary">ghost</span> (with the original being <span className="text-secondary">shadow</span>)
      </li>
    </ul>
    <p className="py-1">
      The dataset labeled in Labelbox was used to fine-tune <a className="link" href="https://openai.com/">OpenAI's</a> GPT-3 curie model. Our first attempt
      at fine-tuning was treated as a text generation problem. We used the poetry lines labeled as
      good in our training set with the original line being the input and the new "good" line being
      the output. The goal was that given an original line of a poem, the fine-tuned GPT-3 model
      would produce a new, but similar good line of poetry. However, the results varied greatly
      depending on the length of the original line, and often produced longer, sentence-like results
      rather than poetry.
    </p>
    <p className="py-1">
      The second attempt at fine-tuning GPT-3 was treated as a classification problem. We wanted to
      maintain some structure that we got from directly replacing words in the poem, while making
      use of the large amount of knowledge that LLMs have. We used all classes of our labeled data
      as training samples, where the input included the original line and the generated variation,
      and the output was the label good, mediocre, or bad. The goal for this attempt was that given
      an original line of poetry and a generated one, the fine-tuned model would classify the new
      line as good, mediocre, or bad. This classifier model is used as one step in our Version 2
      poem generation pipeline.
    </p>
    <p className="py-1">
      The initial word replacement steps are combined with our GPT-3 model fine-tuned for
      classification into a single poem generation pipeline. In this Version 2 of our pipeline,
      first, multiple variations are generated from the original poem by replacing all content words
      with related words using various replacement types. For now, these replacement types include
      similar meaning words and phrases, words commonly used with the given word, anagrams,
      similarly spelled words, consonant matching words, and homophones. After creating these
      variations, each new line is classified using our fine-tuned model. For each line in the
      original poem, one of the corresponding generated good lines is used in the final poem. This
      results in the final output being a combination of the best generated line variations collated
      into one final new poem.
    </p>
  </div>);
};

export default OverviewPage;