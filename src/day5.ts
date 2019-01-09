import * as fs from "fs";
import "./collection";

const inputPath = "data/day5.txt";
const line = fs.readFileSync(inputPath).toString();

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const reactivePattern = new RegExp(
  alphabet.map(c => c + c.toUpperCase() + "|" + c.toUpperCase() + c).join("|"),
  "g"
);

function transform(s: string, pattern: RegExp): string {
  while (s.match(pattern)) {
    s = s.replace(pattern, "");
  }
  return s;
}

// part a
console.log(transform(line, reactivePattern).length);
// part b
const result = alphabet
  .map(
    c =>
      transform(line.replace(new RegExp(c, "gi"), ""), reactivePattern).length
  )
  .min();
console.log(result);
