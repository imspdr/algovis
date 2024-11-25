import { makeAutoObservable, runInAction } from "mobx";
import { sleep } from "@src/util";

export type bar = {
  state: string;
  value: number;
};

const generateArray = (length: number) => {
  let ret: bar[] = [];
  for (let i = 0; i < length; i++) {
    let randomVal = Math.round(Math.random() * 1000);
    if (!randomVal) randomVal = 0.1;
    ret.push({
      state: "normal",
      value: randomVal,
    });
  }
  return ret;
};

export const sortAlgos = [
  {
    label: "Merge Sort",
    value: "merge",
  },
  {
    label: "Bubble Sort",
    value: "bubble",
  },
  {
    label: "Quick Sort",
    value: "quick",
  },
];

class ProblemStore {
  compareCount: number;
  selectedAlgo: string;
  delay: number;
  arrayLength: number;
  running: boolean;
  numberArray: bar[];
  constructor() {
    this.compareCount = 0;
    this.delay = 10;
    this.arrayLength = 300;
    this.numberArray = generateArray(this.arrayLength);
    this.running = false;

    this.selectedAlgo = "merge";

    makeAutoObservable(this);
  }
  setCompareCount(num: number) {
    runInAction(() => {
      this.compareCount = num;
    });
  }
  setNumberArray = async (numArray: bar[]) => {
    runInAction(() => {
      this.numberArray = numArray;
    });
    await sleep(this.delay);
  };
  setRunning(bool: boolean) {
    runInAction(() => {
      this.running = bool;
    });
  }
  setSelectedAlgo(algo: string) {
    runInAction(() => {
      this.selectedAlgo = algo;
    });
    this.reset();
  }
  setArrayLength(length: number) {
    runInAction(() => {
      this.arrayLength = length;
    });
    this.reset();
  }
  setDelay(time: number) {
    runInAction(() => {
      this.delay = time;
    });
  }

  runSort = async () => {
    this.setRunning(true);
    switch (this.selectedAlgo) {
      case "bubble":
        await this.bubbleSort();
        return;
      case "quick":
        await this.quickSort();
        return;

      case "merge":
      default:
        await this.mergeSort();
        return;
    }
  };
  reset = () => {
    this.setRunning(false);
    this.setCompareCount(0);
    this.setNumberArray(generateArray(this.arrayLength));
  };

  setState = (indexes: number[], state: string) => {
    runInAction(() => {
      indexes.forEach((i) => {
        if (this.numberArray[i]) {
          let val = this.numberArray[i]?.value;
          if (val)
            this.numberArray[i] = {
              value: val,
              state: state,
            };
        }
      });
    });
  };
  setValues = (indexes: number[], values: number[]) => {
    runInAction(() => {
      indexes.forEach((ind, i) => {
        let ithVal = values[i];
        if (ithVal) {
          this.numberArray[ind] = {
            state: "normal",
            value: ithVal,
          };
        }
      });
    });
  };

  swap = async (i: number, j: number) => {
    this.setState([i, j], "moving");
    await sleep(this.delay);
    const ival = this.numberArray[i]?.value;
    const jval = this.numberArray[j]?.value;
    if (ival && jval) {
      this.setValues([i, j], [jval, ival]);
    }
  };
  compare = async (i: number, j: number) => {
    this.setState([i, j], "compare");
    await sleep(this.delay);
    this.setState([i, j], "normal");
    this.setCompareCount(this.compareCount + 1);
  };

  // 버블
  bubbleSort = async () => {
    for (let i = 0; i < this.numberArray.length - 1; i++) {
      for (let j = 0; j < this.numberArray.length - 1 - i; j++) {
        if (!this.running) {
          return;
        }
        await this.compare(j, j + 1);
        let val1 = this.numberArray[j]?.value;
        let val2 = this.numberArray[j + 1]?.value;
        if (val1 && val2) {
          if (val1 > val2) await this.swap(j, j + 1);
        }
      }
    }
    this.setRunning(false);
  };

  // 머지
  innerMerge = async (start: number, end: number) => {
    if (!this.running) return;
    const middle = Math.round((start + end) / 2);
    const nowIndexes = [...new Array(end - start + 1)].map((_, i) => start + i);
    let tempArray: number[] = [];
    let left = start;
    let right = middle;

    this.setState(nowIndexes, "compare");
    await sleep(this.delay);
    this.setCompareCount(this.compareCount + nowIndexes.length);
    this.setState(nowIndexes, "normal");

    for (let i = 0; i < end - start + 1; i++) {
      let leftVal = this.numberArray[left]?.value;
      let rightVal = this.numberArray[right]?.value;
      if (leftVal && left < middle) {
        if (rightVal && right <= end) {
          if (leftVal < rightVal) {
            tempArray.push(leftVal);
            left++;
          } else {
            tempArray.push(rightVal);
            right++;
          }
        } else {
          tempArray.push(leftVal);
          left++;
        }
      } else {
        if (rightVal && right <= end) {
          tempArray.push(rightVal);
          right++;
        }
      }
    }

    this.setState(nowIndexes, "moving");
    await sleep(this.delay);
    this.setState(nowIndexes, "normal");
    this.setValues(nowIndexes, tempArray);
  };
  innerDivide = async (start: number, end: number) => {
    if (!this.running) return;
    if (start < end) {
      const middle = Math.ceil((end + start) / 2);
      await this.innerDivide(start, middle - 1);
      await this.innerDivide(middle, end);
      await this.innerMerge(start, end);
    }
  };
  mergeSort = async () => {
    await this.innerDivide(0, this.numberArray.length - 1);
    this.setRunning(false);
  };

  // 퀵
  innerQuickSort = async (left: number, right: number) => {
    if (left < right) {
      const pivot = this.numberArray[left]?.value;
      if (pivot) {
        let biggerIndex = right;
        let smallerIndex = left;
        while (biggerIndex > smallerIndex) {
          if (!this.running) return;
          let biggerVal = this.numberArray[biggerIndex]?.value;
          while (biggerVal && biggerVal > pivot) {
            if (!this.running) return;
            await this.compare(left, biggerIndex);
            biggerIndex -= 1;
            biggerVal = this.numberArray[biggerIndex]?.value;
          }
          let smallerVal = this.numberArray[smallerIndex]?.value;
          while (smallerIndex < biggerIndex && smallerVal && smallerVal <= pivot) {
            if (!this.running) return;
            await this.compare(left, smallerIndex);
            smallerIndex += 1;
            smallerVal = this.numberArray[smallerIndex]?.value;
          }
          await this.swap(smallerIndex, biggerIndex);
        }
        await this.swap(smallerIndex, left);
        await this.innerQuickSort(left, smallerIndex - 1);
        await this.innerQuickSort(smallerIndex + 1, right);
      }
    }
  };
  quickSort = async () => {
    await this.innerQuickSort(0, this.numberArray.length - 1);

    this.setRunning(false);
  };
}

export default ProblemStore;
