import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography, Slider } from "@mui/material";

function Controller() {
  const problemStore = useProblemStore();
  const inputBlock = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  `;

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
        <Typography variant="h6">{`중력 : ${problemStore.gravity}`}</Typography>
        <Slider
          aria-label="delay"
          value={problemStore.gravity}
          step={1}
          min={1}
          max={10}
          marks={[
            {
              value: 1,
              label: "1",
            },
            {
              value: 10,
              label: "10",
            },
          ]}
          css={css`
            color: var(--highlight);
          `}
          onChange={(e, v) => {
            problemStore.setGravity(v as number);
          }}
        />
      </div>
      <div css={inputBlock}>
        <Typography variant="h6">{`충돌 세기: ${problemStore.collisionPower}`}</Typography>
        <Slider
          aria-label="delay"
          value={problemStore.collisionPower}
          step={10}
          min={10}
          max={50}
          marks={[
            {
              value: 10,
              label: "10",
            },
            {
              value: 50,
              label: "50",
            },
          ]}
          css={css`
            color: var(--highlight);
          `}
          onChange={(e, v) => {
            problemStore.setCollisionPower(v as number);
          }}
        />
      </div>
      <div css={inputBlock}>
        <Typography variant="h6">{`탄성 : ${problemStore.lossRate}`}</Typography>
        <Slider
          aria-label="delay"
          value={problemStore.lossRate}
          step={0.1}
          min={0.1}
          max={0.8}
          marks={[
            {
              value: 0.1,
              label: "0.1",
            },
            {
              value: 0.8,
              label: "0.8",
            },
          ]}
          css={css`
            color: var(--highlight);
          `}
          onChange={(e, v) => {
            problemStore.setLossRate(v as number);
          }}
        />
      </div>
    </div>
  );
}

export default observer(Controller);
