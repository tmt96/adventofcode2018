import * as util from "./util";

const inputPath = "data/day7.txt";
const lines = util.readFileToLines(inputPath);
const regex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin./;

const dependenciesMap = new Map<string, Set<string>>();
const nextStepsMap = new Map<string, Set<string>>();
const stepQueue: string[] = [];
const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
let result = "";

// setup
for (const step of alphabet) {
  dependenciesMap.set(step, new Set());
  nextStepsMap.set(step, new Set());
}

for (const line of lines) {
  const match = line.match(regex);
  if (match !== null) {
    const [_, prev, next] = match;
    dependenciesMap.get(next)!.add(prev);
    nextStepsMap.get(prev)!.add(next);
  }
}

// part 1
for (const [key, val] of dependenciesMap) {
  if (val.size === 0) {
    stepQueue.push(key);
  }
}

function nextStep(): string | null {
  stepQueue.sort().reverse();
  const step = stepQueue.pop();
  if (step === undefined) {
    return null;
  }
  for (const followingStep of nextStepsMap.get(step) || []) {
    dependenciesMap.get(followingStep)!.delete(step);
    if (dependenciesMap.get(followingStep)!.size === 0) {
      stepQueue.push(followingStep);
    }
  }
  nextStepsMap.delete(step);

  return step;
}

while (nextStepsMap.size > 0) {
  result += nextStep();
}

console.log(result);
