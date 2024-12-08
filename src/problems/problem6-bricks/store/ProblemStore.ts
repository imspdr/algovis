import { runInAction, makeAutoObservable } from "mobx";

type twod = {
  x: number;
  y: number;
};

const INTERVAL = 20;

class ProblemStore {
  interval: any;
  radius: number;

  _width: number;
  _height: number;

  brick: {
    pos: twod;
    velocity: twod;
    accel: twod;
  };
  activeWalls: number[];
  nowHeight: number;

  createFlag: boolean;
  stopFlag: boolean;
  loseFlag: boolean;

  upperPower: number;
  horizontalPower: number;
  gravity: number;

  constructor() {
    this.interval = undefined;
    this.radius = 10;
    this._height = 100;
    this._width = 100;

    this.activeWalls = [...new Array(5).map((_, i) => this.radius * 5 + i * this.radius * 15)];
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

    this.gravity = -0.5;
    this.upperPower = 12;
    this.horizontalPower = 3;

    makeAutoObservable(this);
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  set width(given: number) {
    this._width = given;
  }
  set height(given: number) {
    this._height = given;
  }
  getViewY = (y: number) => {
    return this.height / 2 - y + this.nowHeight;
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
    this.initBrick();
    this.nowHeight = this.height / 2;
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

      // check gameover
      if (newY - this.nowHeight < -this.height / 2) {
        this.loseFlag = true;
        this.stop();
      }
    });
  };
}

export default ProblemStore;
