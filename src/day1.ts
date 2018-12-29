import * as fs from "fs";
import * as readline from "readline";

const inputPath = "data/day1.txt";
const numbers = fs
  .readFileSync(inputPath)
  .toString()
  .split(/\n+/)
  .map(el => parseInt(el, 10) || 0);

// 1a
const res = numbers.reduce((val, el) => val + el, 0);
console.log("1a:", res);

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
