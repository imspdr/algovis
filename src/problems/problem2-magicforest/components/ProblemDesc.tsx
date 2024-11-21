import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import readmeContent from "./README.md";

export default function ProblemDesc() {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
    </div>
  );
}
