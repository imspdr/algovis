import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Button } from "@mui/material";
import inputContent from "./input.txt";

function ExampleButtons() {
  const problemStore = useProblemStore();
  const setText = (input: string) => {
    try {
      const lines = input.trim().split("\n");
      if (lines.length > 1) {
        const [R, C] = lines[0]!.split(" ").map(Number);
        const rows = lines.slice(1).map((line) => {
          const [c, d] = line.split(" ").map(Number);
          return { c: c!, d: d! };
        });
        problemStore.setInput(R!, C!, rows);
      }
    } catch {}
  };
  return (
    <div
      css={css`
        padding: 20px;
        display: flex;
        flex-direction: row;
        gap: 20px;
      `}
    >
      <Button
        variant="contained"
        color="inherit"
        css={css`
          background-color: var(--highlight);
        `}
        onClick={() => {
          navigator.clipboard
            .readText()
            .then((text) => {
              setText(text);
            })
            .catch((err) => {
              console.error("Failed to read clipboard content:", err);
            });
        }}
      >
        클립보드
      </Button>
      <Button
        variant="contained"
        color="inherit"
        css={css`
          background-color: var(--highlight);
        `}
        onClick={() => {
          setText("6 5 6\n2 3\n2 0\n4 2\n2 0\n2 0\n2 2");
        }}
      >
        예제1
      </Button>
      <Button
        css={css`
          background-color: var(--highlight);
        `}
        variant="contained"
        color="inherit"
        onClick={() => {
          setText("6 7 14\n2 3\n3 3\n4 0\n6 0\n6 0\n2 0\n6 2\n3 1\n3 1\n6 3\n3 1\n2 0\n5 3\n6 3");
        }}
      >
        예제2
      </Button>
      <Button
        css={css`
          background-color: var(--highlight);
        `}
        variant="contained"
        color="inherit"
        onClick={() => {
          setText(inputContent);
        }}
      >
        예제3
      </Button>
    </div>
  );
}
export default observer(ExampleButtons);
