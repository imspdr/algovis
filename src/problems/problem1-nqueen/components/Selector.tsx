import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography, Slider } from "@mui/material";

function Selector() {
  const problemStore = useProblemStore();
  const inputBlock = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `;
  const nMarks = [
    {
      value: 4,
      label: "4",
    },
    {
      value: 30,
      label: "30",
    },
  ];
  const delayMarks = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 1000,
      label: "1000",
    },
  ];
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: calc(100% - 40px);
        align-items: center;
        padding: 20px;
        gap: 20px;
      `}
    >
      <div css={inputBlock}>
        <Typography variant="h6">{`애니메이션 딜레이 : ${problemStore.delay}ms`}</Typography>
        <Slider
          aria-label="delay"
          value={problemStore.delay}
          step={1}
          min={1}
          max={1000}
          marks={delayMarks}
          css={css`
            color: var(--highlight);
          `}
          onChange={(e, v) => {
            problemStore.setDelay(v as number);
          }}
        />
      </div>
      <div css={inputBlock}>
        <Typography variant="h6">{`n : ${problemStore.nQueen}`}</Typography>
        <Slider
          aria-label="nqueen"
          value={problemStore.nQueen}
          step={1}
          min={4}
          max={30}
          marks={nMarks}
          css={css`
            color: var(--highlight);
          `}
          disabled={problemStore.solving}
          onChange={(e, v) => {
            problemStore.setNQueen(v as number);
          }}
        />
      </div>
    </div>
  );
}

export default observer(Selector);
