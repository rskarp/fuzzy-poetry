import Intro from "./intro";
import Version from "./version";

const HomePage = () => {
  return (
    <div>
      <Intro />
      <h2 className="text-violet-500 text-2xl">Try it out: Select an algorithm version to generate a poem.</h2>
      <Version versionName="Version 1" children={<div>Details about Version 1.0</div>} />
      <Version versionName="Version 2" children={<div>Details about Version 2.0</div>} />
      <Version versionName="Version 3" children={<div>Details about Version 3.0</div>} />
      <Version versionName="Version 4" children={<div>Details about Version 4.0</div>} />
    </div>
  );
};

export default HomePage;