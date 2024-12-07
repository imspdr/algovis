import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
import { useProblemStore } from "../store/ProblemStoreProvider";

function Bricks() {
  const problemStore = useProblemStore();

  useEffect(() => {
    addEventListener("keydown", keyDownEvent);
    return () => {
      removeEventListener("keydown", keyDownEvent);
    };
  }, []);

  const keyDownEvent = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowRight") {
      problemStore.right();
    } else if (ev.key === "ArrowLeft") {
      problemStore.left();
    } else if (ev.key === " ") {
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
  ];
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svgElement = event.currentTarget;
    const rect = svgElement.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    if (x > 500) {
      problemStore.right();
    } else {
      problemStore.left();
    }
  };

  return (
    <div
      css={css`
        padding: 1px;
        height: calc(100% - 2px);
        width: calc(100% - 2px);
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={css`
          height: calc(100% - 5px);
          aspect-ratio: 10 / 16;
          border: 1px solid;
        `}
      >
        <svg viewBox={`0 0 1000 1600`} onClick={handleSvgClick}></svg>
      </div>
    </div>
  );
}

export default observer(Bricks);
