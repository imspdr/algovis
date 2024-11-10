import { makeAutoObservable } from "mobx";

class ProblemStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default ProblemStore;
