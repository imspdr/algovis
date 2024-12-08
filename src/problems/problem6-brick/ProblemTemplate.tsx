import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import { observer } from "mobx-react";
import { useProblemStore } from "./store/ProblemStoreProvider";
import ProblemDesc from "./components/ProblemDesc";
import Brick from "./components/Brick";
import Controller from "./components/Controller";

function ProblemTemplate() {
  const [nowWidth, setNowWidth] = useState(window.innerWidth);
  const [viewWidth, setViewWidth] = useState(0);
  useEffect(() => {
    addEventListener("resize", () => {
      setNowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    problemStore.reset();
  }, [viewWidth]);

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
  const viewer = <Brick />;

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
          onWidthChange={(v) => {
            setViewWidth(v);
          }}
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
