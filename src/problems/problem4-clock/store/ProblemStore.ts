import { makeAutoObservable, runInAction } from "mobx";

class ProblemStore {
  count: number;
  running: boolean;
  h: number;
  m: number;
  s: number;
  startTime: number;
  endTime: number;
  constructor() {
    this.count = 0;
    this.running = false;
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.startTime = 0;
    this.endTime = 23 * 60 * 60 + 59 * 60 + 59;
    makeAutoObservable(this);
  }
  setCount(value: number) {
    runInAction(() => {
      this.count = value;
    });
  }
  setRunning(value: boolean) {
    runInAction(() => {
      this.running = value;
    });
  }
}

export default ProblemStore;
