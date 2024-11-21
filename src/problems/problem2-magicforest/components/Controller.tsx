import { css } from "@emotion/react";
import { observer } from "mobx-react";
import { useProblemStore } from "../store/ProblemStoreProvider";
import Input from "./Input";
import ExampleButtons from "./ExampleButtons";
import { Divider } from "@mui/material";
function Controller() {
  return (
    <>
      <ExampleButtons />
      <Divider />
      <Input />
    </>
  );
}

export default observer(Controller);
