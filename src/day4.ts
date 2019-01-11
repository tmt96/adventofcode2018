import "./collection";
import * as util from "./util";

const inputPath = "data/day4.txt";
const lines = util.readFileToLines(inputPath);
lines.sort();

let currentGuard: number;
let startSleepTime: number;
const guardMap = new Map<number, Map<number, number>>();

function parseLine(line: string) {
  // line format: [1518-10-05 00:10] falls asleep
  // after split: ['1518-10-05 00:10', 'falls asleep']
  const [time, content] = line
    .split(/[\[\]]/)
    .filter(s => s !== "")
    .map(s => s.trim());

  if (content.startsWith("Guard")) {
    // content = Guard #1949 begins shift
    // guardParseResult = [ '#1949', 1949', index: 6, input: 'Guard #1949 begins shift', groups: undefined ]
    const guardParseResult = /#(\d{1,5})/.exec(content);
    currentGuard = parseInt(guardParseResult![1], 10);
    if (!guardMap.has(currentGuard)) {
      guardMap.set(currentGuard, new Map());
    }
  } else if (content === "falls asleep") {
    startSleepTime = parseInt(time.split(":")![1], 10);
  } else if (content === "wakes up") {
    const wakeUpTime = parseInt(time.split(":")![1], 10);
    const currentGuardSleepTime = guardMap.get(currentGuard) || new Map();
    for (let minute = startSleepTime; minute < wakeUpTime; minute++) {
      const curCount = currentGuardSleepTime.get(minute) || 0;
      currentGuardSleepTime.set(minute, curCount + 1);
    }
  }
}

lines.forEach(parseLine);

// part a
const guardTotalMinuteMap = guardMap.map((g, minuteCount) => {
  const totalMinuteCount = minuteCount.reduce(
    (_, count, prev) => count + prev,
    0
  );
  return [g, totalMinuteCount];
});
const sleepyGuard = guardTotalMinuteMap.max()![0];
const mostOftenSleepMinute = guardMap.get(sleepyGuard)!.max()![0];
console.log(sleepyGuard * mostOftenSleepMinute);

// part b
const guardToMaxMinuteMap = guardMap.map((g, minuteCount) => [
  g,
  minuteCount.max() || [0, 0]
]);
const [guard, maxMinute] = guardToMaxMinuteMap.maxBy(
  (_, minuteCount) => minuteCount[1]
) || [0, [0, 0]];
console.log(guard * maxMinute[0]);
