import "./collection";
import * as util from "./util";

interface Position {
  X: number;
  Y: number;
}

type Direction = Position;

class Point {
  private p: Position;
  private d: Direction;
  constructor(p: Position, d: Direction) {
    this.p = p;
    this.d = d;
  }

  public get Position(): Position {
    return this.p;
  }

  public move(): void {
    this.p = {
      X: this.p.X + this.d.X,
      Y: this.p.Y + this.d.Y
    };
  }

  public rewind(): void {
    this.p = {
      X: this.p.X - this.d.X,
      Y: this.p.Y - this.d.Y
    };
  }
}

type PointConfig = Point[];

function parseLine(line: string): Point {
  const point = (line.match(/-?\d+/g) || []).map(s => parseInt(s, 10));
  const pos: Position = { X: point[0]!, Y: point[1]! };
  const direction: Direction = { X: point[2]!, Y: point[3]! };
  return new Point(pos, direction);
}

function tick(points: PointConfig) {
  points.forEach(p => p.move());
}

function untick(points: PointConfig) {
  points.forEach(p => p.rewind());
}

function height(points: PointConfig) {
  const posYs = points.map(p => p.Position.Y);
  return (posYs.max() || 0) - (posYs.min() || 0);
}

function draw(points: PointConfig) {
  const minY = points.map(p => p.Position.Y).min()!;
  const maxY = points.map(p => p.Position.Y).max()!;
  const minX = points.map(p => p.Position.X).min()!;
  const maxX = points.map(p => p.Position.X).max()!;

  const pointPositions: Position[] = points.map(p => p.Position);
  pointPositions.sort((first, second) => {
    if (first.X - second.X) {
      return first.X - second.X;
    } else {
      return first.Y - second.Y;
    }
  });

  const result: string[][] = [];

  for (let i = 0; i < maxY - minY + 1; i++) {
    const newVal = new Array(maxX - minX + 1).fill(" ");
    result.push(newVal);
  }
  for (const pos of pointPositions) {
    result[pos.Y - minY][pos.X - minX] = "#";
  }
  result.forEach(line => {
    console.log(line.join(""));
  });
}

// looking at the official input, it's reasonable to assume that we will need between 10000 and 11000 steps
const LOWER_BOUND = 10000;
const UPPER_BOUND = 11000;
// also reasonable to assume that the height of the text is smaller than 10.
const MAX_Y = 10;

const lines = util.readInputForDay(10);
const points = lines.map(parseLine);

for (let i = 0; i < LOWER_BOUND; i++) {
  tick(points);
}

for (let i = LOWER_BOUND; i < UPPER_BOUND; i++) {
  tick(points);
  const h = height(points);
  if (h < MAX_Y) {
    console.log(`time: ${i}`);
    draw(points);
  }
}
