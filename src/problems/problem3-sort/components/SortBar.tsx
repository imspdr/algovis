import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { bar } from "../store/ProblemStore";
import { Typography } from "@mui/material";

function SortBar() {
  const sortStore = useProblemStore();
  const HEIGHT = 8 * sortStore.numberArray.length;
  const SINGLEWIDTH = 13;
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
      <Typography>{`비교 수 : ${sortStore.compareCount}`}</Typography>
      <svg viewBox={`0 0 ${SINGLEWIDTH * sortStore.numberArray.length} ${HEIGHT}`}>
        {sortStore.numberArray.map((bar: bar, index: number) => {
          const height = (HEIGHT * bar.value) / 1000;
          return (
            <rect
              width={SINGLEWIDTH}
              height={height}
              fill={
                bar.state === "compare" ? "#00ff00" : bar.state === "moving" ? "#0000ff" : "#dddddd"
              }
              x={index * SINGLEWIDTH}
              y={HEIGHT - height}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default observer(SortBar);
