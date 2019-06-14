/**
 * Helpers for tuples
 */
/**
 * @deprecated since Typescript 2.7 implemented them natively
 * `Tuple<R,S> = [R, S]`
 * @summary A type alias (now) for tuples
 */
export declare type Tuple<R, S> = [R, S];
/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
export declare function curried<R, S>(x: R): (y: S) => [R, S];
/**
 * `mapTuple(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
export declare function mapTuple<R1, R2, T1, T2>(f: (x: R1) => T1, g: (y: R2) => T2): (xy: [R1, R2]) => [T1, T2];
/**
 * `product(f, g)(x) = [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
export declare function product<R, T1, T2>(f: (x: R) => T1, g: (x: R) => T2): (x: R) => [T1, T2];
/**
 * `swap([x, y]) => [y, x]`
 * @summary Flips the order of a tuple
 */
export declare function swap<R, S>([x, y]: [R, S]): [S, R];
/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
export declare function tuple<R, S>(x: R, y: S): [R, S];
