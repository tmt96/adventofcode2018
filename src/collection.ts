export {};

declare global {
  interface Array<T> {
    append(item: T): T[];
    removeAll(item: T): T[];
    skip(count: number): T[];
    take(count: number): T[];
  }
}

if (!Array.prototype.append) {
  Array.prototype.append = function<T>(this: T[], item: T): T[] {
    return this.concat([item]);
  };
}

if (!Array.prototype.removeAll) {
  Array.prototype.removeAll = function<T>(this: T[], item: T): T[] {
    return this.filter(el => el !== item);
  };
}

if (!Array.prototype.skip) {
  Array.prototype.skip = function<T>(this: T[], count: number): T[] {
    return this.slice(count);
  };
}

if (!Array.prototype.take) {
  Array.prototype.take = function<T>(this: T[], count: number): T[] {
    return this.slice(0, count);
  };
}
