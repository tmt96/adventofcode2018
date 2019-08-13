import "./collection";
import * as util from "./util";

type Registers = [number, number, number, number];
type Operation = (
  a: number,
  b: number,
  c: number,
  regs: Registers
) => Registers;

interface Instruction {
  opcode: number;
  input_1: number;
  input_2: number;
  output: number;
}

const get = (i: number, regs: Registers): number => regs[i];
const set = (i: number, val: number, regs: Registers) => {
  const result = [...regs];
  result[i] = val;
  return result as Registers;
};

// opcode helper
const add = (a: number, b: number) => a + b;
const mul = (a: number, b: number) => a * b;
// tslint:disable-next-line: no-bitwise
const bitwiseAnd = (a: number, b: number) => a & b;
// tslint:disable-next-line: no-bitwise
const bitwiseOr = (a: number, b: number) => a | b;
const gt = (a: number, b: number) => (a > b ? 1 : 0);
const eq = (a: number, b: number) => (a === b ? 1 : 0);
const useFirst = (a: number, _: number) => a;

// inst helper
const instii = (
  f: (fst: number, snd: number) => number,
  a: number,
  b: number,
  c: number,
  regs: Registers
) => set(c, f(a, b), regs);
const instir = (f: (a: number, b: number) => number) => {
  return (a: number, b: number, c: number, regs: Registers) =>
    instii(f, a, get(b, regs), c, regs);
};
const instri = (f: (a: number, b: number) => number) => {
  return (a: number, b: number, c: number, regs: Registers) =>
    instii(f, get(a, regs), b, c, regs);
};
const instrr = (f: (a: number, b: number) => number) => {
  return (a: number, b: number, c: number, regs: Registers) =>
    instii(f, get(a, regs), get(b, regs), c, regs);
};

// opcode
const addr = instrr(add);
const addi = instri(add);
const mulr = instrr(mul);
const muli = instri(mul);
const banr = instrr(bitwiseAnd);
const bani = instri(bitwiseAnd);
const borr = instrr(bitwiseOr);
const bori = instri(bitwiseOr);
const setr = instri(useFirst);
const seti = instir(useFirst);
const gtir = instir(gt);
const gtri = instri(gt);
const gtrr = instrr(gt);
const eqir = instir(eq);
const eqri = instri(eq);
const eqrr = instrr(eq);

const opcodes: Operation[] = [
  addr,
  addi,
  mulr,
  muli,
  banr,
  bani,
  borr,
  bori,
  setr,
  seti,
  gtir,
  gtri,
  gtrr,
  eqir,
  eqri,
  eqrr
];

const couldBeOpcode = (
  op: Operation,
  before: Registers,
  args: Instruction,
  after: Registers
) => op(args.input_1, args.input_2, args.output, before).equal(after);

const getPossibleOpcodes = (
  before: Registers,
  args: Instruction,
  after: Registers
) => opcodes.filter(inst => couldBeOpcode(inst, before, args, after));

const couldBeAtLeastKOpcodes = (
  before: Registers,
  args: Instruction,
  after: Registers,
  k: number
) => getPossibleOpcodes(before, args, after).length >= k;

const readRegisters = (input: string) =>
  (input.match(/\d+/g) || []).map(Number) as Registers;
const readInstruction = (input: string) => {
  const readResult = (input.match(/\d+/g) || []).map(Number);
  return {
    opcode: readResult[0],
    input_1: readResult[1],
    input_2: readResult[2],
    output: readResult[3]
  } as Instruction;
};

function part1(lines: string[]) {
  let count = 0;
  for (let i = 0; i < lines.length && lines[i].startsWith("Before"); i += 3) {
    const before = readRegisters(lines[i]);
    const inst = readInstruction(lines[i + 1]);
    const after = readRegisters(lines[i + 2]);
    if (couldBeAtLeastKOpcodes(before, inst, after, 3)) {
      count += 1;
    }
  }
  return count;
}

function updateOpcodeMap(
  before: Registers,
  inst: Instruction,
  after: Registers,
  opcodeMap: Map<number, Operation[]>
) {
  const possibleOpcodes = getPossibleOpcodes(before, inst, after);
  const currentOpcodes = opcodeMap.get(inst.opcode)!;
  opcodeMap.set(
    inst.opcode,
    currentOpcodes.filter(op => couldBeOpcode(op, before, inst, after))
  );
}

function createOpcodeMap(lines: string[]) {
  const opcodeMap = new Map<number, Operation[]>();
  for (let i = 0; i < opcodes.length; i++) {
    opcodeMap.set(i, opcodes);
  }
  const result = new Map<number, Operation>();

  for (let i = 0; i < lines.length && lines[i].startsWith("Before"); i += 3) {
    const before = readRegisters(lines[i]);
    const inst = readInstruction(lines[i + 1]);
    const after = readRegisters(lines[i + 2]);
    updateOpcodeMap(before, inst, after, opcodeMap);
  }

  for (let i = 0; i < opcodes.length; i++) {
    for (const [num, opcodeList] of opcodeMap.entries()) {
      if (opcodeList.length === 1) {
        const opcode = opcodeList[0]!;
        result.set(num, opcode);
        for (const [otherNum, otherOpcodes] of opcodeMap.entries()) {
          const index = otherOpcodes.indexOf(opcode);
          if (index !== -1) {
            otherOpcodes.splice(index, 1);
            opcodeMap.set(otherNum, otherOpcodes);
          }
        }
        opcodeMap.delete(num);

        break;
      }
    }
  }

  return result;
}

function part2(lines: string[]) {
  const opcodeMap = createOpcodeMap(lines);
  let i = 0;
  let registers: Registers = [0, 0, 0, 0];
  for (; i < lines.length && lines[i].startsWith("Before"); i += 3) {
    continue;
  }

  for (; i < lines.length; i++) {
    if (lines[i] === "") {
      break;
    }
    const inst = readInstruction(lines[i]);
    registers = opcodeMap.get(inst.opcode)!(
      inst.input_1,
      inst.input_2,
      inst.output,
      registers
    );
  }
  return registers[0];
}

const lines = util.readInputForDay(16);
console.log(part1(lines));
console.log(part2(lines));
