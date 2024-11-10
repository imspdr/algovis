import { useState } from "react";
import { css } from "@emotion/react";
import { unselectable } from "@src/util";

export default function LeftTab(props: {
  tabs: {
    label: string;
    comp: JSX.Element;
  }[];
}) {
  const [nowTab, setNowTab] = useState(0);
  const TABWIDTH = 120;
  const TABHEIGHT = 50;
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 5px;
        height: calc(100% - 10px);
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
        `}
      >
        {props.tabs.map((tab, index) => {
          return (
            <div
              css={css`
                width: ${TABWIDTH}px;
                height: ${TABHEIGHT}px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--paper);
                border-radius: 10px 10px 0px 0px;
                ${nowTab === index
                  ? "border: 1px solid; border-bottom-width: 0px;"
                  : "border: 0px solid; border-bottom-width: 1px; background-color: var(--background)"}
                ${unselectable}
              `}
              onClick={() => setNowTab(index)}
            >
              {tab.label}
            </div>
          );
        })}
        <div
          css={css`
            width: calc(100% - ${props.tabs.length * TABWIDTH}px);
            height: ${TABHEIGHT}px;
            border: 0px solid;
            border-bottom-width: 1px;
            ${unselectable}
          `}
        />
      </div>
      <div
        css={css`
          padding: 10px;
          width: calc(100% - 21px);
          height: calc(100% - ${TABHEIGHT}px - 20px);
          border: 1px solid;
          border-top-width: 0px;
          border-radius: 0px 0px 10px 10px;
          background-color: var(--paper);
          overflow: auto;
        `}
      >
        {props.tabs[nowTab]!.comp}
      </div>
    </div>
  );
}
