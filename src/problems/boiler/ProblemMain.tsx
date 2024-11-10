import { ProblemStoreProvider } from "./store/ProblemStoreProvider";
import ProblemTemplate from "./ProblemTemplate";

export default function ProblemPage() {
  return (
    <ProblemStoreProvider>
      <ProblemTemplate />
    </ProblemStoreProvider>
  );
}
