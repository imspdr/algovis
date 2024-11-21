import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { Typography } from "@mui/material";

function Cell(props: { i: number; j: number; C: number; color: string; person: boolean }) {
  const { i, j, C, color, person } = props;
  return (
    <div
      key={`${i}th-row-${j}th-col`}
      css={css`
        width: ${(100 / C).toFixed(2)}%;
        height: 100%;
        background-color: ${color};
        display: flex;
        border: ${i < 3 ? "0px" : "1px solid"};
        align-items: center;
        justify-content: center;
      `}
    >
      {person && (C < 20 ? <AccessibilityNewIcon sx={{ fontSize: "inherit" }} /> : "-")}
    </div>
  );
}
function Forest() {
  const problemStore = useProblemStore();
  const getColor = (i: number, j: number) => {
    if (problemStore.exitState[i]![j]) {
      return "#009999";
    } else if (
      problemStore.nowGolem &&
      problemStore.nowGolem.dx == j &&
      problemStore.nowGolem.dy == i
    ) {
      return "#009999";
    } else if (problemStore.mapState[i]![j]! > 0) {
      return `rgb(20, ${255 - ((problemStore.mapState[i]![j]! * 33) % 100)}, 0)`;
    } else if (
      problemStore.nowGolem &&
      Math.abs(i - problemStore.nowGolem.y) + Math.abs(j - problemStore.nowGolem.x) <= 1
    ) {
      return "var(--highlight)";
    } else {
      return "var(--paper)";
    }
  };
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
      `}
    >
      <Typography variant="h6">{`${problemStore.n}번째 골렘 처리중`}</Typography>
      <Typography variant="h6">{` 현재 스코어 : ${problemStore.nowScore}`}</Typography>
      <div
        css={css`
          width: 100%;
          height: calc(100% - ${problemStore.R * 2 + 80}px);
        `}
      >
        {[...new Array(problemStore.R + 3)].map((_, i) => {
          return (
            <div
              key={`${i}th-row`}
              css={css`
                display: flex;
                flex-direcion: row;
                border: ${i < 3 ? "0px" : "1px solid"};
                height: ${(100 / (problemStore.R + 3)).toFixed(4)}%;
              `}
            >
              {[...new Array(problemStore.C)].map((_, j) => {
                return (
                  <Cell
                    i={i}
                    j={j}
                    C={problemStore.C}
                    color={getColor(i, j)}
                    person={
                      !!(
                        problemStore.nowMan &&
                        problemStore.nowMan.x == j &&
                        problemStore.nowMan.y == i
                      ) || problemStore.visitState[i]![j]!
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default observer(Forest);
