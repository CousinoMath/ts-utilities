import { Ordering } from './Ordering';

export function max(...xs: number[]): number {
  let value = -Infinity;
  for (const x of xs) {
    if (x > value) {
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

export function maxBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T {
  let value = x0;
  for (const x of xs) {
    if (ord(x, value) === 'GT') {
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
