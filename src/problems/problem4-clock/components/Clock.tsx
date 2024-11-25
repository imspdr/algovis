import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography } from "@mui/material";
import { FULL } from "../store/ProblemStore";

function Clock() {
  const problemStore = useProblemStore();
  const WIDTH = 1000;
  const CENTER = 500;
  const RADIUS = 500;
  const HIGH = 50;
  const stroke = () => {
    if (problemStore.smh) {
      return "var(--warning)";
    } else if (problemStore.sh || problemStore.sm) {
      return "var(--highlight)";
    } else {
      return "var(--foreground)";
    }
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 100%;
      `}
    >
      <Typography variant="h6">{`카운트 : ${problemStore.count}`}</Typography>
      <svg viewBox={`0 0 ${WIDTH} ${WIDTH}`}>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS - HIGH}
          fill="var(--background)"
          stroke={stroke()}
          strokeWidth={problemStore.sh || problemStore.sm ? HIGH : 20}
        />
        <circle cx={CENTER} cy={CENTER} r={5} fill="#000" />
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER + RADIUS * Math.sin((problemStore.s / FULL) * 2 * Math.PI) * 0.9}
          y2={CENTER - RADIUS * Math.cos((problemStore.s / FULL) * 2 * Math.PI) * 0.9}
          stroke={stroke()}
          strokeWidth={problemStore.sh || problemStore.sm ? 0 : 5}
          strokeLinecap="round"
        />
        <line
          x1={CENTER}
          y1={CENTER}
          x2={
            CENTER +
            RADIUS * Math.sin((problemStore.m / FULL) * 2 * Math.PI) * (problemStore.sm ? 0.9 : 0.7)
          }
          y2={
            CENTER -
            RADIUS * Math.cos((problemStore.m / FULL) * 2 * Math.PI) * (problemStore.sm ? 0.9 : 0.7)
          }
          stroke={stroke()}
          strokeWidth={problemStore.sm ? HIGH : 10}
          strokeLinecap="round"
        />
        <line
          x1={CENTER}
          y1={CENTER}
          x2={
            CENTER +
            RADIUS * Math.sin((problemStore.h / FULL) * 2 * Math.PI) * (problemStore.sh ? 0.9 : 0.5)
          }
          y2={
            CENTER -
            RADIUS * Math.cos((problemStore.h / FULL) * 2 * Math.PI) * (problemStore.sh ? 0.9 : 0.5)
          }
          stroke={stroke()}
          strokeWidth={problemStore.sh ? HIGH : 15}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default observer(Clock);
