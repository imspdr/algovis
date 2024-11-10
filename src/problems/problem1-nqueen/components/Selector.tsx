import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { unselectable } from "@src/util";

function Selector() {
  const chessStore = useProblemStore();
  return (
    <div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
        `}
      >
        <div
          css={css`
            width: 10%;
          `}
        >
          {`N퀸 : `}
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            width: 20%;
          `}
        >
          <div
            onClick={() => {
              if (chessStore.nQueen > 4) {
                chessStore.nQueen = chessStore.nQueen - 1;
              }
            }}
            css={css`
              width: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              ${unselectable}
              ${chessStore.solving ? "color : #AAAAAA;" : ""}
            `}
          >
            {"-"}
          </div>
          <div
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            {`${chessStore.nQueen}`}
          </div>
          <div
            onClick={() => {
              if (chessStore.nQueen < 20) {
                chessStore.nQueen = chessStore.nQueen + 1;
              }
            }}
            css={css`
              width: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              ${chessStore.solving ? "color : #AAAAAA;" : ""}
              ${unselectable}
            `}
          >
            {"+"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(Selector);
