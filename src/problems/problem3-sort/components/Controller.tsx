import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography, Slider, Select, MenuItem } from "@mui/material";
import { sortAlgos } from "../store/ProblemStore";

function Controller() {
  const problemStore = useProblemStore();
  const inputBlock = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  `;
  const nMarks = [
    {
      value: 100,
      label: "100",
    },
    {
      value: 1000,
      label: "1000",
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
        <Typography variant="h6">{`배열 길이 : ${problemStore.arrayLength}`}</Typography>
        <Slider
          aria-label="nqueen"
          value={problemStore.arrayLength}
          step={1}
          min={100}
          max={1000}
          marks={nMarks}
          css={css`
            color: var(--highlight);
          `}
          disabled={problemStore.running}
          onChange={(e, v) => {
            problemStore.setArrayLength(v as number);
          }}
        />
      </div>
      <div css={inputBlock}>
        <Typography variant="h6">{`알고리즘`}</Typography>
        <Select
          id="demo-simple-select"
          value={problemStore.selectedAlgo}
          css={css`
            width: 300px;
            margin-top: 10px;
          `}
          onChange={(e) => {
            problemStore.setSelectedAlgo(e.target.value as string);
          }}
        >
          {sortAlgos.map((item) => {
            return (
              <MenuItem key={`${item.label}`} value={item.value}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    </div>
  );
}

export default observer(Controller);
