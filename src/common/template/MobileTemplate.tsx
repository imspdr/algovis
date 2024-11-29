import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import LeftTab from "./LeftTab";
import ViewerTemplate from "./ViewerTemplate";
import Footer from "./Footer";

export default function MobileTemplate(props: {
  problem: JSX.Element;
  controller: JSX.Element;
  viewer: JSX.Element;
  onStart: () => Promise<boolean> | boolean | void;
  onStop: () => void;
  onRefresh: () => void;
}) {
  const [tabState, setTabState] = useState(true);

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          min-width: 300px;
          width: 100%;
          height: calc(100% - 55px);
        `}
      >
        {tabState ? (
          <ViewerTemplate viewer={props.viewer} />
        ) : (
          <LeftTab
            tabs={[
              {
                label: "문제 설명",
                comp: props.problem,
              },
              {
                label: "예제 입력",
                comp: props.controller,
              },
            ]}
          />
        )}
      </div>
      <Footer
        onStart={props.onStart}
        onRefresh={props.onRefresh}
        onStop={props.onStop}
        tab={tabState}
        onChange={() => setTabState((v) => !v)}
      />
    </>
  );
}
