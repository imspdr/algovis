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
  visitState: boolean[][] = observable(
    Array.from({ length: MAX_L + 3 }, () => observable(Array(MAX_L).fill(false)))
  );
  exitState: boolean[][] = observable(
    Array.from({ length: MAX_L + 3 }, () => observable(Array(MAX_L).fill(false)))
  );
  nowGolem: Golem | undefined;
  nowMan: Coord | undefined;
  nowScore: number;

  running: boolean;

  R: number;
  C: number;
  n: number;
  rows: Input[];

  delay: number;
  constructor() {
    this.delay = 100;
    this.R = 6;
    this.C = 5;

    this.rows = [
      { c: 2, d: 3 },
      { c: 2, d: 0 },
      { c: 4, d: 2 },
      { c: 2, d: 0 },
      { c: 2, d: 0 },
      { c: 2, d: 2 },
    ];
    this.n = 0;
    this.running = false;
    this.nowScore = 0;
    this.nowMan = undefined;
    this.nowGolem = undefined;
    makeAutoObservable(this);
  }
  refresh = () => {
    this.resetMap();
    runInAction(() => {
      this.nowScore = 0;
    });
  };
  setNowGolem = async (given: Golem) => {
    runInAction(() => {
      this.nowGolem = given;
      this.nowMan = {
        x: given.x,
        y: given.y,
      };
    });
    await sleep(this.delay);
  };
  setVisit = async (y: number, x: number, val: boolean) => {
    runInAction(() => {
      this.visitState[y]![x] = val;
    });
    await sleep(this.delay);
  };
  setExit = (y: number, x: number, val: boolean) => {
    runInAction(() => {
      this.exitState[y]![x] = val;
    });
  };
  setPos = (y: number, x: number, val: number) => {
    runInAction(() => {
      this.mapState[y]![x] = val;
    });
  };
  setInput = (R: number, C: number, rows: Input[]) => {
    this.refresh();
    runInAction(() => {
      this.R = R;
      this.C = C;
      this.rows = rows;
    });
  };
  setDelay = (delay: number) => {
    runInAction(() => {
      this.delay = delay;
    });
  };

  clearVisit = () => {
    runInAction(() => {
      for (let i = 0; i < this.R + 3; i++) {
        for (let j = 0; j < this.C; j++) {
          this.setVisit(i, j, false);
        }
      }
    });
  };
  clearPos = () => {
    runInAction(() => {
      for (let i = 0; i < this.R + 3; i++) {
        for (let j = 0; j < this.C; j++) {
          this.setPos(i, j, 0);
        }
      }
    });
  };
  clearExit = () => {
    runInAction(() => {
      for (let i = 0; i < this.R + 3; i++) {
        for (let j = 0; j < this.C; j++) {
          this.setExit(i, j, false);
        }
      }
    });
  };

  isNowGolem = (y: number, x: number) => {
    if (!this.nowGolem) return false;
    return Math.abs(y - this.nowGolem.y) + Math.abs(x - this.nowGolem.x) <= 1;
  };
  inRange = (y: number, x: number) => {
    return 3 <= y && y < this.R + 3 && 0 <= x && x < this.C;
  };
  resetMap = () => {
    this.clearPos();
    this.clearVisit();
    this.clearExit();
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
  down = async (y: number, x: number, d: number, id: number) => {
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
      await this.down(y + 1, x, d, id);
    } else if (this.canGo(y + 1, x - 1)) {
      await this.setNowGolem({
        y: y,
        x: x - 1,
        dx: x - 1 + dx[(d + 3) % 4]!,
        dy: y + dy[(d + 3) % 4]!,
      });
      await this.down(y + 1, x - 1, (d + 3) % 4, id);
    } else if (this.canGo(y + 1, x + 1)) {
      await this.setNowGolem({
        y: y,
        x: x + 1,
        dx: x + 1 + dx[(d + 1) % 4]!,
        dy: y + dy[(d + 1) % 4]!,
      });
      await this.down(y + 1, x + 1, (d + 1) % 4, id);
    } else {
      if (!this.inRange(y - 1, x - 1) || !this.inRange(y + 1, x + 1)) {
        this.resetMap();
      } else {
        this.setPos(y, x, id);
        for (let k = 0; k < 4; k++) {
          this.setPos(y + dy[k]!, x + dx[k]!, id);
          if (k == d) {
            this.setExit(y + dy[k]!, x + dx[k]!, true);
          }
        }

        this.clearVisit();
        let score = await this.bfs(y, x);
        this.clearVisit();
        runInAction(() => {
          this.nowScore += score - 2;
        });
      }
    }
  };

  bfs = async (y: number, x: number) => {
    let result = y;
    const arr: Coord[] = [
      {
        x: x,
        y: y,
      },
    ];
    await this.setVisit(y, x, true);
    while (arr.length > 0) {
      let curPoint = arr.shift();
      if (curPoint) {
        for (let k = 0; k < 4; k++) {
          let newPoint = {
            x: curPoint.x + dx[k]!,
            y: curPoint.y + dy[k]!,
          };
          if (
            this.inRange(newPoint.y, newPoint.x) &&
            !this.visitState[newPoint.y]![newPoint.x] &&
            (this.mapState[newPoint.y]![newPoint.x] == this.mapState[curPoint.y]![curPoint.x] ||
              (this.mapState[newPoint.y]![newPoint.x]! > 0 &&
                this.exitState[curPoint.y]![curPoint.x]))
          ) {
            arr.push(newPoint);
            await this.setVisit(newPoint.y, newPoint.x, true);
            result = Math.max(result, newPoint.y);
            if (result == this.R + 2) {
              await sleep(this.delay * 2);
              return result;
            }
          }
        }
      }
    }
    await sleep(this.delay * 2);
    return result;
  };
  main = async () => {
    for (let i = 0; i < this.rows.length; i++) {
      if (!this.running) {
        return;
      }
      runInAction(() => {
        this.n = i + 1;
      });
      await this.down(1, this.rows[i]!.c - 1, this.rows[i]!.d, i + 1);
      runInAction(() => {
        this.nowGolem = undefined;
        this.nowMan = undefined;
      });
    }
  };
}

export default ProblemStore;
