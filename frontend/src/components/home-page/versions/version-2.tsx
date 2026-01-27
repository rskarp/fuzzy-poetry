import Version from '../version';
import { useState, Fragment } from 'react';
import {
  useGeneratePoemV2GeneratePoemV2Post,
  type PoemResponse,
  type PoemV2CreateRequest,
} from '../../../api';

type Replacement = {
  ml: number;
  rel_trg: number;
  ana: number;
  sp: number;
  rel_cns: number;
  rel_hom: number;
};

const Version2 = () => {
  const [text, setText] = useState('');
  const [tooManyVars, setTooManyVars] = useState(false);
  const [replacement, setReplacement] = useState<Replacement>({
    ml: 1,
    rel_trg: 0,
    ana: 0,
    sp: 0,
    rel_cns: 0,
    rel_hom: 0,
  });

  const updateReplacement = (key: keyof Replacement, value: number) => {
    setReplacement((prev) => ({ ...prev, [key]: value }));
  };

  const [poem, setPoem] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { mutate } = useGeneratePoemV2GeneratePoemV2Post();

  const callApi = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setLoading(true);
    setPoem([]);

    const values = Object.values(replacement);
    const total = values.reduce((a, b) => a + b, 0);

    // If all zeros, default synonyms to 1
    if (!values.some((r) => r)) {
      setReplacement((prev) => ({ ...prev, ml: 1 }));
    } else if (total > 60) {
      setTooManyVars(true);
      setLoading(false);
      return;
    }

    const body: PoemV2CreateRequest = {
      inputPoem: text,
      replacementTypeCounts: {
        means_like: replacement.ml,
        triggered_by: replacement.rel_trg,
        anagram: replacement.ana,
        spelled_like: replacement.sp,
        consonant_match: replacement.rel_cns,
        homophone: replacement.rel_hom,
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
    <Version versionName="Version 2">
      <div>
        <p>
          This version generates a poem variation by creating many variations
          using the Version 1 algorithm, then choosing the best version of each
          line to include in the final variation. The best variation is
          determined by using a fine-tuned version of GPT-3.
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
          <span className="text-violet-500">
            # VARIATIONS PER REPLACEMENT TYPE:{' '}
          </span>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Synonyms</span>
            <input
              type="number"
              value={replacement.ml}
              onChange={(e) => updateReplacement('ml', Number(e.target.value))}
              className="input focus:outline-primary input-bordered input-xs w-12"
              min={0}
              max={10}
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Related Words</span>
            <input
              type="number"
              value={replacement.rel_trg}
              onChange={(e) =>
                updateReplacement('rel_trg', Number(e.target.value))
              }
              className="input focus:outline-primary input-bordered input-xs w-12"
              min={0}
              max={10}
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Anagrams</span>
            <input
              type="number"
              value={replacement.ana}
              onChange={(e) => updateReplacement('ana', Number(e.target.value))}
              className="input focus:outline-primary input-bordered input-xs w-12"
              min={0}
              max={10}
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Similarly Spelled Words</span>
            <input
              type="number"
              value={replacement.sp}
              onChange={(e) => updateReplacement('sp', Number(e.target.value))}
              className="input focus:outline-primary input-bordered input-xs w-12"
              min={0}
              max={10}
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Consonant Match</span>
            <input
              type="number"
              value={replacement.rel_cns}
              onChange={(e) =>
                updateReplacement('rel_cns', Number(e.target.value))
              }
              className="input focus:outline-primary input-bordered input-xs w-12"
              min={0}
              max={10}
            />
          </label>

          <label className="cursor-pointer label">
            <span className="label-text p-1">Homophones</span>
            <input
              type="number"
              value={replacement.rel_hom}
              onChange={(e) =>
                updateReplacement('rel_hom', Number(e.target.value))
              }
              className="input focus:outline-primary input-bordered input-xs w-12"
              min={0}
              max={10}
            />
          </label>
        </div>

        {tooManyVars && (
          <span className="p-1 w-full flex justify-center text-red-500">
            The total number of variations cannot exceed 60.
          </span>
        )}
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

export default Version2;
