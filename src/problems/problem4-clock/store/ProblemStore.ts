import { makeAutoObservable, runInAction } from "mobx";
import { sleep } from "@src/util";

export const FULL = 60 * 60 * 12;

type hms = {
  h: number;
  m: number;
  s: number;
};
const getSecond = (input: hms) => {
  return input.h * 60 * 60 + input.m * 60 + input.s;
};
class ProblemStore {
  count: number;
  running: boolean;
  h: number;
  m: number;
  s: number;
  sm: boolean;
  sh: boolean;
  smh: boolean;
  startTime: hms;
  endTime: hms;
  delay: number;
  constructor() {
    this.count = 0;
    this.running = false;
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.smh = false;
    this.sm = false;
    this.sh = false;
    this.delay = 10;
    this.startTime = {
      h: 0,
      m: 0,
      s: 0,
    };
    this.endTime = {
      h: 23,
      m: 59,
      s: 59,
    };
    makeAutoObservable(this);
  }
  setCount(value: number) {
    runInAction(() => {
      this.count = value;
    });
  }
  setDelay(value: number) {
    runInAction(() => {
      this.delay = value;
    });
  }
  setRunning(value: boolean) {
    runInAction(() => {
      this.running = value;
    });
  }
  setStartTime(h: number, m: number, s: number) {
    runInAction(() => {
      this.startTime = {
        h: h,
        m: m,
        s: s,
      };
      this.h = (h * 60 * 60 + m * 60 + s) % FULL;
      this.m = (m * 60 * 12 + s * 12) % FULL;
      this.s = (s * 60 * 12) % FULL;
    });
  }
  setEndTime(h: number, m: number, s: number) {
    runInAction(() => {
      this.endTime = {
        h: h,
        m: m,
        s: s,
      };
    });
  }
  refresh() {
    runInAction(() => {
      const { h, m, s } = this.startTime;
      this.h = (h * 60 * 60 + m * 60 + s) % FULL;
      this.m = (m * 60 * 12 + s * 12) % FULL;
      this.s = (s * 60 * 12) % FULL;
    });
    this.setRunning(false);
    this.setCount(0);
  }

  tictoc = async () => {
    let newH = this.h + 1;
    let newM = this.m + 12;
    let newS = this.s + 12 * 60;
    runInAction(() => {
      if (this.s < this.h && newS >= newH) {
        this.sh = true;
        this.count++;
      }
    });
    runInAction(() => {
      if (this.s < this.m && newS >= newM) {
        this.sm = true;
        this.count++;
      }
    });
    runInAction(() => {
      this.s = newS % FULL;
      this.m = newM % FULL;
      this.h = newH % FULL;
      if (this.s == this.m && this.h == this.m) {
        this.smh = true;
        this.count -= 1;
      }
    });
    if (this.sh) {
      await sleep(300);
      runInAction(() => {
        this.sh = false;
      });
    }
    if (this.sm) {
      await sleep(300);
      runInAction(() => {
        this.sm = false;
        this.smh = false;
      });
    }
    await sleep(this.delay);
  };
  start = async () => {
    this.setRunning(true);
    if (this.m == this.s && this.h == this.s) this.setCount(this.count + 1);
    for (let i = 0; i < getSecond(this.endTime) - getSecond(this.startTime); i++) {
      await this.tictoc();
      if (!this.running) break;
    }
    this.setRunning(false);
  };
}

export default ProblemStore;
