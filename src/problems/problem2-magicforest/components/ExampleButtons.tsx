import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import { Button } from "@mui/material";
import inputContent from "./input.txt";

function ExampleButtons() {
  const problemStore = useProblemStore();
  const setText = (input: string) => {
    const twoNumber = /^(\d+)\s+(\d+)/;
    const lines = input.trim().split("\n");
    if (lines.length > 1 && lines[0]) {
      if (twoNumber.test(lines[0])) {
        const [R, C] = lines[0]!.split(" ").map(Number);
        if (!R || !C || R < 5 || C < 5) return;

        const rows: { c: number; d: number }[] = [];

        lines.slice(1).forEach((line) => {
          if (twoNumber.test(line)) {
            const [c, d] = line.split(" ").slice(0, 2).map(Number);
            rows.push({ c: c!, d: d! });
          }
        });
        problemStore.setInput(R!, C!, rows);
      }
    }
  };
  const buttonCss = css`
    width: 90px;
    background-color: var(--highlight);
  `;
  return (
    <div
      css={css`
        padding: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
      `}
    >
      <Button
        variant="contained"
        color="inherit"
        css={buttonCss}
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
        css={buttonCss}
        onClick={() => {
          setText("6 5 6\n2 3\n2 0\n4 2\n2 0\n2 0\n2 2");
        }}
      >
        예제1
      </Button>
      <Button
        css={buttonCss}
        variant="contained"
        color="inherit"
        onClick={() => {
          setText("6 7 14\n2 3\n3 3\n4 0\n6 0\n6 0\n2 0\n6 2\n3 1\n3 1\n6 3\n3 1\n2 0\n5 3\n6 3");
        }}
      >
        예제2
      </Button>
      <Button
        css={buttonCss}
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
