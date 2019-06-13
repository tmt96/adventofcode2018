import "./collection";
import * as util from "./util";

enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN
}

enum UnitType {
  Elf,
  Goblin
}

enum CellStatus {
  Blocked,
  Unblocked,
  UnitOccupied
}

interface Position {
  x: number;
  y: number;
}

interface Unit {
  unitType: UnitType;
  position: Position;
  hp: number;
}

type CellInfo = [CellStatus, Unit | null];
type World = CellInfo[][];

function createWorld(input: string[]): World {
  const world: World = [];
  for (const s of input) {
    const rows: CellInfo[] = [];
    for (const c of s) {
      switch (c) {
        case ".":
          rows.push([CellStatus.Unblocked, null]);
          break;
        case "#":
          rows.push([CellStatus.Blocked, null]);
          break;
        case "E":
          const elf: Unit = {
            hp: 200,
            position: { x: 0, y: 0 },
            unitType: UnitType.Elf
          };
          rows.push([CellStatus.UnitOccupied, elf]);
        case "G":
          const goblin: Unit = {
            hp: 200,
            position: { x: 0, y: 0 },
            unitType: UnitType.Goblin
          };
          rows.push([CellStatus.UnitOccupied, goblin]);
        default:
          break;
      }
    }
    world.push(rows);
  }
  return world;
}

function play(world: World): number {
  for (let turns = 0; ; turns++) {
    playOneTurn(world);
    if (
      doesWorldHaveUnitType(world, UnitType.Elf) ||
      doesWorldHaveUnitType(world, UnitType.Goblin)
    ) {
      continue;
    } else {
      return (
        turns *
        world.reduce((sum, row) => {
          return row
            .filter(info => info[1] !== null)
            .reduce((rowSum, info) => rowSum + info[1]!.hp, 0);
        }, 0)
      );
    }
  }
}

function playOneTurn(world: World): void {
  for (const [y, row] of world.entries()) {
    for (const [x, [status, unit]] of row.entries()) {
      if (status === CellStatus.UnitOccupied) {
        takeTurn(world, unit!, { x, y });
      }
    }
  }
}

function takeTurn(world: World, unit: Unit, position: Position): void {
  const targetAndDirection = findNearestTarget(world, unit, position);
  if (targetAndDirection !== null) {
    const [target, targetPos, direction] = targetAndDirection;
    move(world, unit, direction, position);
    battle(unit, target, position, targetPos);
  }
}

function findNearestTarget(
  world: World,
  unit: Unit,
  position: Position
): [Unit, Position, Direction] | null {
  return [unit, position, Direction.LEFT];
}

function move(
  world: World,
  unit: Unit,
  direction: Direction,
  position: Position
): void {
  setPosition(world, position, [CellStatus.Unblocked, null]);
  const newPos: Position = { x: position.x, y: position.y };
  switch (direction) {
    case Direction.LEFT:
      newPos.x -= 1;
      break;
    case Direction.RIGHT:
      newPos.x += 1;
      break;
    case Direction.UP:
      newPos.y -= 1;
      break;
    case Direction.DOWN:
      newPos.y += 1;
      break;
    default:
      break;
  }
  setPosition(world, newPos, [CellStatus.UnitOccupied, unit]);
}

function battle(
  unit: Unit,
  target: Unit,
  unitPos: Position,
  targetPos: Position
): void {
  if (
    Math.abs(unitPos.x - targetPos.x) + Math.abs(unitPos.y - targetPos.y) ===
    1
  ) {
    target.hp -= 3;
  }
  if (target.hp <= 0) {
    setPosition(world, targetPos, [CellStatus.Unblocked, null]);
  }
}

function getPosition(world: World, position: Position): CellInfo {
  return world[position.y][position.x];
}

function setPosition(world: World, position: Position, info: CellInfo) {
  world[position.y][position.x] = info;
}

function doesWorldHaveUnitType(world: World, unitType: UnitType): boolean {
  return world.some(row => {
    row.some(info => info[1] !== null && info[1].unitType === unitType);
  });
}

const input = util.readInputForDay(15);
const world = createWorld(input);
play(world);
