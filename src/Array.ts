import { ident } from "./Function";
import { Maybe } from "./Maybe";

/**
 * @summary Creates a recursive function over arrays with arbitrary return type.
 * @param init value returned for an empty array
 * @param ind recursive rule applied to non-empty arrays
 */
export function array<R, S>(init: S, ind: (x: R, ys: S) => S): (xs: R[]) => S {
  return xs => {
    let val = init;
    const len = xs.length;
    for (let i = 0; i < len; i++) {
      val = ind(xs[i], val);
    }
    return val;
  };
}

/**
 * `f(..., f(xs[1], f(xs[0], init))...)`
 * This is different from `reduce` on the Array prototype. You'll find the
 * type signature there is
 *
 *     Array.prototype.reduce<T>: (f: (accum: T, value: T, index?: number, array?: T[]) => T, initVal: T) => T
 *
 * Whereas this reduce function can return a value whose type is different
 * than that of the array elements.
 * @deprecated ever since I learned about `reduce<T>(...)`
 * @summary An array reducer which can return an arbitrary value type.
 * @param xs array to be reduced
 * @param f reducing function
 * @param init initial value
 */
export function reduce<R, S>(
  xs: R[],
  f: (accum: S, value: R) => S,
  init: S
): S {
  return xs.reduce<S>(f, init);
  return array(init, (x: R, ys: S) => f(ys, x))(xs);
}

/**
 * `xs => [xs[0], f(xs[0], xs[1]), f(f(xs[0], xs[1]), xs[2]), ...]`
 * @summary Returns a function creates an array of running accumulations from an input array
 * @see [[cumSum]]
 * @param f accumulating function
 * @param xs an array to accumulate over
 */
export function accumulate<T>(f: (x: T, y: T) => T, xs: T[]): T[] {
  if (xs.length < 2) {
    return xs;
  } else {
    const x = xs[0];
    const ys = xs.slice(1);
    const ind = (u: T, vs: T[]) => vs.concat(f(u, vs[vs.length - 1]));
    return array([x], ind)(ys);
  }
}

/**
 * `[xs[0], xs[0] + xs[1], xs[0] + xs[1] + xs[2], ...]`
 * @summary Takes an array and returns the array of running totals
 */
export function cumSum(xs: number[]): number[] {
  return accumulate((x: number, y: number) => x + y, xs);
}

/**
 * @summary Flatly maps an array-valued function over an input array
 */
export function flatMap<R, S>(f: (x: R) => S[], xs: R[]): S[] {
  return array([], (x: R, ys: S[]) => ys.concat(f(x)))(xs);
}

/**
 * @summary Flattens an array of arrays
 */
export function flatten<T>(xss: T[][]): T[] {
  return flatMap<T[], T>(ident, xss);
}

/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Returns an array of specified length whose entries are `f` mapped over the indices.
 * @param len length of the resulting array
 * @param f function which will generate elements from their indices
 * @returns an array whose elements are `f` applied to their indices
 * @throws `RangeError` when array length is invalid, i.e. at least `2^32` or negative.
 */
export function from<T>(len: number, f: (idx: number) => T): T[] {
  if (len > Math.pow(2, 32) - 1 || len < 0) {
    throw new RangeError("Invalid array length.");
  }

  const arr = new Array<T>();

  for (let idx = 0; idx < len; idx++) {
    arr.push(f(idx));
  }
  return arr;
}

/**
 * Generates an array using an arithmetic sequence starting at `start`,
 * incrementing by `delta`, and stopping no later than `stop`
 * @summary Generates an array using an arithmetic sequence
 * @param [start=0]
 * @param stop
 * @param [delta=1]
 * @returns [start, start + delta, ..., start + n * delta], where n = Math.floor((stop - start) / delta)
 */
export function range(start = 0, stop: number, delta = 1): number[] {
  const len = delta === 0 ? 0 : Math.floor((stop - start) / delta);
  return from(Math.max(len, 0), idx => start + idx * delta);
}

/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Searches an array with a predicate returning the first element on which the predicate is true
 * @returns either returns the first element of `xs` that makes `f` true or returns null
 */
export function find<T>(xs: T[], f: (x: T) => boolean): Maybe<T> {
  for (const x of xs) {
    if (f(x)) {
      return x;
    }
  }
  return null;
}

/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Searches an array with a predicate returning the first index on whose value the predicate is true
 * @returns either the first index of `xs` whose element makes `f` true or returns -1
 */
export function findIndex<T>(xs: T[], f: (x: T) => boolean): number {
  for (let i = 0; i < xs.length; i++) {
    if (f(xs[i])) {
      return i;
    }
  }
  return -1;
}
