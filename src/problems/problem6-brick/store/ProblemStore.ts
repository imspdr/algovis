import { runInAction, makeAutoObservable } from "mobx";

type twod = {
  x: number;
  y: number;
};

type wall = {
  y: number;
  hole: number;
  obs: twod[];
};

const WALLGAP = 30;
const INTERVAL = 20;

const rectCrashCheck = (x: number, y: number, r: number, cx: number, cy: number, R: number) => {
  const yGap = Math.abs(y - cy);
  const xGap = Math.abs(x - cx);
  if (xGap < R) {
    if (yGap < r + R) {
      return true;
    }
  } else if (yGap < R) {
    if (xGap < r + R) {
      return true;
    }
  } else if (xGap + yGap < 2 * R + r) {
    return true;
  }
  return false;
};

class ProblemStore {
  holeWidth: number;

  interval: any;
  radius: number;

  width: number;
  height: number;

  brick: {
    pos: twod;
    velocity: twod;
    accel: twod;
  };
  activeWalls: wall[];
  nowHeight: number;
  wallHeight: number;

  createFlag: boolean;
  stopFlag: boolean;
  loseFlag: boolean;
  count: number;

  upperPower: number;
  horizontalPower: number;
  gravity: number;

  constructor() {
    this.count = 0;
    this.holeWidth = 10;

    this.interval = undefined;
    this.radius = 10;
    this.height = 100;
    this.width = 100;

    this.activeWalls = [];
    this.wallHeight = 0;
    this.nowHeight = 0;
    this.brick = {
      pos: {
        x: 100 / 2,
        y: 100 / 2,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      accel: {
        x: 0,
        y: 0.1,
      },
    };

    this.loseFlag = false;
    this.stopFlag = true;
    this.createFlag = false;

    this.gravity = -0.45;
    this.upperPower = 10;
    this.horizontalPower = 1;

    makeAutoObservable(this);
  }
  setView = () => {
    const parent = document.getElementById("brick-frame");
    if (parent) {
      runInAction(() => {
        this.width = parent.offsetWidth;
        this.height = parent.offsetHeight;
      });
    }
  };
  setHoleWidth = (v: number) => {
    runInAction(() => {
      this.holeWidth = v;
    });
  };
  setGravity = (v: number) => {
    runInAction(() => {
      this.gravity = -v;
    });
  };
  setUpperPower = (v: number) => {
    runInAction(() => {
      this.upperPower = v;
    });
  };
  setHorizontalPower = (v: number) => {
    runInAction(() => {
      this.horizontalPower = v;
    });
  };

  getViewY = (y: number) => {
    return this.height / 2 - y + this.nowHeight;
  };

  newWall = (i: number, start?: boolean) => {
    const holePos = this.radius * 6 + Math.random() * (this.width - this.radius * 12);
    const y = this.wallHeight + i * WALLGAP * this.radius;
    return {
      y: y,
      hole: holePos,
      obs: !start
        ? [
            {
              x: holePos + (0.5 - Math.random()) * (this.radius * (this.holeWidth + 2)),
              y: y + this.radius * 6 + ((WALLGAP * this.radius) / 6) * Math.random(),
            },
            {
              x: holePos + (0.5 - Math.random()) * (this.radius * (this.holeWidth + 2)),
              y: y - this.radius * 6 - ((WALLGAP * this.radius) / 6) * Math.random(),
            },
          ]
        : [
            {
              x: holePos + (0.5 - Math.random()) * (this.radius * (this.holeWidth + 2)),
              y: y + this.radius * 6 + ((WALLGAP * this.radius) / 6) * Math.random(),
            },
          ],
    };
  };
  initWall = () => {
    runInAction(() => {
      this.count = 0;
      this.nowHeight = this.height / 2;
      this.wallHeight = this.nowHeight + this.radius * WALLGAP * 2;
      this.activeWalls = [...Array(2)].map((_, i) => {
        return this.newWall(i, i == 0);
      });
    });
  };
  generateWall = () => {
    runInAction(() => {
      this.activeWalls = [...this.activeWalls.slice(-3), this.newWall(2)];
      this.wallHeight += this.radius * WALLGAP;
    });
  };

  initBrick = () => {
    runInAction(() => {
      this.brick = {
        pos: {
          x: this.width / 2,
          y: this.height / 2,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        accel: {
          x: 0,
          y: this.gravity,
        },
      };
    });
  };
  left = () => {
    runInAction(() => {
      this.brick = {
        ...this.brick,
        velocity: {
          y: this.upperPower,
          x: -this.horizontalPower,
        },
      };
    });
  };
  right = () => {
    runInAction(() => {
      this.brick = {
        ...this.brick,
        velocity: {
          y: this.upperPower,
          x: this.horizontalPower,
        },
      };
    });
  };

  start = () => {
    if (!this.stopFlag) return;
    if (this.loseFlag) this.reset();
    runInAction(() => {
      this.loseFlag = false;
      this.stopFlag = false;
    });
    this.interval = setInterval(() => {
      this.unitAction();
    }, INTERVAL);
  };

  stop = () => {
    runInAction(() => {
      this.stopFlag = true;
      if (this.interval) clearInterval(this.interval);
    });
  };

  reset = () => {
    if (this.interval) clearInterval(this.interval);
    this.setView();
    this.initBrick();
    this.initWall();
  };

  checkCrash = (x: number, y: number) => {
    for (let i = 0; i < this.activeWalls.length; i++) {
      let nowWall = this.activeWalls[i];
      if (nowWall) {
        if (Math.abs(nowWall.y - y) > (WALLGAP * this.radius) / 2) continue;
        let obsCheck = this.activeWalls[i]!.obs.reduce((a, c) => {
          return rectCrashCheck(x, y, this.radius, c.x, c.y, this.radius) || a;
        }, false);
        if (obsCheck) return true;
        const yGap = Math.abs(nowWall.y - y);
        if (yGap < this.radius * 2.5) {
          if (
            x > nowWall.hole + (this.holeWidth / 2) * this.radius ||
            x < nowWall.hole - (this.holeWidth / 2) * this.radius
          ) {
            return true;
          } else if (
            rectCrashCheck(
              x,
              y,
              this.radius,
              nowWall.hole + ((this.holeWidth + 3) / 2) * this.radius,
              nowWall.y,
              1.5 * this.radius
            ) ||
            rectCrashCheck(
              x,
              y,
              this.radius,
              nowWall.hole - ((this.holeWidth + 3) / 2) * this.radius,
              nowWall.y,
              1.5 * this.radius
            )
          )
            return true;
        }
      }
    }
    return false;
  };
  unitAction = () => {
    runInAction(() => {
      let newX = Math.max(
        this.radius,
        Math.min(this.brick.pos.x + this.brick.velocity.x, this.width - this.radius)
      );
      let newY = this.brick.pos.y + this.brick.velocity.y;

      if (newY > this.nowHeight) {
        this.nowHeight = newY;
      }

      let newVelocityX = this.brick.velocity.x + this.brick.accel.x;
      let newVelocityY = this.brick.velocity.y + this.brick.accel.y;

      this.brick = {
        ...this.brick,
        pos: {
          x: newX,
          y: newY,
        },
        velocity: {
          x: newVelocityX,
          y: newVelocityY,
        },
      };

      // generate wall
      if (newY > this.wallHeight) {
        this.generateWall();
        this.count += 1;
      }

      // check gameover
      if (newY - this.nowHeight < -this.height / 2 || this.checkCrash(newX, newY)) {
        this.loseFlag = true;
        this.stop();
      }
    });
  };
}

export default ProblemStore;
