import { useState, useEffect } from "react";
import Template from "@src/common/template/Template";
import MobileTemplate from "@src/common/template/MobileTemplate";
import ChessBoard from "./components/ChessBoard";
import Selector from "./components/Selector";
import ProblemDesc from "./components/ProblemDesc";
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

  const onStart = async () => {
    const ret = await problemStore.onClickSolver();
    return ret;
  };
  const onStop = () => {
    problemStore.onClickStop();
  };
  const onRefresh = () => {
    problemStore.clear();
  };

  return (
    <>
      {nowWidth > 900 ? (
        <Template
          problem={<ProblemDesc />}
          selector={<Selector />}
          viewer={<ChessBoard />}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      ) : (
        <MobileTemplate
          problem={<ProblemDesc />}
          selector={<Selector />}
          viewer={<ChessBoard />}
          onStart={onStart}
          onStop={onStop}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

export default observer(ProblemTemplate);
