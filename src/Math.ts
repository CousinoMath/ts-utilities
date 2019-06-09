import { Ordering } from './Ordering';

/**
 * @summary Returns the greatest integer no more than the argument.
 */
export function greatestInt(x: number): number {
  return isNaN(x) ? NaN : x >= 0 ? Math.floor(x) : Math.ceil(x);
}

/**
 * @summary Returns the fractional part of the input.
 */
export function fractionPart(x: number): number {
  return x - greatestInt(x);
}

/**
 * ```
 * fromContinuedFraction([]) = NaN
 * fromContinuedFraction([x0]) = x0
 * fromContinuedFraction([x0, ...xs]) = x0 + 1/fromContinuedFraction([...xs])
 * ```
 * @summary Converts a continued fraction, represented as a list, into a number
 */
export function fromContinuedFraction(xs: number[]): number {
  return xs.length > 0
    ? xs.reduceRight((accum, curr) => curr + 1 / accum)
    : NaN;
}

/**
 * `max() = -Infinity`
 * @summary Returns a maximum of its arguments
 */
export function max(...xs: number[]): number {
  let value = -Infinity;
  for (const x of xs) {
    if (x > value) {
      value = x;
    }
  }
  return value;
}

/**
 * @summary Returns the maximum, by `ord`, of its arguments
 * @param ord the ordering using to determine the maximum
 */
export function maxBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T {
  let value = x0;
  for (const x of xs) {
    if (ord(x, value) === 'GT') {
      value = x;
    }
  }
  return value;
}

/**
 * `min() = +Infinity`
 * @summary Returns the minimum of its arguments
 */
export function min(...xs: number[]): number {
  let value = +Infinity;
  for (const x of xs) {
    if (x < value) {
      value = x;
    }
  }
  return value;
}

/**
 * @summary Returns the minimum, by `ord`, of its arguments
 * @param ord the ordering using to determine the minimum
 */
export function minBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T {
  let value = x0;
  for (const x of xs) {
    if (ord(x, value) === 'LT') {
      value = x;
    }
  }
  return value;
}

/**
 * `sum() = 0`
 * @summary Returns the sum of its arguments
 */
export function sum(...xs: number[]): number {
  return xs.reduce((y, accum) => y + accum, 0);
}

/**
 * `product() = 1`
 * @summary Retruns the product of its arguments
 */
export function product(...xs: number[]): number {
  return xs.reduce((y, accum) => y * accum, 1);
}

/**
 * @summary Converts a number into a continued fraction, represented as an array.
 * @param x number to be converted to continued fraction representation
 * @param maxLen maximum length of the continued fraction array
 */
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
    y = 1 / (y - next);
  }
  return result;
}
