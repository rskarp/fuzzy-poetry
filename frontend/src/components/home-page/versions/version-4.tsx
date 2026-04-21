import { Link } from 'react-router';
import { Path } from '../../../router/path';
import Version from '../version';
import { useState, Fragment, type ChangeEvent } from 'react';
import {
  LLMName,
  useGeneratePoemV4GeneratePoemV4Post,
  useGenerateUploadUrlGenerateUploadUrlPost,
  type PoemResponse,
  type PoemV4CreateRequest,
  type UploadUrlRequest,
  type UploadUrlResponse,
} from '../../../api';
import FileDrop from '../../app/file-drop';

type ModelOption = { label: string; value: string };

const MODEL_LABELS: Record<(typeof LLMName)[keyof typeof LLMName], string> = {
  'deepseek-r1': 'Deepseek R1',
  'claude-opus-4_1': 'Claude Opus 4.1',
  'claude-opus-4': 'Claude Opus 4',
  'claude-sonnet-4': 'Claude Sonnet 4',
  'gpt-4.1-nano': 'GPT 4.1 Nano',
  'gpt-5.1': 'GPT 5.1',
  'gpt-5-mini': 'GPT 5 Mini',
};

/** build strongly-typed options from the LLMName const */
const llmValues = Object.values(
  LLMName,
) as (typeof LLMName)[keyof typeof LLMName][];
const modelOptions: ModelOption[] = llmValues.map((v) => ({
  label: MODEL_LABELS[v] ?? v,
  value: v,
}));

type Replacement = {
  ml: number;
  rel_trg: number;
  ana: number;
  sp: number;
  rel_cns: number;
  rel_hom: number;
};

type InputType = 'url' | 'image';

