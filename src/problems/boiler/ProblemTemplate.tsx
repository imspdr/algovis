import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import { observer } from "mobx-react";
import { useProblemStore } from "./store/ProblemStoreProvider";

function ProblemTemplate() {
  const [nowWidth, setNowWidth] = useState(window.innerWidth);
  useEffect(() => {
    addEventListener("resize", () => {
      setNowWidth(window.innerWidth);
    });
  }, []);

  const problemStore = useProblemStore();

  const onStart = () => {
    return true;
  };
  const onStop = () => {};
  const onRefresh = () => {};

  return (
    <>
      {nowWidth > 900 ? (
        <Template
          problem={<div>문제컴포넌트</div>}
          selector={<div>문제컴포넌트</div>}
          viewer={<div>문제컴포넌트</div>}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      ) : (
        <MobileTemplate
          problem={<div>문제컴포넌트</div>}
          selector={<div>문제컴포넌트</div>}
          viewer={<div>문제컴포넌트</div>}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default observer(ProblemTemplate);
