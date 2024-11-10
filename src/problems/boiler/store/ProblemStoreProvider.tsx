import React, { createContext, useContext, useMemo } from "react";
import ProblemStore from "./ProblemStore";

const ProblemContext = createContext<ProblemStore | null>(null);

export const ProblemStoreProvider = ({ children }: { children: React.ReactElement }) => {
  const store = useMemo(() => {
    return new ProblemStore();
  }, []);

  return <ProblemContext.Provider value={store}> {children} </ProblemContext.Provider>;
};

export const useProblemStore = () => {
  const context = useContext(ProblemContext);
  if (context === null) {
    throw Error("provider is null");
  }
  return context;
};
