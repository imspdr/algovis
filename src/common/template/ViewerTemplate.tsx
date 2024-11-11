import { css } from "@emotion/react";
import { Typography } from "@mui/material";

export default function ViewerTemplate(props: { viewer: JSX.Element }) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 5px;
        height: calc(100% - 10px);
      `}
    >
      <div
        css={css`
          padding: 20px;
          border: 1px solid;
          border-radius: 10px;
          height: calc(100% - 40px);
          background-color: var(--paper);
        `}
      >
        <Typography variant="h5">시각화 영역</Typography>
        <div
          css={css`
            margin-top: 10px;
            overflow: auto;
            width: 100%;
            height: calc(100% - 55px);
          `}
        >
          {props.viewer}
        </div>
      </div>
    </div>
  );
}
