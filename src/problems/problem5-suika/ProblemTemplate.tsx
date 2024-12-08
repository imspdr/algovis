import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import { observer } from "mobx-react";
import { useProblemStore } from "./store/ProblemStoreProvider";
import ProblemDesc from "./components/ProblemDesc";
import Suika from "./components/Suika";
import Controller from "./components/Controller";

function ProblemTemplate() {
  const [nowWidth, setNowWidth] = useState(window.innerWidth);
  useEffect(() => {
    addEventListener("resize", () => {
      setNowWidth(window.innerWidth);
    });
  }, []);

  const problemStore = useProblemStore();

  const start = !problemStore.stopFlag;
  const onStart = async () => {
    problemStore.start();
    return problemStore.stopFlag;
  };
  const onStop = () => {
    problemStore.stop();
  };
  const onRefresh = () => {
    problemStore.reset();
  };
  const problem = <ProblemDesc />;
  const controller = <Controller />;
  const viewer = <Suika />;

  return (
    <>
      {nowWidth > 900 ? (
        <Template
          problem={problem}
          controller={controller}
          viewer={viewer}
          start={start}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      ) : (
        <MobileTemplate
          problem={problem}
          controller={controller}
          viewer={viewer}
          start={start}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default observer(ProblemTemplate);
