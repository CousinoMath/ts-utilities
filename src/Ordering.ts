import { on } from './internal';

/**
 * @summary Union of literal types 'LT', 'EQ', and 'GT'
 */
export type Orderings = 'LT' | 'EQ' | 'GT';

/**
 * @summary Type alias of total orderings
 */
export type Ordering<T> = (x: T, y: T) => Orderings;

/**
 * `preorder(f, ord)(x, y) <-> ord(f(x), f(y))`
 * @summary Pulls back an ordering along a function.
 */
export function preorder<S, T>(f: (x: S) => T, ord: Ordering<T>): Ordering<S> {
  return on(f, ord);
}

/**
 * @summary A convenience Date ordering.
 */
export function dateOrd(x: Date, y: Date): Orderings {
  return numberOrd(x.getTime() - y.getTime(), 0);
}

/**
 * This function treats all zeros (+0 = 0, -0) as equal and NaNs as equals.
 * If only one of x and y are NaN, `numberOrd(x, y) = numberOrd(y, x) = 'LT'`.
 * This is the one wart on this function.
 * @summary Total ordering on number type. (excepting on NaNs)
 */
export function numberOrd(x: number, y: number): Orderings {
  const xNan = Number.isNaN(x);
  const yNan = Number.isNaN(y);
  if (xNan || yNan) {
    return xNan && yNan ? 'EQ' : 'LT';
  }
  // Rid of anomolous NaN
  const xAbs = Math.abs(x);
  const yAbs = Math.abs(y);
  if (xAbs > 0 || yAbs > 0) {
    if (x < y) {
      return 'LT';
    } else if (x > y) {
      return 'GT';
    } else {
      return 'EQ';
    }
  } else {
    // xAbs === 0 && yAbs === 0 <-> x = y = [+-]?0
    return 'EQ';
  }
}

/**
 * @summary A convenience string ordering.
 */
export function stringOrd(x: string, y: string): Orderings {
  if (x < y) {
    return 'LT';
  } else if (x > y) {
    return 'GT';
  } else {
    return 'EQ';
  }
}

/**
 * @summary Converts a typical comparing function `f` into an `Ordering`.
 */
export function toOrdering<T>(f: (x: T, y: T) => number): Ordering<T> {
  return (x, y) => numberOrd(f(x, y), 0);
}
