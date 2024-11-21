import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import { observer } from "mobx-react";
import { useProblemStore } from "./store/ProblemStoreProvider";
import ProblemDesc from "./components/ProblemDesc";
import Forest from "./components/Forest";

function ProblemTemplate() {
  const [nowWidth, setNowWidth] = useState(window.innerWidth);
  useEffect(() => {
    addEventListener("resize", () => {
      setNowWidth(window.innerWidth);
    });
  }, []);

  const problemStore = useProblemStore();

  const onStart = async () => {
    problemStore.running = true;
    await problemStore.main();
    return true;
  };
  const onStop = () => {
    problemStore.running = false;
  };
  const onRefresh = () => {
    problemStore.resetMap();
    problemStore.nowScore = 0;
  };

  return (
    <>
      {nowWidth > 900 ? (
        <Template
          problem={<ProblemDesc />}
          selector={<div>문제컴포넌트</div>}
          viewer={<Forest />}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      ) : (
        <MobileTemplate
          problem={<ProblemDesc />}
          selector={<div>문제컴포넌트</div>}
          viewer={<Forest />}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default observer(ProblemTemplate);
