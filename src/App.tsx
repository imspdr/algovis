import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ThemeToggle from "@src/components/common/ThemeToggle";
import { css } from "@emotion/react";
import { unselectable } from "@src/util";

const urlMap = [
  {
    url: "magicforestsearch",
    label: "마법의 숲 탐색",
  },
];
const theme = createTheme({});

export default function App() {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <div>이루어진 마법의 숲을 탐색하려고 합니다.</div>
    </ThemeProvider>
  );
}
