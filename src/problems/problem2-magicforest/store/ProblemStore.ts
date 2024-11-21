import { makeAutoObservable, observable, runInAction } from "mobx";
import { sleep } from "@src/util";

type Coord = {
  x: number;
  y: number;
};
type Golem = Coord & {
  dx: number;
  dy: number;
};
type Input = {
  c: number;
  d: number;
};

const MAX_L = 70;
const dy = [-1, 0, 1, 0];
const dx = [0, 1, 0, -1];

class ProblemStore {
  mapState: number[][] = observable(
    Array.from({ length: MAX_L + 3 }, () => observable(Array(MAX_L).fill(0)))
  );
  nowGolem: Golem | undefined;
  nowMan: Coord | undefined;
  nowScore: number;

  running: boolean;

  R: number;
  C: number;
  K: number;
  rows: Input[];

  constructor() {
    this.R = 6;
    this.C = 5;
    this.K = 6;

    this.rows = [
      { c: 2, d: 3 },
      { c: 2, d: 0 },
      { c: 4, d: 2 },
      { c: 2, d: 0 },
      { c: 2, d: 0 },
      { c: 2, d: 2 },
    ];

    this.running = false;
    this.nowScore = 0;
    this.nowMan = undefined;
    this.nowGolem = undefined;
    makeAutoObservable(this);
  }

  setNowGolem = async (given: Golem) => {
    runInAction(() => {
      this.nowGolem = given;
      this.nowMan = {
        x: given.x,
        y: given.y,
      };
    });
    await sleep(500);
  };
  setPos = async (y: number, x: number, val: number) => {
    runInAction(() => {
      this.mapState[y]![x] = val;
    });
    await sleep(500);
  };

  isNowGolem = (y: number, x: number) => {
    if (!this.nowGolem) return false;
    return Math.abs(y - this.nowGolem.y) + Math.abs(x - this.nowGolem.x) <= 1;
  };
  inRange = (y: number, x: number) => {
    return 3 <= y && y < this.R + 3 && 0 <= x && x < this.C;
  };
  resetMap = () => {
    for (let i = 0; i < this.R + 3; i++) {
      for (let j = 0; j < this.C; j++) {
        this.setPos(i, j, 0);
      }
    }
    this.nowGolem = undefined;
    this.nowMan = undefined;
  };
  canGo = (y: number, x: number) => {
    let ret = 0 <= x - 1 && x + 1 < this.C && y + 1 < this.R + 3;
    ret =
      ret &&
      this.mapState[y - 1]![x - 1] == 0 &&
      this.mapState[y - 1]![x] == 0 &&
      this.mapState[y - 1]![x + 1] == 0;
    ret =
      ret &&
      this.mapState[y]![x - 1] == 0 &&
      this.mapState[y]![x] == 0 &&
      this.mapState[y]![x + 1] == 0;
    ret = ret && this.mapState[y + 1]![x] == 0;
    return ret;
  };
  down = async (y: number, x: number, d: number) => {
    if (!this.running) {
      return;
    }
    await this.setNowGolem({
      y: y,
      x: x,
      dx: x + dx[d]!,
      dy: y + dy[d]!,
    });

    if (this.canGo(y + 1, x)) {
      await this.down(y + 1, x, d);
    } else if (this.canGo(y + 1, x - 1)) {
      await this.setNowGolem({
        y: y,
        x: x - 1,
        dx: x - 1 + dx[(d + 3) % 4]!,
        dy: y + dy[(d + 3) % 4]!,
      });
      await this.down(y + 1, x - 1, (d + 3) % 4);
    } else if (this.canGo(y + 1, x + 1)) {
      await this.setNowGolem({
        y: y,
        x: x + 1,
        dx: x + 1 + dx[(d + 1) % 4]!,
        dy: y + dy[(d + 1) % 4]!,
      });
      await this.down(y + 1, x + 1, (d + 1) % 4);
    } else {
      if (!this.inRange(y - 1, x - 1) || !this.inRange(y + 1, x + 1)) {
        this.resetMap();
      } else {
        this.setPos(y, x, 1);
        for (let k = 0; k < 4; k++) {
          this.setPos(y + dy[k]!, x + dx[k]!, k == d ? 2 : 1);
        }
      }
    }
  };
  main = async () => {
    for (let i = 0; i < this.rows.length; i++) {
      if (!this.running) {
        return;
      }
      await this.down(1, this.rows[i]!.c - 1, this.rows[i]!.d);
    }
    this.resetMap();
  };
}

export default ProblemStore;
