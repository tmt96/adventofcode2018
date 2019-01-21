import "./collection";
import * as util from "./util";

const inputPath = "data/day7.txt";
const lines = util.readFileToLines(inputPath);
const regex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin./;

const dependenciesMap = new Map<string, Set<string>>();
const nextStepsMap = new Map<string, Set<string>>();
const stepList = new Set<string>();

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

function getNextStep(stepQueue: string[]): string | undefined {
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
    const step = getNextStep(stepQueue);
    if (step !== undefined) {
      result += step;
      populateQueues(stepQueue, step, result);
    }
  }
  return result;
}

function getMinute(step: string): number {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  return alphabet.indexOf(step) + 61;
}

function part2(): number {
  let result = 0;
  let resultString = "";
  const maxWorker = 5;
  const workChamber = new Map<string, number>();

  const stepQueue = [];
  for (const [key, val] of dependenciesMap) {
    if (val.size === 0) {
      stepQueue.push(key);
    }
  }

  while (resultString.length < stepList.size) {
    // add workers to chamber
    while (workChamber.size < maxWorker && stepQueue.length > 0) {
      const nextStep = getNextStep(stepQueue)!;
      workChamber.set(nextStep, getMinute(nextStep));
    }
    const [nextCompleteStep, minuteLeft] = workChamber.min()!;
    result += minuteLeft;
    for (const [step, minute] of workChamber) {
      if (minute === minuteLeft) {
        workChamber.delete(step);
        resultString += step;
        populateQueues(stepQueue, step, resultString);
      } else {
        workChamber.set(step, minute - minuteLeft);
      }
    }
  }

  return result;
}

console.log(part1());
console.log(part2());
