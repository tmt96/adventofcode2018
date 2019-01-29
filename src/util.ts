import * as fs from "fs";

export function readFileToLines(inputPath: string): string[] {
  return fs
    .readFileSync(inputPath)
    .toString()
    .split(/\n+/);
}

export function readInputForDay(day: number, isSample = false): string[] {
  const inputPath = isSample
    ? `./data/sample/day${day}.txt`
    : `./data/day${day}.txt`;
  return readFileToLines(inputPath);
}
