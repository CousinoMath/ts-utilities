/**
 * @summary Identity function
 * @template T
 * @param {T} x
 * @returns {T}
 */
export function ident<T>(x: T): T { return x; }

/**
 * @summary Curry a function
 * @template R
 * @template S
 * @template T
 * @param {(x: R, y: S) => T} f
 * @returns {(x: R) => (y: S) => T}
 */
export function curry<R, S, T>(f: (x: R, y: S) => T): (x: R) => (y: S) => T {
  return (x) => (y) => f(x, y);
}

/**
 * @summary Uncurry a function
 * @template R
 * @template S
 * @template T
 * @param {function(R): function(S): T} f
 * @returns {function(R, S): T}
 */
export function uncurry<R, S, T>(f: (x: R) => (y: S) => T): (x: R, y: S) => T {
  return (x, y) => f(x)(y);
}

/**
 * @summary Creates a function with constant output
 * @template R
 * @template S
 * @param {R} x
 * @returns {(y: S) => R}
 */
export function constant<R, S>(x: R): (y: S) => R {
  return (y) => x;
}

/**
 * @summary Flips the arguments for a function that returns another function
 * @template R
 * @template S
 * @template T
 * @param {(x: R) => (y: S) => T} f
 * @returns {(y: S) => (x: R) => T}
 */
export function flip<R, S, T>(f: (x: R) => (y: S) => T): (y: S) => (x: R) => T {
  return (y) => (x) => f(x)(y);
}

/**
 * @summary Creates the composition of two functions
 * @template R
 * @template S
 * @template T
 * @param {(y: S) => T} g
 * @param {(x: R) => S} f
 * @returns {(x: R) => T}
 */
export function compose<R, S, T>(g: (y: S) => T, f: (x: R) => S): (x: R) => T {
  return (x) => g(f(x));
}

/**
 * @summary Threads a function `f` through a binary operation `op`
 * @param {function(R): S} f
 * @param {function(S, S): T} op
 * @returns {function(R, R): T} `(x, y) => op(f(x), f(y))`
 */
export function over<R, S, T>(f: (x: R) => S, op: (x: S, y: S) => T): (x: R, y: R) => T {
  return (x, y) => op(f(x), f(y));
}
