import "./collection";
import * as util from "./util";

const inputPath = "data/day2.txt";

function charCounter(s: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const char of s) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  return map;
}

function getHashCode(lineList: string[]): number {
  let letterTwo = 0;
  let letterThree = 0;

  for (const line of lineList) {
    const map = charCounter(line);
    const counts = Array.from(map.values());
    if (counts.indexOf(2) > -1) {
      letterTwo++;
    }
    if (counts.indexOf(3) > -1) {
      letterThree++;
    }
  }

  return letterTwo * letterThree;
}

function similarPart(first: string, second: string): string {
  let res = "";
  for (let index = 0; index < first.length; index++) {
    if (first[index] === second[index]) {
      res += first[index];
    }
  }
  return res;
}

function findId(ids: string[]): string {
  for (const id of ids) {
    for (const otherId of ids.removeAll(id)) {
      const res = similarPart(id, otherId);
      if (res.length === id.length - 1) {
        return res;
      }
    }
  }
  return "";
}

let lines = util.readFileToLines(inputPath);
lines = lines.take(-1);
// 2a
console.log(getHashCode(lines));
// 2b
console.log(findId(lines));
