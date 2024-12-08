import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
import { useProblemStore } from "../store/ProblemStoreProvider";

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

function Bricks() {
  const problemStore = useProblemStore();

  useEffect(() => {
    setView();
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("resize", setView);
    return () => {
      window.removeEventListener("resize", setView);
      window.removeEventListener("keydown", keyDownEvent);
    };
  }, []);

  const keyDownEvent = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowRight") {
      problemStore.right();
    } else if (ev.key === "ArrowLeft") {
      problemStore.left();
    } else if (ev.key === " ") {
      problemStore.start();
    }
  };
  const setView = () => {
    const parent = document.getElementById("bricks-frame");
    if (parent) {
      problemStore.width = parent.offsetWidth;
      problemStore.height = parent.offsetHeight;
      problemStore.reset();
    }
  };
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svgElement = event.currentTarget;
    const rect = svgElement.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    if (x > 0.5) {
      problemStore.right();
    } else {
      problemStore.left();
    }
  };

  return (
    <div
      css={css`
        height: calc(100%);
        width: calc(100%);
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
      id="bricks-frame"
    >
      <svg
        css={css`
          width: 100%;
          height: 100%;
        `}
        onClick={handleSvgClick}
      >
        <text x={50} y={50}>
          {problemStore.nowHeight}
        </text>
        <>{problemStore.activeWalls.map((y: number) => {})}</>
        <polygon
          points={`${problemStore.brick.pos.x},${
            problemStore.getViewY(problemStore.brick.pos.y) - problemStore.radius
          } ${problemStore.brick.pos.x + problemStore.radius},${problemStore.getViewY(
            problemStore.brick.pos.y
          )} ${problemStore.brick.pos.x},${
            problemStore.getViewY(problemStore.brick.pos.y) + problemStore.radius
          } ${problemStore.brick.pos.x - problemStore.radius},${problemStore.getViewY(
            problemStore.brick.pos.y
          )}`}
          fill="var(--foreground)"
          stroke="var(--foreground)"
          stroke-width="2"
        />
      </svg>
    </div>
  );
}

export default observer(Bricks);
