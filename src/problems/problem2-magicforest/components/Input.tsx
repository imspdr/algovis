import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Slider, Typography } from "@mui/material";

function Input() {
  const problemStore = useProblemStore();
  const inputBlock = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  `;
  const rcmarks = [
    {
      value: 5,
      label: "5",
    },
    {
      value: 70,
      label: "70",
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
        flex-direction: row;
        justify-content: space-between;
        padding: 20px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 70%;
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
          <Typography variant="h6">{`R : ${problemStore.R}`}</Typography>
          <Slider
            aria-label="R"
            value={problemStore.R}
            step={1}
            min={5}
            max={70}
            marks={rcmarks}
            css={css`
              color: var(--highlight);
            `}
            disabled={problemStore.running}
            onChange={(e, v) => {
              problemStore.setInput(v as number, problemStore.C, problemStore.rows);
            }}
          />
        </div>
        <div css={inputBlock}>
          <Typography variant="h6">{`C : ${problemStore.C}`}</Typography>
          <Slider
            aria-label="C"
            value={problemStore.C}
            step={1}
            max={70}
            min={5}
            marks={rcmarks}
            css={css`
              color: var(--highlight);
            `}
            disabled={problemStore.running}
            onChange={(e, v) => {
              problemStore.setInput(problemStore.R, v as number, problemStore.rows);
            }}
          />
        </div>
      </div>

      <div
        css={css`
          width: 20%;
          height: calc(100%);
          max-height: 400px;
          overflow: auto;
        `}
      >
        <Typography variant="h6">{`골렘 정보 `}</Typography>
        {problemStore.rows.map((row) => {
          return <div>{`${row.c} ${row.d}`}</div>;
        })}
      </div>
    </div>
  );
}

export default observer(Input);
