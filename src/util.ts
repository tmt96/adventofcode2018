import * as fs from "fs";

export function readFileToLines(inputPath: string): string[] {
  return fs
    .readFileSync(inputPath)
    .toString()
    .split(/\n+/);
}

export function readInputForDay(day: number, isSample = false): string[] {
  const inputPath = isSample
    ? `./data/day${day}.txt`
    : `./data/sample/day${day}.txt`;
  return readFileToLines(inputPath);
}
