import { Link } from 'react-router';
import { Path } from '../../router/path';

const Intro = () => {
  return (
    <div className="bg-base-200 flex flex-row space-x-6 text-center items-center p-8 my-2 rounded-md shadow-lg">
      <h2 className="text-violet-500 text-2xl w-1/2 text-justify">
        Welcome to Fuzzy Poetry, an application that employs generative AI to
        help you write poetry. Take an existing{' '}
        <a className="link" href="https://www.poetryfoundation.org/">
          text
        </a>
        , run it through our application, get it back reimagined, and{' '}
        <a className="link" href="https://glia.ca/rerites/">
          carve
        </a>{' '}
        out an "original" poem. At the bottom of the text box, pick how many and
        what kind of variations of the input you want to generate. You can use
        synonyms, anagrams, homophones, or words that are related to, spelled
        similarly to, or match the consonants of the starting text. These
        variations will then be distilled into a "new" version, ready to be
        carved. For more details, see our{' '}
        <Link to={Path.Overview}>About Page</Link>.
      </h2>
      <iframe
        src="https://drive.google.com/file/d/15hxEcmaMWM0WntGliI_-aB81pGNBCmwE/preview"
        className="rounded-lg shadow-lg"
        width="50%"
        height="480"
        allow="autoplay; fullscreen"
      ></iframe>
    </div>
  );
};

export default Intro;
