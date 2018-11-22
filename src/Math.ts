import { Ordering } from './Ordering';

export function greatestInt(x: number): number {
  return isNaN(x) ? NaN : x >= 0 ? Math.floor(x) : Math.ceil(x);
}

export function fractionPart(x: number): number {
  return x - greatestInt(x);
}

export function fromContinuedFraction(xs: number[]): number {
  return xs.length > 0
    ? xs.reduceRight((accum, curr) => curr + 1 / accum)
    : NaN;
}

export function max(...xs: number[]): number {
  let value = -Infinity;
  for (const x of xs) {
    if (x > value) {
      value = x;
    }
  }
  return value;
}

export function maxBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T {
  let value = x0;
  for (const x of xs) {
    if (ord(x, value) === 'GT') {
      value = x;
    }
  }
  return value;
}

export function min(...xs: number[]): number {
  let value = +Infinity;
  for (const x of xs) {
    if (x < value) {
      value = x;
    }
  }
  return value;
}

export function minBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T {
  let value = x0;
  for (const x of xs) {
    if (ord(x, value) === 'LT') {
      value = x;
    }
  }
  return value;
}

export function sum(...xs: number[]): number {
  return xs.reduce((y, accum) => y + accum, 0);
}

export function product(...xs: number[]): number {
  return xs.reduce((y, accum) => y * accum, 1);
}

export function toContinuedFraction(x: number, maxLen: number): number[] {
  if (isNaN(x)) {
    return [];
  }
  if (x === 0) {
    return [0];
  }
  const result: number[] = [];
  let y = x;
  let len = 0;
  maxLen = Math.min(65536, maxLen);
  while (y !== 0 && len < maxLen) {
    const next = greatestInt(y);
    len = result.push(next);
    y = 1/(y - next);
  }
  return result;
}
