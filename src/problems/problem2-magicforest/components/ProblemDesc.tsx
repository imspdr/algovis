import { css } from "@emotion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import readmeContent from "./README.md";

export default function ProblemDesc() {
  return (
    <div
      css={css`
        padding: 0px 20px;
      `}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
    </div>
  );
}
