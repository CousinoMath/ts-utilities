/**
 * A collection of Array utility functions.
 */
import {
  bottom,
  identity,
  isInteger,
  log2,
  makeMaybe,
  Maybe,
  Ordering,
  sign
} from './internal';

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
 * `[xs[0], xs[0] + xs[1], xs[0] + xs[1] + xs[2], ...]`
 * @summary Takes an array and returns the array of running totals
 */
export function cumSum(xs: number[]): number[] {
  return accumulate((x: number, y: number) => x + y, xs);
}

/**
 * @summary A polyfill for [Array.fill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
 */
export function fill<T>(arr: T[], val: T, start = 0, stop = arr.length): T[] {
  for (let i = start; i < stop; i++) {
    arr[i] = val;
  }
  return arr;
}

/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Searches an array with a predicate returning the first element on which the predicate is true
 * @returns either returns the first element of `xs` that makes `f` true or returns ⊥
 */
export function find<T>(xs: T[], f: (x: T) => boolean): Maybe<T> {
  for (const x of xs) {
    if (f(x)) {
      return x;
    }
  }
  return bottom;
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

/**
 * `first([]) = ⊥`
 * `first([x, ...rest]) = x`
 * @summary Returns the first element of an array if it exists, and ⊥ otherwise.
 */
export function first<T>(xs: T[]): Maybe<T> {
  return makeMaybe(xs.length > 0, () => xs[0]);
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
  return flatMap<T[], T>(identity, xss);
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
  if (len < 0 || log2(len) >= 32) {
    // Math.log(0) = -Infinity < 32
    throw new RangeError('Invalid array length.');
  }
  const arr: T[] = new Array(len);
  for (let idx = 0; idx < len; idx++) {
    arr[idx] = f(idx);
  }
  return arr;
}

/**
 * `last([]) = ⊥`
 * `last([...rest, x]) = x`
 * @summary Returns the last element of an array if it exists, and ⊥ otherwise.
 */
export function last<T>(xs: T[]): Maybe<T> {
  const len = xs.length;
  return makeMaybe(len > 0, () => xs[len - 1]);
}

/**
 * `nth([], _) = nth(_, 0.5) = nth(_, NaN) = nth(_, Infinity) = ⊥`
 * `nth([...firstNm1Elts, xn, ...rest], n) = xn`
 * @summary Returns the nth element of an array if it exists, and ⊥ otherwise.
 * @param n index of the element to return
 */
export function nth<T>(xs: T[], n: number): Maybe<T> {
  const len = xs.length;
  const inRange = len > 0 && isInteger(n) && n >= -0 && n < len;
  // arr[-0] === arr[0]
  return makeMaybe(inRange, () => xs[n]);
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
  if (typeof stop === 'undefined') {
    return from(Math.max(start, 0), identity);
  } else {
    const rng = stop - start;
    const len =
      Math.abs(delta) === 0 ? 0 : Math.floor((rng + sign(rng)) / delta);
    return from(Math.max(len, 0), idx => start + idx * delta);
  }
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
}

/**
 * @summary Returns a copy of given array sorted in ascending order.
 * @param ord ordering used to sort array
 */
export function sortOn<T>(ord: Ordering<T>, xs: T[]): T[] {
  function merge(ys1: T[], ys2: T[]): T[] {
    const len1 = ys1.length;
    const len2 = ys2.length;
    let i1 = 0;
    let i2 = 0;
    const ys: T[] = [];

    while (i1 < len1 && i2 < len2) {
      if (ord(ys1[i1], ys2[i2]) === 'GT') {
        ys.push(ys2[i2]);
        i2++;
      } else {
        ys.push(ys1[i1]);
        i1++;
      }
    }
    if (i1 === len1) {
      ys.push(...ys2.slice(i2));
    } else {
      ys.push(...ys1.slice(i1));
    }
    return ys;
  }

  let sorted: T[][] = xs.map(x => [x]);
  let results = [];
  while (sorted.length > 1) {
    if (sorted.length % 2 === 1) {
      const ys1 = sorted.pop();
      const ys2 = sorted.pop();
      if (typeof ys1 !== 'undefined' && typeof ys2 !== 'undefined') {
        sorted.push(merge(ys1, ys2));
      }
    }
    while (sorted.length > 1) {
      const ys1 = sorted.shift();
      const ys2 = sorted.shift();
      if (typeof ys1 !== 'undefined' && typeof ys2 !== 'undefined') {
        results.push(merge(ys1, ys2));
      }
    }
    sorted = results.concat(sorted);
    results = [];
  }
  return sorted[0];
}

/**
 * @summary Returns a copy of the given array with duplicates removed.
 * @param eq used to test equality between elements
 */
export function uniqueBy<T>(eq: (x: T, y: T) => boolean, xs: T[]): T[] {
  const ys = xs.slice(0);
  let len = ys.length;
  for (let i = 0; i < len; i++) {
    const x = ys[i];
    let j = i + 1;
    while (j < len) {
      if (eq(x, ys[j])) {
        ys.splice(j, 1);
        len--;
      } else {
        j++;
      }
    }
  }
  return ys;
}
