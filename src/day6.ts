import "./collection";
import * as util from "./util";

function manhattanDistances(fst: number[], snd: number[]) {
  return Math.abs(fst[0] - snd[0]) + Math.abs(fst[1] - snd[1]);
}

const inputPath = "./data/day6.txt";
const lines = util.readFileToLines(inputPath);

const locations = lines.map(line =>
  line.split(", ").map(s => parseInt(s || "0", 10) || 0)
);
const [Xs, Ys] = locations.zip();

const [minX, maxX, minY, maxY] = [
  Xs.min() || 0,
  Xs.max() || Number.MAX_VALUE,
  Ys.min() || 0,
  Ys.max() || Number.MAX_VALUE
];

// part 1
const countMap: Map<string, number> = new Map();
locations.forEach(location => countMap.set(location.toString(), 0));

for (let x = minX; x < maxX; x++) {
  for (let y = minY; y < maxY; y++) {
    // get all location closest to this point
    const minDist =
      locations.map(loc => manhattanDistances([x, y], loc)).min() || 0;
    const allClosest = locations.filter(
      loc => manhattanDistances([x, y], loc) === minDist
    );

    // only consider those with exactly one closest location
    if (allClosest.length === 1) {
      const location = allClosest[0].toString();
      // if the current point is at the edge, this location will be closest to infinitely many points, so we delete it from the map
      if (x === minX || x === maxX || y === minY || y === maxY) {
        countMap.delete(location);
      } else if (countMap.has(location)) {
        const count = countMap.get(location)!;
        countMap.set(location, count + 1);
      }
    }
  }
}

console.log(countMap.max()![1]);

// part 2
let safeArea = 0;
for (let x = minX; x < maxX; x++) {
  for (let y = minY; y < maxY; y++) {
    const totalDistance = locations
      .map(loc => manhattanDistances(loc, [x, y]))
      .reduce((dist, acc) => dist + acc, 0);
    if (totalDistance < 10000) {
      safeArea += 1;
    }
  }
}
console.log(safeArea);
