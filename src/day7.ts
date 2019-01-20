import * as util from "./util";

const inputPath = "data/day7.txt";
const lines = util.readFileToLines(inputPath);
const regex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin./;

const dependenciesMap = new Map<string, Set<string>>();
const nextStepsMap = new Map<string, Set<string>>();
const stepList = new Set<string>();
// const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

// setup
for (const line of lines) {
  const match = line.match(regex);
  if (match !== null) {
    const [_, prev, next] = match;

    // fill the list & maps
    stepList.add(prev);
    stepList.add(next);
    if (!dependenciesMap.has(next)) {
      dependenciesMap.set(next, new Set());
    }
    if (!dependenciesMap.has(prev)) {
      dependenciesMap.set(prev, new Set());
    }
    if (!nextStepsMap.has(prev)) {
      nextStepsMap.set(prev, new Set());
    }
    if (!nextStepsMap.has(next)) {
      nextStepsMap.set(next, new Set());
    }

    dependenciesMap.get(next)!.add(prev);
    nextStepsMap.get(prev)!.add(next);
  }
}

function populateQueues(
  stepQueue: string[],
  completedStep: string,
  result: string
): void {
  for (const followingStep of nextStepsMap.get(completedStep) || []) {
    const dependencies = dependenciesMap.get(followingStep)!;
    if (Array.from(dependencies).every(c => result.includes(c))) {
      stepQueue.push(followingStep);
    }
  }
}

function nextStep(stepQueue: string[]): string | undefined {
  stepQueue.sort().reverse();
  return stepQueue.pop();
}

function part1(): string {
  let result = "";
  const stepQueue = [];
  for (const [key, val] of dependenciesMap) {
    if (val.size === 0) {
      stepQueue.push(key);
    }
  }

  for (let i = 0; i < stepList.size; i++) {
    const step = nextStep(stepQueue);
    if (step !== undefined) {
      result += step;
      populateQueues(stepQueue, step, result);
    }
  }
  return result;
}

function part2(): number {
  let result = 0;
  return result;
}

console.log(part1());
console.log(part2());
