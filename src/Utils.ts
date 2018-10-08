/**
 * @summary Identity function
 * @param {T} x
 * @returns {T} `x`
 */
export function ident<T>(x: T): T { return x; }
/**
 * @summary Curry a function
 * @param {function(R, S): T} f
 * @returns {function(R): function(S): T} `x => y => f(x, y)`
 */
export function curry<R, S, T>(f: (x: R, y: S) => T): (x: R) => (y: S) => T {
  return (x) => (y) => f(x, y);
}
/**
 * @summary Uncurry a function
 * @param {function(R): function(S): T} f
 * @returns {function(R, S): T} `(x, y) => f(x)(y)`
 */
export function uncurry<R, S, T>(f: (x: R) => (y: S) => T): (x: R, y: S) => T {
  return (x, y) => f(x)(y);
}

/**
 * @summary Creates a function with constant output
 * @param {R} x
 * @returns {function(*): R} `y => x`
 */
export function constant<R, S>(x: R): (y: S) => R {
  return (y) => x;
}

/**
 * @summary Flips the arguments for a function that returns another function
 * @param {function(R): function(S): T} f
 * @returns {function(S): function(R): T} `y => x => f(x)(y)`
 */
export function flip<R, S, T>(f: (x: R) => (y: S) => T): (y: S) => (x: R) => T {
  return (y) => (x) => f(x)(y);
}

/**
 * @summary Creates the composition of two functions
 * @param {function(S): T} g
 * @returns {function(function(R): S): function(R): T} `f => x => g(f(x))`
 */
export function compose<R, S, T>(g: (y: S) => T): (f: (x: R) => S) => (x: R) => T {
  return (f) => (x) => g(f(x));
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
