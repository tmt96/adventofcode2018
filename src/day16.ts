import * as util from "./util";

type Registers = [number, number, number, number];
type Opcode = (a: number, b: number, c: number, regs: Registers) => Registers;

const get = (i: number, regs: Registers): number => regs[i];
const set = (i: number, val: number, regs: Registers): Registers =>
  regs.splice(i, 1, val) as Registers;

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
): Registers => set(c, f(a, b), regs);
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

const opcodes: Opcode[] = [
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
  inst: Opcode,
  before: Registers,
  args: number[],
  after: Registers
) => inst(args[1], args[2], args[3], before).equal(after);
const couldBeAtLeastKOpcodes = (
  before: Registers,
  args: number[],
  after: Registers,
  k: number
) =>
  opcodes.filter(inst => couldBeOpcode(inst, before, args, after)).length >= k;

const lines = util.readInputForDay(16);
