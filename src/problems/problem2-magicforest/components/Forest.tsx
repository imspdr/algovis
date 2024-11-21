import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import PersonIcon from "@mui/icons-material/Person";

function Cell(props: { i: number; j: number; C: number; color: string; person: boolean }) {
  const { i, j, C, color, person } = props;
  return (
    <div
      key={`${i}th-row-${j}th-col`}
      css={css`
        width: ${Math.floor(100 / C)}%;
        height: 100%;
        background-color: ${color};
        display: flex;
        border: ${i < 3 ? "0px" : "1px solid"};
        align-items: center;
        justify-content: center;
      `}
    >
      {person && <PersonIcon />}
    </div>
  );
}
function Forest() {
  const problemStore = useProblemStore();
  const getColor = (i: number, j: number) => {
    if (problemStore.mapState[i]![j] === 2) {
      return "#009999";
    } else if (
      problemStore.nowGolem &&
      problemStore.nowGolem.dx == j &&
      problemStore.nowGolem.dy == i
    ) {
      return "#009999";
    } else if (problemStore.mapState[i]![j] === 1) {
      return "#22cccc";
    } else if (
      problemStore.nowGolem &&
      Math.abs(i - problemStore.nowGolem.y) + Math.abs(j - problemStore.nowGolem.x) <= 1
    ) {
      return "#22cccc";
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
      <div
        css={css`
          width: 100%;
          height: 95%;
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
                height: calc(${Math.floor(100 / (problemStore.R + 3))}%);
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
                      )
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
