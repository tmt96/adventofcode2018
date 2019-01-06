import * as fs from "fs";

export function readFileToLines(inputPath: string): string[] {
  return fs
    .readFileSync(inputPath)
    .toString()
    .split(/\n+/);
}
