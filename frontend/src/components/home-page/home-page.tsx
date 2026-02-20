import Intro from './intro';
import Version1 from './versions/version-1';
import Version2 from './versions/version-2';
import Version3 from './versions/version-3';
import Version4 from './versions/version-4';

const HomePage = () => {
  return (
    <div>
      <Intro />
      <h2 className="text-violet-500 text-2xl">
        Try it out: Select an algorithm version to generate a poem.
      </h2>
      <Version1 />
      <Version2 />
      <Version3 />
      <Version4 />
    </div>
  );
};

export default HomePage;
