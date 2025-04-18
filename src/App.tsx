import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Typography } from "@mui/material";
import { css } from "@emotion/react";
import { unselectable } from "@src/util";
import ThemeToggle from "./common/ThemeToggle";
import HomePage from "./common/HomePage";

type CodingTest = {
  name: string;
  desc: string;
  url: string;
};

export const codingTests: CodingTest[] = [
  {
    url: "nqueen",
    name: "n-queen 문제",
    desc: "백트래킹으로 해결하는 n-queen 문제",
  },
  {
    url: "magicforest",
    name: "마법의 숲 탐색",
    desc: "2024 삼성 SW 역량테스트 마법의 숲 탐색",
  },
  {
    url: "sort",
    name: "정렬 시각화",
    desc: "정렬 알고리즘 시각화",
  },
  {
    url: "clock",
    name: "아날로그 시계",
    desc: "[PCCP 기출문제] 3번 아날로그 시계",
  },
  {
    url: "suika",
    name: "수박 게임",
    desc: "수박 게임 직접 구현해보기",
  },
  {
    url: "brick",
    name: "brick",
    desc: "Amazing brick 구현해보기",
  },
];

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);

  const Problem1Page = lazy(() => import("@src/problems/problem1-nqueen/ProblemMain"));
  const Problem2Page = lazy(() => import("@src/problems/problem2-magicforest/ProblemMain"));
  const Problem3Page = lazy(() => import("@src/problems/problem3-sort/ProblemMain"));
  const Problem4Page = lazy(() => import("@src/problems/problem4-clock/ProblemMain"));
  const Problem5Page = lazy(() => import("@src/problems/problem5-suika/ProblemMain"));
  const Problem6Page = lazy(() => import("@src/problems/problem6-brick/ProblemMain"));

  const resize = () => {
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    addEventListener("resize", resize);
    return () => {
      removeEventListener("resize", resize);
    };
  }, []);
  const url = window.location.href.split("/");
  const label = codingTests.find((val) => val.url === url[url.length - 1]);
  const toggleTheme = () => {
    const styles = getComputedStyle(document.body);

    //light
    const black = styles.getPropertyValue("--black");
    const white = styles.getPropertyValue("--white");
    const light = styles.getPropertyValue("--light");
    const mint = styles.getPropertyValue("--mint");
    const pink = styles.getPropertyValue("--pink");
    const scrollColorBlack = styles.getPropertyValue("--scroll-color-black");

    //dark
    const darkBlack = styles.getPropertyValue("--dark-black");
    const darkWhite = styles.getPropertyValue("--dark-white");
    const darkMint = styles.getPropertyValue("--dark-mint");
    const darkPink = styles.getPropertyValue("--dark-pink");
    const scrollColorWhite = styles.getPropertyValue("--scroll-color-white");

    const docEl = document.documentElement;
    if (darkMode) {
      docEl.style.setProperty("--background", light);
      docEl.style.setProperty("--foreground", black);
      docEl.style.setProperty("--scroll-color", scrollColorBlack);
      docEl.style.setProperty("--highlight", mint);
      docEl.style.setProperty("--paper", white);
      docEl.style.setProperty("--warning", pink);
    } else {
      docEl.style.setProperty("--background", darkBlack);
      docEl.style.setProperty("--foreground", darkWhite);
      docEl.style.setProperty("--scroll-color", scrollColorWhite);
      docEl.style.setProperty("--highlight", darkMint);
      docEl.style.setProperty("--paper", black);
      docEl.style.setProperty("--warning", darkPink);
    }
    setDarkMode((v) => !v);
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 48px;

            min-width: 300px;
            padding: 0px 10px;
            ${unselectable}
          `}
        >
          <Typography onClick={() => navigate("/")}>
            {!!!label ? "IMSPDR / algovis" : `IMSPDR / algovis / ${label.name}`}
          </Typography>
          <ThemeToggle onClick={toggleTheme} isDark={darkMode} />
        </div>
        <div
          css={css`
            position: absolute;
            top: 48px;
            width: 100%;
            height: calc(${height}px - 48px);
            ${unselectable}
          `}
        >
          <Suspense
            fallback={
              <div
                css={css`
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                `}
              >
                LOADING
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/nqueen" element={<Problem1Page />} />
              <Route path="/magicforest" element={<Problem2Page />} />
              <Route path="/sort" element={<Problem3Page />} />
              <Route path="/clock" element={<Problem4Page />} />
              <Route path="/suika" element={<Problem5Page />} />
              <Route path="/brick" element={<Problem6Page />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </>
    </ThemeProvider>
  );
}
