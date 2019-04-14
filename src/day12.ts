import "./collection";
import * as util from "./util";

const ITER_COUNT = 20;
const BUFFER = 2;
const PLANT = "#";
const NO_PLANT = ".";

const lines = util.readInputForDay(12, false);
// console.log(lines);
let config = lines[0].substring("initial state: ".length);
// console.log(config);
config =
  ".".repeat(ITER_COUNT + BUFFER) +
  config +
  NO_PLANT.repeat(ITER_COUNT + BUFFER);

const rules = new Map(
  lines
    .skip(1)
    .map(s => s.split("=>").map(substr => substr.trim()) as [string, string])
);

function spreadPlant(curConfig: string, iterCount: number): string {
  let newConfig = "";
  newConfig += NO_PLANT.repeat(BUFFER);
  for (let i = BUFFER; i < curConfig.length - BUFFER; i++) {
    newConfig += rules.get(curConfig.slice(i - BUFFER, i + 3)) || NO_PLANT;
  }
  newConfig += NO_PLANT.repeat(BUFFER);
  return newConfig;
}

function getPlantSum(config: string): number {
  return config
    .split("")
    .reduce(
      (sum, char, index) =>
        char === PLANT ? sum + index - ITER_COUNT - BUFFER : sum,
      0
    );
}

for (let i = 0; i < ITER_COUNT; i++) {
  config = spreadPlant(config, i);
  console.log(getPlantSum(config));
}

console.log(getPlantSum(config));

// for part b, after a while the series becomes a linear series. In particular, I run the algorithm for 200 iterations, notice that the sum increases by 26 per iteration & calculate from there. You can code for it, but I'm lazy, so: 5869 + (50000000000 - 200) * 26 = 1300000000669
