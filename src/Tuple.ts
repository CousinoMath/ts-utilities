/**
 * Helpers for tuples
 */

/**
 * @deprecated since Typescript 2.7 implemented them natively
 * `Tuple<R,S> = [R, S]`
 * @summary A type alias (now) for tuples
 */
export type Tuple<R, S> = [R, S];

/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
export function tuple<R, S>(x: R, y: S): [R, S] {
  return [x, y];
}

/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
export function curried<R, S>(x: R): (y: S) => [R, S] {
  return (y: S) => tuple(x, y);
}

/**
 * `product(f, g)(x) = [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
export function product<R, T1, T2>(
  f: (x: R) => T1,
  g: (x: R) => T2
): (x: R) => [T1, T2] {
  return x => [f(x), g(x)];
}

/**
 * `swap([x, y]) => [y, x]`
 * @summary Flips the order of a tuple
 */
export function swap<R, S>(xy: [R, S]): [S, R] {
  return [xy[1], xy[0]];
}

/**
 * `map(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
export function map<R1, R2, T1, T2>(
  f: (x: R1) => T1,
  g: (y: R2) => T2
): (xy: [R1, R2]) => [T1, T2] {
  return xy => [f(xy[0]), g(xy[1])];
}
