import "./collection";
import * as util from "./util";

interface Cell {
  X: number;
  Y: number;
}

type PowerMap = Map<string, number>;

const GRID_WIDTH = 300;
const GRID_HEIGHT = 300;
const AREA_WIDTH = 3;
const AREA_HEIGHT = 3;

function calcPowerLevel(cell: Cell, serialNumber: number): number {
  const rackID = cell.X + 10;
  let powerLevel = rackID * cell.Y;
  powerLevel = (powerLevel + serialNumber) * rackID;
  powerLevel = Math.floor(powerLevel / 100) % 10;
  return powerLevel - 5;
}

function calcPowerFromOrigin(
  cell: Cell,
  powerMap: PowerMap,
  resultMap: PowerMap
): number {
  if (cell.X === 0 || cell.Y === 0) {
    return 0;
  }
  const key = JSON.stringify(cell);
  if (resultMap.has(key)) {
    return resultMap.get(key)!;
  } else {
    const result =
      calcPowerFromOrigin({ X: cell.X - 1, Y: cell.Y }, powerMap, resultMap) +
      calcPowerFromOrigin({ X: cell.X, Y: cell.Y - 1 }, powerMap, resultMap) -
      calcPowerFromOrigin(
        { X: cell.X - 1, Y: cell.Y - 1 },
        powerMap,
        resultMap
      ) +
      powerMap.get(key)!;
    resultMap.set(key, result);
    return result;
  }
}

function calcAreaPower(
  cell: Cell,
  powerFromOriginMap: PowerMap,
  areaHeight: number = 3,
  areaWidth: number = 3
): number {
  const tempCell = { X: cell.X - 1, Y: cell.Y - 1 };
  return (
    (powerFromOriginMap.get(JSON.stringify(tempCell)) || 0) +
    (powerFromOriginMap.get(
      JSON.stringify({ X: tempCell.X + areaWidth, Y: tempCell.Y + areaHeight })
    ) || 0) -
    (powerFromOriginMap.get(
      JSON.stringify({ X: tempCell.X + areaWidth, Y: tempCell.Y })
    ) || 0) -
    (powerFromOriginMap.get(
      JSON.stringify({ X: tempCell.X, Y: tempCell.Y + areaHeight })
    ) || 0)
  );
}

function calcAllPowerLevels(
  height: number,
  width: number,
  serialNumber: number
): PowerMap {
  const results = new Map<string, number>();
  for (let x = 1; x <= width; x++) {
    for (let y = 1; y <= height; y++) {
      const cell: Cell = { X: x, Y: y };
      results.set(JSON.stringify(cell), calcPowerLevel(cell, serialNumber));
    }
  }
  return results;
}

function calcAllPowerFromOrigin(
  gridHeight: number,
  gridWidth: number,
  powerMap: PowerMap
): PowerMap {
  const resultMap = new Map<string, number>();
  calcPowerFromOrigin({ X: gridWidth, Y: gridHeight }, powerMap, resultMap);
  return resultMap;
}

function calcAllAreaPowerLevels(
  gridHeight: number,
  gridWidth: number,
  areaHeight: number,
  areaWidth: number,
  powerFromOriginMap: PowerMap
): PowerMap {
  const results = new Map<string, number>();
  for (let x = 1; x <= gridWidth - areaWidth + 1; x++) {
    for (let y = 1; y <= gridHeight - areaHeight + 1; y++) {
      const cell: Cell = { X: x, Y: y };
      results.set(
        JSON.stringify(cell),
        calcAreaPower(cell, powerFromOriginMap, areaHeight, areaWidth)
      );
    }
  }
  return results;
}

function findSquareWithMaxPower(
  gridHeight: number,
  gridWidth: number,
  powerFromOriginMap: PowerMap
) {
  let resultMap = new Map<string, number>();

  for (let i = 1; i <= Math.min(gridHeight, gridWidth); i++) {
    const areaPowerMap = calcAllAreaPowerLevels(
      gridHeight,
      gridWidth,
      i,
      i,
      powerFromOriginMap
    );

    const [location, value] = areaPowerMap.max()!;
    resultMap.set(location + `, ${i}`, value);
  }

  return resultMap.max();
}

function part1(serialNumber: number): Cell {
  const cellPowerMap = calcAllPowerLevels(
    GRID_HEIGHT,
    GRID_WIDTH,
    serialNumber
  );

  const powerFromOriginMap = calcAllPowerFromOrigin(
    GRID_HEIGHT,
    GRID_WIDTH,
    cellPowerMap
  );

  const areaPowerMap = calcAllAreaPowerLevels(
    GRID_HEIGHT,
    GRID_WIDTH,
    AREA_HEIGHT,
    AREA_WIDTH,
    powerFromOriginMap
  );

  return JSON.parse(areaPowerMap.max()![0]);
}

function part2(serialNumber: number): string {
  const cellPowerMap = calcAllPowerLevels(
    GRID_HEIGHT,
    GRID_WIDTH,
    serialNumber
  );

  const powerFromOriginMap = calcAllPowerFromOrigin(
    GRID_HEIGHT,
    GRID_WIDTH,
    cellPowerMap
  );

  const maxPower = findSquareWithMaxPower(
    GRID_HEIGHT,
    GRID_WIDTH,
    powerFromOriginMap
  );

  return maxPower![0];
}

console.log(part1(5153));
console.log(part2(5153));
