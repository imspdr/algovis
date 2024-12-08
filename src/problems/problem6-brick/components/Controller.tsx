import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Typography, Slider } from "@mui/material";

type Control = {
  desc: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step: number;
};
function Controller() {
  const problemStore = useProblemStore();
  const inputBlock = css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  `;
  const controls: Control[] = [
    {
      desc: "중력",
      value: problemStore.gravity,
      setValue: problemStore.setGravity,
      min: 0.1,
      max: 0.9,
      step: 0.1,
    },
    {
      desc: "윗방향 힘",
      value: problemStore.upperPower,
      setValue: problemStore.setUpperPower,
      min: 1,
      max: 20,
      step: 1,
    },
    {
      desc: "가로방향 힘",
      value: problemStore.horizontalPower,
      setValue: problemStore.setHorizontalPower,
      min: 1,
      max: 9,
      step: 1,
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
      {controls.map((control: Control) => {
        return (
          <div key={`${control.desc}`} css={inputBlock}>
            <Typography
              key={`${control.desc}-title`}
              variant="h6"
            >{`${control.desc} : ${control.value}`}</Typography>
            <Slider
              key={`${control.desc}-slider`}
              aria-label="delay"
              value={control.value}
              step={control.step}
              min={control.min}
              max={control.max}
              marks={[
                {
                  value: control.min,
                  label: String(control.min),
                },
                {
                  value: control.max,
                  label: String(control.max),
                },
              ]}
              css={css`
                color: var(--highlight);
              `}
              onChange={(e, v) => {
                control.setValue(v as number);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default observer(Controller);
