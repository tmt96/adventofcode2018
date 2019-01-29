import "./collection";
import * as util from "./util";

const lines = util.readInputForDay(9);
type Marble = number;

function putMarble(ring: Marble[], next: Marble, currentPos: number) {
  if (next % 23 !== 0) {
    const newPos = ((currentPos + 1) % ring.length) + 1;
    ring.splice(newPos, 0, next);
    return [0, newPos];
  } else {
    const posToRemove = (currentPos - 7 + ring.length) % ring.length;
    const removedMarble = ring.splice(posToRemove, 1);
    return [next + removedMarble[0]!, posToRemove % ring.length];
  }
}

function gameHighestScore(playersCount: number, lastMarble: Marble) {
  const scores: number[] = new Array(playersCount).fill(0);
  let currentPlayer = 0;
  let currentPos = 0;
  const marbleRing: Marble[] = [0];

  for (let i = 0; i < lastMarble; i++) {
    const [score, newPos] = putMarble(marbleRing, i + 1, currentPos);
    currentPos = newPos;
    scores[currentPlayer] += score;
    currentPlayer = (currentPlayer + 1) % scores.length;
  }

  return scores.max()!;
}

function part1(input: string): number {
  const [playersCount, lastMarble] = input
    .match(/\d+/g)!
    .map(s => parseInt(s, 10));

  return gameHighestScore(playersCount, lastMarble);
}

function part2(input: string): number {
  const [playersCount, lastMarble] = input
    .match(/\d+/g)!
    .map(s => parseInt(s, 10));

  return gameHighestScore(playersCount, lastMarble * 100);
}

console.log(part1(lines[0]));
console.log(part2(lines[0]));
