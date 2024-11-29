import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Footer(props: {
  onStart: () => Promise<boolean> | boolean | void;
  onStop: () => void;
  onRefresh: () => void;
  onChange?: () => void;
  tab?: boolean;
}) {
  const navigate = useNavigate();
  const [start, setStart] = useState(false);
  const onClick = async () => {
    if (start) {
      props.onStop();
      setStart(false);
    } else {
      setStart(true);
      const ret = await props.onStart();
      if (ret) setStart(false);
    }
  };
  useEffect(() => {
    return () => {
      props.onStop();
      setStart(false);
    };
  }, [props.tab]);
  return (
    <div
      css={css`
        position: absolute;
        bottom: 0px;
        padding: 5px;
        min-width: 290px;
        width: calc(100% - 10px);
        height: 50px;
      `}
    >
      <div
        css={css`
          width: calc(100% - 20px);
          padding: 0px 10px;
          height: 100%;
          border: 1px solid;
          border-radius: 10px;
          background-color: var(--paper);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <div
          css={css`
            width: 80px;
            display: flex;
            flex-direction: row;
          `}
        >
          <Button onClick={() => navigate("/")} color="inherit">
            <ReorderIcon />
          </Button>
          {props.onChange && (
            <Button onClick={props.onChange} color="inherit">
              {!props.tab ? <SwitchLeftIcon /> : <SwitchRightIcon />}
            </Button>
          )}
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: row;
          `}
        >
          <Button onClick={props.onRefresh} disabled={start} color="inherit">
            <RefreshIcon />
          </Button>
          <Button
            onClick={onClick}
            variant="contained"
            color="inherit"
            css={css`
              margin-left: 10px;
              background-color: ${start ? "var(--warning)" : "var(--highlight)"};
            `}
          >
            {start ? <StopIcon /> : <PlayArrowIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}
