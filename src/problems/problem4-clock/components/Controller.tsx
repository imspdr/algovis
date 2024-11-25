import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography, Slider } from "@mui/material";
import TimeInput from "./TimeInput";

function Controller() {
  const problemStore = useProblemStore();
  const inputBlock = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  `;
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
        <Typography variant="h6">{`시작 시간(HHMMSS)`}</Typography>
        <TimeInput
          initTime="000000"
          onComplete={(v: string) => {
            problemStore.setStartTime(
              Number(v.slice(0, 2)),
              Number(v.slice(2, 4)),
              Number(v.slice(4, 6))
            );
          }}
        />
      </div>
    </div>
  );
}

export default observer(Controller);
