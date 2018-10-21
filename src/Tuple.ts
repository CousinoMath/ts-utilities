import { curry } from './Functions';

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
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
export function curried<R, S>(x: R): (y: S) => [R, S] {
  return curry<R, S, [R, S]>(tuple)(x);
}

/**
 * `map(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
export function map<R1, R2, T1, T2>(
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

// /**
//  * @summary A convenice function converting between 3-tuples.
//  * @see [[to3Tuple]]
//  */
// export function from3Tuple<R, S, T>([x, y, z]: [R, S, T]): [[R, S], T] {
//   return [[x, y], z];
// }

// /**
//  * @summary A convenice function converting between 4-tuples.
//  * @see [[to4Tuple]]
//  */
// export function from4Tuple<Q, R, S, T>([w, x, y, z]: [Q, R, S, T]): [
//   [[Q, R], S],
//   T
// ] {
//   return [[[w, x], y], z];
// }

// /**
//  * @summary A convenice function converting between 5-tuples.
//  * @see [[to5Tuple]]
//  */
// export function from5Tuple<P, Q, R, S, T>([v, w, x, y, z]: [P, Q, R, S, T]): [
//   [[[P, Q], R], S],
//   T
// ] {
//   return [[[[v, w], x], y], z];
// }

// /**
//  * @summary A convenice function converting between 3-tuples.
//  * @see [[from3Tuple]]
//  */
// export function to3Tuple<R, S, T>([[x, y], z]: [[R, S], T]): [R, S, T] {
//   return [x, y, z];
// }

// /**
//  * @summary A convenice function converting between 4-tuples.
//  * @see [[from4Tuple]]
//  */
// export function to4Tuple<Q, R, S, T>([[[w, x], y], z]: [[[Q, R], S], T]): [
//   Q,
//   R,
//   S,
//   T
// ] {
//   return [w, x, y, z];
// }

// /**
//  * @summary A convenice function converting between 5-tuples.
//  * @see [[from5Tuple]]
//  */
// export function to5Tuple<P, Q, R, S, T>([[[[v, w], x], y], z]: [
//   [[[P, Q], R], S],
//   T
// ]): [P, Q, R, S, T] {
//   return [v, w, x, y, z];
// }
