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

function calcAreaPower(
  cell: Cell,
  areaHeight: number,
  areaWidth: number,
  powerMap: PowerMap
): number {
  let result = 0;
  for (let x = 0; x < areaWidth; x++) {
    for (let y = 0; y < areaHeight; y++) {
      const nextCell = { X: cell.X + x, Y: cell.Y + y };
      result += powerMap.get(JSON.stringify(nextCell)) || 0;
    }
  }
  return result;
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

function calcAllAreaPowerLevels(
  gridHeight: number,
  gridWidth: number,
  areaHeight: number,
  areaWidth: number,
  powerMap: PowerMap
): PowerMap {
  const results = new Map<string, number>();
  for (let x = 1; x <= gridWidth - areaWidth + 1; x++) {
    for (let y = 1; y <= gridHeight - areaHeight + 1; y++) {
      const cell: Cell = { X: x, Y: y };
      results.set(
        JSON.stringify(cell),
        calcAreaPower(cell, areaHeight, areaWidth, powerMap)
      );
    }
  }
  return results;
}

function part1(serialNumber: number): Cell {
  const cellPowerMap = calcAllPowerLevels(
    GRID_HEIGHT,
    GRID_WIDTH,
    serialNumber
  );

  // console.log(cellPowerMap);

  const areaPowerMap = calcAllAreaPowerLevels(
    GRID_HEIGHT,
    GRID_WIDTH,
    AREA_HEIGHT,
    AREA_WIDTH,
    cellPowerMap
  );

  // console.log(areaPowerMap);

  return JSON.parse(areaPowerMap.max()![0]);
}

console.log(part1(5153));
