/**
 * @summary Identity function
 */
export function ident<T>(x: T): T {
  return x;
}

/**
 * @summary Curry a function
 */
export function curry<R, S, T>(f: (x: R, y: S) => T): (x: R) => (y: S) => T {
  return x => y => f(x, y);
}

/**
 * @summary Uncurry a function
 */
export function uncurry<R, S, T>(f: (x: R) => (y: S) => T): (x: R, y: S) => T {
  return (x, y) => f(x)(y);
}

/**
 * @summary Creates a function with constant output
 */
export function constant<R, S>(x: R): (y: S) => R {
  return y => x;
}

/**
 * @summary Flips the arguments for a function that returns another function
 */
export function flip<R, S, T>(f: (x: R) => (y: S) => T): (y: S) => (x: R) => T {
  return y => x => f(x)(y);
}

/**
 * @summary Creates the composition of two functions
 */
export function compose<R, S, T>(g: (y: S) => T, f: (x: R) => S): (x: R) => T {
  return x => g(f(x));
}

/**
 * @summary Threads a function `f` through a binary operation `op`
 */
export function over<R, S, T>(
  f: (x: R) => S,
  op: (x: S, y: S) => T
): (x: R, y: R) => T {
  return (x, y) => op(f(x), f(y));
}
