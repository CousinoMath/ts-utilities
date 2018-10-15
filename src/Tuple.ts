/**
 * @deprecated since Typescript 2.7 implemented them natively
 * `Tuple<R,S> = [R, S]`
 * @summary A type alias (now) for tuples
 */
export type Tuple<R, S> = [R, S];

/**
 * @deprecated since Typescript 2.7
 * `(x, y) => [x, y]`
 * @summary Constructs a tuple
 */
export function tuple<R, S>(x: R, y: S): Tuple<R, S> {
  return [x, y];
}

/**
 * `curried = x => y => [x, y]`
 * @summary Curried construction of a tuple.
 */
export function curried<R, S>(x: R): (y: S) => Tuple<R, S> {
  return (y: S) => tuple(x, y);
}

/**
 * `x => [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
export function product<R, T1, T2>(
  f: (x: R) => T1,
  g: (x: R) => T2
): (x: R) => Tuple<T1, T2> {
  return x => [f(x), g(x)];
}

/**
 * `xy => [xy[1], xy[0]]`
 * @summary Flips the order of a tuple
 */
export function flip<R, S>(xy: Tuple<R, S>): Tuple<S, R> {
  return [xy[1], xy[0]];
}

/**
 * `xy => [f(xy[0]), g(xy[1])]`
 * @summary Maps two functions over a tuple
 */
export function map<R1, R2, T1, T2>(
  f: (x: R1) => T1,
  g: (y: R2) => T2,
  xy: Tuple<R1, R2>
): Tuple<T1, T2> {
  return [f(xy[0]), g(xy[1])];
}
