import * as fs from "fs";
import * as readline from "readline";

const inputPath = "data/day1.txt";

const res = fs
  .readFileSync(inputPath)
  .toString()
  .split("\n")
  .reduce((val, el) => val + (parseInt(el, 10) || 0), 0);
console.log(res);

const rl = readline.createInterface(fs.createReadStream(inputPath));
let sum = 0;
rl.on("line", line => {
  sum += parseInt(line, 10) || 0;
});
rl.on("close", () => console.log(sum));
