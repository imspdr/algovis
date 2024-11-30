import { makeAutoObservable, runInAction } from "mobx";
import { sleep } from "@src/util";
import { fruit } from "./types";
import { circleCollision } from "./physics";

const EPSILON = 0.1;
const WIDTH = 1000;
const HEIGHT = 1600;
const MESS = 2000;
const INTERVAL = 20;
export const RADIUS = 20;

class ProblemStore {
  interval: any | undefined;
  t: number;
  effect: number;
  fruits: (fruit | undefined)[];
  renderFruits: (fruit | undefined)[];

  createFlag: boolean;
  stopFlag: boolean;
  loseFlag: boolean;

  // 힘
  gravity: number;
  collisionPower: number;
  lossRate: number;

  // 새 과일
  posX: number;
  nowRadius: number;
  nowFill: number;

  constructor() {
    // 한번 iter당 계산 횟수
    this.t = 3;
    // 추가 효과 계산 횟수
    this.effect = 2;
    this.fruits = [];
    this.renderFruits = [];

    this.interval = undefined;

    this.loseFlag = false;
    this.stopFlag = true;
    this.createFlag = false;

    this.gravity = 5;
    this.collisionPower = 20;
    this.lossRate = 0.1;

    this.posX = 500;
    this.nowRadius = RADIUS;
    this.nowFill = 0;

    makeAutoObservable(this);
  }

  setT = (value: number) => {
    runInAction(() => {
      this.t = value;
    });
  };
  setEffect = (value: number) => {
    runInAction(() => {
      this.effect = value;
    });
  };
  setGravity = (value: number) => {
    runInAction(() => {
      this.gravity = value;
    });
  };
  setCollisionPower = (value: number) => {
    runInAction(() => {
      this.collisionPower = value;
    });
  };
  setLossRate = (value: number) => {
    runInAction(() => {
      this.lossRate = value;
    });
  };

  setPosX = (pos: number) => {
    runInAction(() => {
      if (pos > WIDTH - this.nowRadius) {
        this.posX = WIDTH - this.nowRadius;
      } else if (pos < this.nowRadius) {
        this.posX = this.nowRadius;
      } else {
        this.posX = pos;
      }
    });
  };

  start = () => {
    if (this.loseFlag) this.reset();
    runInAction(() => {
      this.loseFlag = false;
      this.stopFlag = false;
    });
    this.interval = setInterval(() => {
      this.unitAction();
      runInAction(() => {
        this.renderFruits = this.fruits;
      });
    }, INTERVAL);
  };

  stop = () => {
    runInAction(() => {
      this.stopFlag = true;
      if (this.interval) clearInterval(this.interval);
    });
  };

  reset = () => {
    runInAction(() => {
      this.fruits = [];
      this.renderFruits = [];
    });
  };

  addFruit = async () => {
    if (this.loseFlag) {
      this.start();
    }
    if (this.createFlag || this.stopFlag) return;
    runInAction(() => {
      this.createFlag = true;
      this.fruits = [
        ...this.fruits,
        {
          radius: this.nowRadius,
          pos: {
            x: this.posX,
            y: this.nowRadius * 2,
          },
          velocity: { x: 0, y: 5 },
          accel: { x: 0, y: this.gravity },
          fillIndex: this.nowFill,
        },
      ];
      const rand = Math.random();
      if (rand < 0.4) {
        this.nowRadius = RADIUS * 1.4;
        this.nowFill = 1;
        this.setPosX(this.posX + 10);
      } else if (rand < 0.8) {
        this.nowRadius = RADIUS;
        this.nowFill = 0;
      } else {
        this.nowRadius = RADIUS * 1.4 * 1.4;
        this.nowFill = 2;
        this.setPosX(this.posX - 10);
      }
    });
    await sleep(500);
    runInAction(() => {
      this.createFlag = false;
    });
  };

  unitAction = () => {
    runInAction(() => {
      // unit move
      this.fruits = this.fruits.filter((fruit) => fruit);
      for (let n = 0; n < this.t; n++) {
        for (let i = 0; i < this.fruits.length; i++) {
          let fruit = this.fruits[i];
          if (!fruit) continue;
          let newX = fruit.pos.x + fruit.velocity.x / this.t;
          let newY = fruit.pos.y + fruit.velocity.y / this.t;
          let newVeloX = fruit.velocity.x + fruit.accel.x / this.t;
          let newVeloY = fruit.velocity.y + fruit.accel.y / this.t;
          if (newY > HEIGHT - fruit.radius) {
            newY = HEIGHT - fruit.radius;
            newVeloY = -this.lossRate * newVeloY;
          }
          if (newY < fruit.radius) {
            this.loseFlag = true;
            this.stop();
            newVeloY = 0;
          }
          if (newX > WIDTH - fruit.radius) {
            newX = WIDTH - fruit.radius;
            newVeloX = -this.lossRate * newVeloX;
          }
          if (newX < fruit.radius) {
            newX = fruit.radius;
            newVeloX = -this.lossRate * newVeloX;
          }
          if (Math.abs(newVeloX) < EPSILON) newVeloX = 0;
          if (Math.abs(newVeloY) < EPSILON) newVeloY = 0;

          this.fruits = this.fruits.map((fruit, index) => {
            if (index === i && fruit) {
              return {
                ...fruit,
                velocity: {
                  x: newVeloX,
                  y: newVeloY,
                },
                pos: {
                  x: newX,
                  y: newY,
                },
              };
            } else return fruit;
          });
          for (let k = 0; k < this.effect; k++) {
            for (let j = 0; j < this.fruits.length; j++) {
              if (!this.fruits[i] || !this.fruits[j] || j == i) continue;

              let newFruits = circleCollision(
                this.fruits[i]!,
                this.fruits[j]!,
                this.collisionPower,
                this.lossRate / MESS
              );
              this.fruits = this.fruits.map((fruit, index) => {
                if (index === i) {
                  return newFruits.fruit1;
                } else if (index === j) {
                  return newFruits.fruit2;
                } else return fruit;
              });
            }
          }
        }
      }
    });
  };
}

export default ProblemStore;
