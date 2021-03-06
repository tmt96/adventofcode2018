import * as util from "./util";

const inputPath = "data/day1.txt";
const numbers = util
  .readFileToLines(inputPath)
  .map(el => parseInt(el, 10) || 0);

// 1a
const res = numbers.reduce((val, el) => val + el, 0);
console.log("1a:", res);

// 1b
let curSum = 0;
const sums = new Set([0]);
for (let i = 0; ; i++) {
  const val = numbers[i % numbers.length];
  curSum += val;
  if (sums.has(curSum)) {
    console.log("1b:", curSum);
    break;
  }
  sums.add(curSum);
}