const Version4 = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [poem, setPoem] = useState<string[]>([]);
  const [tooManyVars, setTooManyVars] = useState(false);
  const [replacement, setReplacement] = useState<Replacement>({
    ml: 2,
    rel_trg: 0,
    ana: 0,
    sp: 0,
    rel_cns: 0,
    rel_hom: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<LLMName>(LLMName['gpt-5-mini']);
  const [passImageToModel, setPassImageToModel] = useState<boolean>(false);
  const [numRelatedImages, setNumRelatedImages] = useState<number>(3);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [inputType, setInputType] = useState<InputType>('url');
  const [file, setFile] = useState<File | null>(null);

  const { mutate } = useGeneratePoemV4GeneratePoemV4Post();
  const { mutate: mutateUploadUrl } =
    useGenerateUploadUrlGenerateUploadUrlPost();

  const updateReplacement = (key: keyof Replacement, value: number) => {
    setReplacement((prev) => ({ ...prev, [key]: value }));
  };

  const generateVariation = async (curImageUrl: string) => {
    console.log('generating poem');
    const body: PoemV4CreateRequest = {
      inputImageUrl: curImageUrl,
      replacementTypeCounts: {
        means_like: replacement.ml,
        triggered_by: replacement.rel_trg,
        anagram: replacement.ana,
        spelled_like: replacement.sp,
        consonant_match: replacement.rel_cns,
        homophone: replacement.rel_hom,
      },
      numRelatedImages: numRelatedImages,
      model: model,
      passImageToModel: passImageToModel,
    };
    mutate(
      { data: body },
      {
        onSuccess: (response: PoemResponse) => {
          console.log('API response:', response);
          setPoem(generateWordsList(response.poem_content));
        },
        onError: (error: any) => {
          console.error('API error:', error);
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

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

    if (file) {
      mutateUploadUrl(
        {
          data: {
            fileName: file?.name,
            fileType: file?.type,
          } as UploadUrlRequest,
        },
        {
          onSuccess: async (response: UploadUrlResponse) => {
            console.log('uploading image');
            fetch(response.uploadUrl, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file?.type }, // Must match the type used during URL generation
            }).then(() => generateVariation(response.fileKey));
          },
          onError: (error: any) => {
            console.error('API error:', error);
            setLoading(false);
          },
        },
      );
    } else {
      generateVariation(imageUrl);
    }
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

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputType(e.target.value as InputType);
    // reset other inputs when switching types
    setImageUrl('');
    setFile(null);
  };

  const onImageChange = (files: File[]) => {
    const file = files.at(0);

    if (!file) {
      alert('No file selected!');
      return;
    }

    // Basic validation for image file types
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name ?? '')) {
      alert('Please upload an image file.');
      return;
    }

    // Check size (e.g., limit to 5MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large!');
      return;
    }

    setFile(file);
  };

  return (
    <Version versionName="Version 4">
      <div>
        <p>
          This version generates a poem starting from an image, and then runs
          that poem through Version 3 of our algorithm. To learn more, visit our{' '}
          <Link to={Path.Overview}>Project Overview Page</Link>.
        </p>

        <div>
          <span className="text-violet-500 text-2xl">Image Input</span>
        </div>

        <div className="flex flex-row gap-4 mb-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="image-input-type"
              value="url"
              checked={inputType === 'url'}
              onChange={handleRadioChange}
            />{' '}
            URL
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="image-input-type"
              value="image"
              checked={inputType === 'image'}
              onChange={handleRadioChange}
            />{' '}
            Image Upload
          </label>
        </div>

        {inputType === 'url' ? (
          <>
            <p>
              For example, try:{' '}
              <a
                className="link"
                href="https://live.staticflickr.com/65535/54638556216_146f8ac2b6_k.jpg"
              >
                https://live.staticflickr.com/65535/54638556216_146f8ac2b6_k.jpg
              </a>
            </p>
            <input
              type="text"
              placeholder="Enter Image URL"
              className="input"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </>
        ) : (
          <>
            <p>Select an image to upload.</p>
            <FileDrop
              onFiles={onImageChange}
              accept="image/*"
              multiple={false}
              maxFiles={1}
              maxSizeBytes={5 * 1024 * 1024} // 5 MB
              label="Drop image here, or click to choose"
            />
          </>
        )}

        <details
          className="w-full mb-2"
          style={{ paddingLeft: 0 }}
          onToggle={(e) =>
            setDetailsOpen((e.currentTarget as HTMLDetailsElement).open)
          }
        >
          <summary
            className="cursor-pointer text-violet-500 font-medium flex items-center gap-2"
            style={{ listStyle: 'none', paddingLeft: 0 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={
                'h-4 w-4 transform transition-transform duration-200 ' +
                (detailsOpen ? 'rotate-90' : '')
              }
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.78a.75.75 0 010-1.06L10.94 9 7.21 5.28a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06L8.27 14.78a.75.75 0 01-1.06 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Advanced Image Settings</span>
          </summary>

          <div className="form-control w-full flex flex-row flex-wrap items-center justify-self-center justify-center content-center mt-1">
            <span className="text-violet-500">Settings: </span>

            <label className="cursor-pointer label">
              <span className="label-text p-1">
                # Related Images from Dataset
              </span>
              <input
                type="number"
                value={numRelatedImages}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setNumRelatedImages(
                    Number.isNaN(n) ? 1 : Math.max(1, Math.min(10, n)),
                  );
                }}
                className="input focus:outline-primary input-bordered input-xs w-12"
                min={1}
                max={10}
              />
            </label>

            <label className="cursor-pointer label">
              <span className="label-text p-1">Model</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as LLMName)}
                className="select select-bordered select-xs w-32 focus:outline-primary"
              >
                <option disabled value="">
                  Select model
                </option>
                {modelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="cursor-pointer label">
              <span className="label-text p-1">
                Include Image in Submission to LLM
              </span>
              <input
                type="checkbox"
                checked={passImageToModel}
                onChange={(e) => setPassImageToModel(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
        </details>

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

export default Version4;
