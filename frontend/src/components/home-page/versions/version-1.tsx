import Version from '../version';
import { useState, Fragment } from 'react';
import {
  useGeneratePoemV1GeneratePoemV1Post,
  type PoemResponse,
  type PoemV1CreateRequest,
} from '../../../api';

type Replacement = {
  ml: boolean;
  rel_trg: boolean;
  ana: boolean;
  sp: boolean;
  rel_cns: boolean;
  rel_hom: boolean;
};

const Version1 = () => {
  const [poem, setPoem] = useState<string[]>([]);

  const { mutate } = useGeneratePoemV1GeneratePoemV1Post();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [replacement, setReplacement] = useState<Replacement>({
    ml: true,
    rel_trg: false,
    ana: false,
    sp: false,
    rel_cns: false,
    rel_hom: false,
  });

  const toggleReplacement = (key: keyof Replacement, value: boolean) =>
    setReplacement((prev) => ({ ...prev, [key]: value }));

  const callApi = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setLoading(true);
    setPoem([]);

    const values = Object.values(replacement);

    // If all zeros, default synonyms to 1
    if (!values.some((r) => r)) {
      setReplacement((prev) => ({ ...prev, ml: true }));
    }

    const body: PoemV1CreateRequest = {
      inputPoem: text,
      replacementTypeCounts: {
        means_like: replacement.ml ? 1 : 0,
        triggered_by: replacement.rel_trg ? 1 : 0,
        anagram: replacement.ana ? 1 : 0,
        spelled_like: replacement.sp ? 1 : 0,
        consonant_match: replacement.rel_cns ? 1 : 0,
        homophone: replacement.rel_hom ? 1 : 0,
      },
    };
    mutate(
      { data: body },
      {
        onSuccess: (response: PoemResponse) => {
          console.debug('API response:', response);
          setPoem(generateWordsList(response.poem_content));
        },
        onError: (error: any) => {
          console.error('API error:', error);
          setPoem([
            'An error occurred. Please try again or contact us if the error persists.',
          ]);
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const generateWordsList = (poemVariation?: string): string[] => {
    return poemVariation ? poemVariation.split(/\s+/) : [];
  };

  const isReplacedWord = (word: string): boolean => {
    // Use a non-global regex (no /g) to avoid lastIndex side-effects when reusing the regex.
    // Matches tokens like "foo[#ORIGINAL_bar]" (word followed by [#ORIGINAL_...])
    const regex = /[^\s\[]+\[#ORIGINAL_([^\]]+)\]/u;
    return regex.test(word);
  };

  const getOriginalWord = (word: string): string | undefined => {
    // Capture the original word placed inside the [#ORIGINAL_...] token.
    // Use a non-greedy capture to be robust if there are multiple tokens in a string.
    const regex = /\[#ORIGINAL_([^\]]+)\]/u;

    const match = word.match(regex);
    return match?.[1];
  };

  return (
    <Version versionName="Version 1">
      <div>
        <p>
          This version generates a poem variation by finding one replcement for
          each "content word" (noun, verb, adjective, or adverb) in the given
          poem text.
        </p>
        <div>
          <span className="text-violet-500 text-2xl">Enter Poem Text</span>
        </div>

        <textarea
          className="textarea textarea-bordered textarea-lg w-full"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="form-control w-full flex flex-row flex-wrap items-center justify-self-center justify-center content-center">
          <span className="text-violet-500">REPLACE WITH: </span>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Synonyms</span>
            <input
              type="checkbox"
              checked={replacement.ml}
              onChange={(e) => toggleReplacement('ml', e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Related Words</span>
            <input
              type="checkbox"
              checked={replacement.rel_trg}
              onChange={(e) => toggleReplacement('rel_trg', e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Anagrams</span>
            <input
              type="checkbox"
              checked={replacement.ana}
              onChange={(e) => toggleReplacement('ana', e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Similarly Spelled Words</span>
            <input
              type="checkbox"
              checked={replacement.sp}
              onChange={(e) => toggleReplacement('sp', e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Consonant Match</span>
            <input
              type="checkbox"
              checked={replacement.rel_cns}
              onChange={(e) => toggleReplacement('rel_cns', e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Homophones</span>
            <input
              type="checkbox"
              checked={replacement.rel_hom}
              onChange={(e) => toggleReplacement('rel_hom', e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
        <div className="w-full flex flex-row justify-center mb-6">
          {!loading ? (
            <button
              className="btn bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-150 ease-in-out disabled:bg-gray-400"
              onClick={callApi}
            >
              Generate Variation
            </button>
          ) : (
            <button
              className="btn btn-disabled bg-violet-500 text-white flex items-center py-2 px-6 rounded-full shadow-lg"
              disabled
            >
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </button>
          )}
        </div>
        {poem && (
          <div>
            {poem.map((word, idx) => (
              <Fragment key={idx}>
                {isReplacedWord(word) ? (
                  <span
                    className="underline text-green-400 tooltip tooltip-success"
                    // preserve the original behavior of using data-tip for tooltip libraries like DaisyUI / Tippy
                    data-tip={getOriginalWord(word)}
                  >
                    {word.split('[#ORIGINAL_')[0]}
                  </span>
                ) : word === '<br/>' ? (
                  // preserve explicit <br/> tokens
                  <br />
                ) : (
                  <span className="no-underline">{word}</span>
                )}{' '}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </Version>
  );
};

export default Version1;
