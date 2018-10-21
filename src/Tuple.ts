/**
 * Helpers for tuples
 */

import { curry } from './internal';

/**
 * @deprecated since Typescript 2.7 implemented them natively
 * `Tuple<R,S> = [R, S]`
 * @summary A type alias (now) for tuples
 */
export type Tuple<R, S> = [R, S];

/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
export function curried<R, S>(x: R): (y: S) => [R, S] {
  return curry<R, S, [R, S]>(tuple)(x);
}

/**
 * `mapTuple(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
export function mapTuple<R1, R2, T1, T2>(
  f: (x: R1) => T1,
  g: (y: R2) => T2
): (xy: [R1, R2]) => [T1, T2] {
  return ([x, y]: [R1, R2]) => [f(x), g(y)];
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
export function swap<R, S>([x, y]: [R, S]): [S, R] {
  return [y, x];
}

/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
export function tuple<R, S>(x: R, y: S): [R, S] {
  return [x, y];
}
