import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { Paper, List, ListItemButton, Divider, Typography } from "@mui/material";
import { codingTests } from "@src/App";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
      `}
    >
      <Paper
        elevation={0}
        css={css`
          width: 480px;
          border-radius: 10px;
          border: 1px solid;
        `}
      >
        <Divider />
        {codingTests.map((cote) => (
          <>
            <ListItemButton
              onClick={() => {
                navigate("/" + cote.url);
              }}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                `}
              >
                <Typography
                  css={css`
                    width: 120px;
                  `}
                  variant="body2"
                >
                  {cote.name}
                </Typography>
                -
                <Typography
                  css={css`
                    margin-left: 10px;
                  `}
                  variant="body2"
                >
                  {cote.desc}
                </Typography>
              </div>
            </ListItemButton>
            <Divider />
          </>
        ))}
      </Paper>
    </div>
  );
}
