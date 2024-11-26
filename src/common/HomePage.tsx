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
      `}
    >
      <Paper
        elevation={0}
        css={css`
          width: 300px;
          border-radius: 10px;
          border: 1px solid;
        `}
      >
        {codingTests.map((cote) => (
          <div key={`${cote.name}-row`}>
            <ListItemButton
              key={`itembutton-${cote.name}`}
              onClick={() => {
                navigate("/" + cote.url);
              }}
            >
              <div
                key={`div-${cote.name}`}
                css={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                `}
              >
                <Typography
                  key={`title-${cote.name}`}
                  css={css`
                    margin-right: 10px;
                  `}
                  variant="body2"
                >
                  {cote.desc}
                </Typography>
              </div>
            </ListItemButton>
            <Divider key={`divider-${cote.name}`} />
          </div>
        ))}
      </Paper>
    </div>
  );
}
