import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import { observer } from "mobx-react";
import { useProblemStore } from "./store/ProblemStoreProvider";
import ProblemDesc from "./components/ProblemDesc";
import Clock from "./components/Clock";
import Controller from "./components/Controller";

function ProblemTemplate() {
  const [nowWidth, setNowWidth] = useState(window.innerWidth);
  const resize = () => {
    setNowWidth(window.innerWidth);
  };
  useEffect(() => {
    addEventListener("resize", resize);
    return () => {
      removeEventListener("resize", resize);
    };
  }, []);

  const problemStore = useProblemStore();

  const start = problemStore.running;
  const onStart = async () => {
    await problemStore.start();
    return true;
  };
  const onStop = () => {
    problemStore.setRunning(false);
  };
  const onRefresh = () => {
    problemStore.refresh();
  };

  const problem = <ProblemDesc />;
  const controller = <Controller />;
  const viewer = <Clock />;

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
