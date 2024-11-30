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
          overflow: auto;
        `}
      >
        {props.viewer}
      </div>
    </div>
  );
}
