import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import { observer } from "mobx-react";
import { useProblemStore } from "./store/ProblemStoreProvider";
import ProblemDesc from "./components/ProblemDesc";
import Bricks from "./components/Bricks";

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
  const controller = <span>해당 문제에는 조작할 변수가 없습니다</span>;
  const viewer = <Bricks />;

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
