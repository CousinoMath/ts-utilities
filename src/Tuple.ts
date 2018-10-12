/**
 * @deprecated since Typescript 2.7 implemented them natively
 * `Tuple<R,S> = [R, S]`
 * @summary A type alias (now) for tuples
 * @typedef Tuple
 * @template R
 * @template S
 */
export type Tuple<R, S> = [R, S];

/**
 * @deprecated since Typescript 2.7
 * `(x, y) => [x, y]`
 * @summary Constructs a tuple
 * @template R
 * @template S
 * @param {R} x
 * @param {S} y
 * @returns {Tuple<R,S>}
 */
export function tuple<R, S>(x: R, y: S): Tuple<R, S> {
    return [x, y];
}

/**
 * `curried = x => y => [x, y]`
 * @summary Curried construction of a tuple.
 * @template R
 * @template S
 * @param {R} x
 * @returns {(y: S) => Tuple<R, S>}
 */
export function curried<R, S>(x: R): (y: S) => Tuple<R, S> {
    return (y: S) => tuple(x, y);
}

/**
 * `x => [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 * @template R
 * @template T1
 * @template T2
 * @param {(x: R) => T1} f
 * @param {(x: R) => T2} g
 * @returns {(x: R) => Tuple<T1,T2>}
 */
export function tupleProd<R, T1, T2>(f: (x: R) => T1, g: (x: R) => T2): (x: R) => Tuple<T1, T2> {
    return (x) => [f(x), g(x)];
}

/**
 * `xy => [xy[1], xy[0]]`
 * @summary Flips the order of a tuple
 * @template R
 * @template S
 * @param {Tuple<R, S>} xy
 * @returns {Tuple<S, R>}
 */
export function tupleFlip<R, S>(xy: Tuple<R, S>): Tuple<S, R> {
    return [xy[1], xy[0]];
}

/**
 * `xy => [f(xy[0]), g(xy[1])]`
 * @summary Maps two functions over a tuple
 * @template R1
 * @template R2
 * @template T1
 * @template T2
 * @param {(x: R1) => T1} f
 * @param {(y: R2) => T2} g
 * @param {Tuple<R1, R2>} xy
 * @returns {(xy: Tuple<R1,R2>) => Tuple<T1, T2>}
 */
export function tupleMap<R1, R2, T1, T2>(f: (x: R1) => T1, g: (y: R2) => T2, xy: Tuple<R1, R2>): Tuple<T1, T2> {
    return [f(xy[0]), g(xy[1])];
}
