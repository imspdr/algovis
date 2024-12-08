import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { css } from "@emotion/react";
import { useProblemStore } from "../store/ProblemStoreProvider";

function Brick() {
  const problemStore = useProblemStore();

  useEffect(() => {
    problemStore.reset();
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("resize", problemStore.reset);
    return () => {
      window.removeEventListener("resize", problemStore.reset);
      window.removeEventListener("keydown", keyDownEvent);
    };
  }, []);

  const keyDownEvent = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowRight") {
      problemStore.right();
    } else if (ev.key === "ArrowLeft") {
      problemStore.left();
    } else if (ev.key === " ") {
      if (problemStore.stopFlag) {
        problemStore.start();
      } else {
        problemStore.stop();
      }
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
      id="brick-frame"
    >
      <svg
        css={css`
          width: 100%;
          height: 100%;
        `}
        onClick={handleSvgClick}
      >
        <>
          {problemStore.activeWalls.map((wall) => {
            return (
              <>
                <rect
                  x="0"
                  y={`${problemStore.getViewY(wall.y) - 1.5 * problemStore.radius}`}
                  width={`${wall.hole - (problemStore.radius * problemStore.holeWidth) / 2}`}
                  height={`${problemStore.radius * 3}`}
                  fill="var(--highlight)"
                />
                <rect
                  x={`${wall.hole + problemStore.radius * 5}`}
                  y={`${problemStore.getViewY(wall.y) - 1.5 * problemStore.radius}`}
                  width={`${
                    problemStore.width -
                    wall.hole -
                    (problemStore.radius * problemStore.holeWidth) / 2
                  }`}
                  height={`${problemStore.radius * 3}`}
                  fill="var(--highlight)"
                />
                {wall.obs.map((obs) => {
                  return (
                    <rect
                      x={`${obs.x - problemStore.radius}`}
                      y={`${problemStore.getViewY(obs.y) - problemStore.radius}`}
                      width={`${problemStore.radius * 2}`}
                      height={`${problemStore.radius * 2}`}
                      fill="var(--highlight)"
                    />
                  );
                })}
              </>
            );
          })}
        </>
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
        <text x={problemStore.width - 50} y={50} fill="var(--foreground)" font-size="32">
          {problemStore.count}
        </text>
      </svg>
    </div>
  );
}

export default observer(Brick);
