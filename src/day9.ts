import "./collection";
import * as util from "./util";

class Marble {
  public prev: Marble;
  public next: Marble;
  public readonly value: number;

  constructor(value: number) {
    this.value = value;
    this.prev = this;
    this.next = this;
  }

  public getRight(step = 1): Marble {
    return step === 0 ? this : this.next.getRight(step - 1);
  }

  public getLeft(step = 1): Marble {
    return step === 0 ? this : this.prev.getLeft(step - 1);
  }
}

class MarbleRing {
  private _currentMarble: Marble;
  private diameter: number;

  public get currentMarble(): Marble {
    return this._currentMarble;
  }

  constructor() {
    this._currentMarble = new Marble(0);
    this.diameter = 1;
  }

  public rotateClockwise(step: number) {
    this._currentMarble = this._currentMarble.getRight(step);
  }

  public rotateCounterClockwise(step: number) {
    this._currentMarble = this._currentMarble.getLeft(step);
  }

  public insertAndSetCurrent(value: number) {
    const marble = new Marble(value);
    this.setNeighbor(marble, this._currentMarble.next);
    this.setNeighbor(this._currentMarble, marble);
    this._currentMarble = marble;
    this.diameter += 1;
  }

  public deleteAndReturnCurrent(): number {
    const marble = this._currentMarble;
    this.setNeighbor(this._currentMarble.prev, this._currentMarble.next);
    this._currentMarble = this._currentMarble.next;
    this.diameter -= 1;
    return marble.value;
  }

  private setNeighbor(marble1: Marble, marble2: Marble) {
    marble1.next = marble2;
    marble2.prev = marble1;
  }
}

const lines = util.readInputForDay(9);

function playOneRound(ring: MarbleRing, next: number) {
  if (next % 23 !== 0) {
    ring.rotateClockwise(1);
    ring.insertAndSetCurrent(next);
    return 0;
  } else {
    ring.rotateCounterClockwise(7);
    const removed = ring.deleteAndReturnCurrent();
    return next + removed;
  }
}

function gameHighestScore(playersCount: number, lastMarble: number) {
  const scores: number[] = new Array(playersCount).fill(0);
  let currentPlayer = 0;
  const marbleRing = new MarbleRing();

  for (let i = 0; i < lastMarble; i++) {
    const score = playOneRound(marbleRing, i + 1);
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
