import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography } from "@mui/material";

function Clock() {
  const problemStore = useProblemStore();
  const WIDTH = 1000;
  const CENTER = 500;
  const RADIUS = 500;
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
      <Typography>{`카운트 : ${problemStore.count}`}</Typography>
      <svg viewBox={`0 0 ${WIDTH} ${WIDTH}`}>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS - 1}
          fill="var(--background)"
          stroke="#000"
          strokeWidth="2"
        />
        <circle cx={CENTER} cy={CENTER} r={5} fill="#000" />
      </svg>
    </div>
  );
}

export default observer(Clock);
