/**
 * A collection of functional programming utilities.
 */

/**
 * `ident(x) = x`
 * @summary Identity function
 */
export function ident<T>(x: T): T {
  return x;
}

/**
 * `curry(f)(x)(y) = f(x, y)`
 * @summary Curry a function
 */
export function curry<R, S, T>(f: (x: R, y: S) => T): (x: R) => (y: S) => T {
  return x => y => f(x, y);
}

/**
 * `uncurry(f)(x, y) = f(x)(y)`
 * @summary Uncurry a function
 */
export function uncurry<R, S, T>(f: (x: R) => (y: S) => T): (x: R, y: S) => T {
  return (x, y) => f(x)(y);
}

/**
 * `constant(x)(_) = x`
 * @summary Creates a function with constant output
 */
export function constant<R>(x: R): <S>(y: S) => R {
  return <S>(y: S) => x;
}

/**
 * `flip(f)(x)(y) = f(y)(x)`
 * @summary Flips the arguments for a function that returns another function
 */
export function flip<R, S, T>(f: (x: R) => (y: S) => T): (y: S) => (x: R) => T {
  return y => x => f(x)(y);
}

/**
 * `compose(g, f)(x) = g(f(x))`
 * @summary Creates the composition of two functions
 */
export function compose<R, S, T>(g: (y: S) => T, f: (x: R) => S): (x: R) => T {
  return (x: R) => g(f(x));
}

/**
 * `on(f, op)(x, y) = op(f(x), f(y))`
 * @summary Threads a function `f` through a binary operation `op`
 */
export function on<R, S, T>(
  f: (x: R) => S,
  op: (x: S, y: S) => T
): (x: R, y: R) => T {
  return (x, y) => op(f(x), f(y));
}
