export {};

declare global {
  interface Array<T> {
    min(): T | undefined;
    max(): T | undefined;

    append(item: T): T[];
    removeAll(item: T): T[];
    skip(count: number): T[];
    take(count: number): T[];
  }

  interface Map<K, V> {
    max(): [K, V] | undefined;
    min(): [K, V] | undefined;
    maxBy<T>(func: (key: K, value: V) => T): [K, V] | undefined;
    minBy<T>(func: (key: K, value: V) => T): [K, V] | undefined;

    filter(func: (key: K, value: V) => boolean): Map<K, V>;
    map<T, U>(func: (key: K, value: V) => [T, U]): Map<T, U>;
    reduce<R>(func: (key: K, value: V, prevValue: R) => R, acc: R): R;
  }
}

if (!Array.prototype.min) {
  Array.prototype.min = function<T>(this: T[]): T | undefined {
    return this.reduce((item, value) => (item < value ? item : value));
  };
}

if (!Array.prototype.max) {
  Array.prototype.max = function<T>(this: T[]): T | undefined {
    return this.reduce((item, value) => (item > value ? item : value));
  };
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

if (!Map.prototype.max) {
  Map.prototype.max = function<K, V>(this: Map<K, V>) {
    return this.maxBy((_, val) => val);
  };
}

if (!Map.prototype.min) {
  Map.prototype.min = function<K, V>(this: Map<K, V>) {
    return this.minBy((_, val) => val);
  };
}

if (!Map.prototype.maxBy) {
  Map.prototype.maxBy = function<K, V, T>(
    this: Map<K, V>,
    func: (key: K, value: V) => T
  ): [K, V] | undefined {
    let result: [K, V] | undefined;
    let curMax: T;
    for (const [key, value] of this) {
      if (result === undefined) {
        result = [key, value];
        curMax = func(key, value);
      } else {
        const temp = func(key, value);
        if (curMax! < temp) {
          result = [key, value];
          curMax = temp;
        }
      }
    }
    return result;
  };
}

if (!Map.prototype.minBy) {
  Map.prototype.minBy = function<K, V, T>(
    this: Map<K, V>,
    func: (key: K, value: V) => T
  ): [K, V] | undefined {
    let result: [K, V] | undefined;
    let curMax: T;
    for (const [key, value] of this) {
      if (result === undefined) {
        result = [key, value];
        curMax = func(key, value);
      } else {
        const temp = func(key, value);
        if (curMax! > temp) {
          curMax = temp;
        }
      }
    }
    return result;
  };
}

if (!Map.prototype.filter) {
  Map.prototype.filter = function<K, V>(
    this: Map<K, V>,
    func: (key: K, value: V) => boolean
  ): Map<K, V> {
    const result = new Map<K, V>();
    for (const [key, value] of this) {
      if (func(key, value)) {
        result.set(key, value);
      }
    }
    return result;
  };
}

if (!Map.prototype.map) {
  Map.prototype.map = function<K, V, T, U>(
    this: Map<K, V>,
    func: (key: K, value: V) => [T, U]
  ): Map<T, U> {
    const result = new Map<T, U>();
    for (const [key, value] of this) {
      const [newKey, newValue] = func(key, value);
      result.set(newKey, newValue);
    }
    return result;
  };
}

if (!Map.prototype.reduce) {
  Map.prototype.reduce = function<K, V, R>(
    this: Map<K, V>,
    func: (key: K, value: V, prevValue: R) => R,
    acc: R
  ): R {
    let res = acc;
    for (const [key, value] of this) {
      res = func(key, value, res);
    }
    return res;
  };
}
