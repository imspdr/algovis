import { css } from "@emotion/react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { useEffect } from "react";
import { observer } from "mobx-react";

import { fruit } from "../store/types";

function Suika() {
  const problemStore = useProblemStore();

  const keyDownEvent = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowRight") {
      problemStore.setPosX(problemStore.posX + 20);
    } else if (ev.key === "ArrowLeft") {
      problemStore.setPosX(problemStore.posX - 20);
    } else if (ev.key === "Enter") {
      problemStore.addFruit();
    } else if (ev.key === " ") {
      if (problemStore.stopFlag) {
        problemStore.start();
      } else {
        problemStore.stop();
      }
    } else if (ev.key === "r") {
      problemStore.reset();
    }
  };
  const fillIndex = [
    "#94d6c5",
    "#3a987f",
    "#d694c6",
    "#c15da9",
    "#ffd700",
    "#645047",
    "#ff8c00",
    "#e65100",
    "#01579b",
    "#c62828",
    "#999999",
  ];
  useEffect(() => {
    window.addEventListener("keydown", keyDownEvent);
    return () => window.removeEventListener("keydown", keyDownEvent);
  }, []);

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svgElement = event.currentTarget;
    const rect = svgElement.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    problemStore.setPosX(x);
    problemStore.addFruit();
  };
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
      `}
    >
      <div
        css={css`
          height: calc(100% - 10px);
          aspect-ratio: 1 / 1.6;
          border: 1px solid;
        `}
      >
        <svg viewBox={`0 0 1000 1600`} onClick={handleSvgClick}>
          <circle
            key={"new-fruit"}
            cx={problemStore.posX}
            cy={0}
            r={problemStore.nowRadius}
            fill={fillIndex[problemStore.nowFill]}
          />
          {problemStore.renderFruits.map((fruit: fruit | undefined, index: number) => {
            if (fruit)
              return (
                <circle
                  key={`fruit-${index}`}
                  cx={fruit.pos.x}
                  cy={fruit.pos.y}
                  r={fruit.radius}
                  fill={fillIndex[fruit.fillIndex >= fillIndex.length ? 0 : fruit.fillIndex]}
                />
              );
            else return;
          })}
        </svg>
      </div>
    </div>
  );
}

export default observer(Suika);
