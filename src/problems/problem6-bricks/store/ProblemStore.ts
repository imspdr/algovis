import { runInAction, makeAutoObservable } from "mobx";

type twod = {
  x: number;
  y: number;
};

const WIDTH = 1000;
const HEIGHT = 1600;
const INTERVAL = 20;

class ProblemStore {
  interval: any;
  t: number;

  brick: {
    pos: twod;
    velocity: twod;
    accel: twod;
  };

  createFlag: boolean;
  stopFlag: boolean;
  loseFlag: boolean;

  gravity: number;

  constructor() {
    this.interval = undefined;
    this.t = 3;

    this.brick = {
      pos: {
        x: 500,
        y: 500,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      accel: {
        x: 0,
        y: 9,
      },
    };

    this.loseFlag = false;
    this.stopFlag = true;
    this.createFlag = false;

    this.gravity = 9;

    makeAutoObservable(this);
  }
  left = () => {
    runInAction(() => {});
  };
  right = () => {
    runInAction(() => {});
  };

  start = () => {
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
    runInAction(() => {});
  };

  unitAction = () => {
    runInAction(() => {
      let newX = this.brick.pos.x + this.brick.velocity.x;
      let newY = this.brick.pos.y + this.brick.velocity.y;
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
    });
  };
}

export default ProblemStore;
