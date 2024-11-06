import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { Paper, List, ListItemButton, ListItemText } from "@mui/material";
import { codingTests } from "@src/App";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div
      css={css`
        padding: 20px;
      `}
    >
      <Paper
        elevation={0}
        css={css`
          border-radius: 10px;
        `}
      >
        <List>
          {codingTests.map((cote) => (
            <ListItemButton
              onClick={() => {
                navigate("/" + cote.url);
              }}
            >
              <ListItemText
                css={css`
                  width: 200px;
                `}
                primary={cote.name}
              />
              <ListItemText primary={cote.desc} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </div>
  );
}
