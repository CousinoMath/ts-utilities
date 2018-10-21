export function fill<T>(arr: T[], val: T, start = 0, stop = arr.length): T[] {
  for (let i = start; i < stop; i++) {
    arr[i] = val;
  }
  return arr;
}

export function is(x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return isNaN(x) && isNaN(y);
  }
}

export function isInteger(value: number): boolean {
  return isFinite(value) && Math.floor(value) === value;
}

export function isNaN(value: number): boolean {
  return value !== value;
}

export function log2(x: number): number {
  return Math.log(x) / Math.LN2;
}

export function sign(value: number): number {
  return (value > 0 ? 1 : 0) + (value < 0 ? -1 : 0);
}
