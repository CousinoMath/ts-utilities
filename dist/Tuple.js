/**
 * @deprecated since Typescript 2.7
 * `(x, y) => [x, y]`
 * @summary Constructs a tuple
 * @export
 * @template R
 * @template S
 * @param {R} x
 * @param {S} y
 * @returns {Tuple<R,S>}
 */
export function tuple(x, y) {
    return [x, y];
}
/**
 * `curried = x => y => [x, y]`
 * @summary Curried construction of a tuple.
 * @export
 * @template R
 * @template S
 * @param {R} x
 * @returns {(y: S) => Tuple<R, S>}
 */
export function curried(x) {
    return (y) => tuple(x, y);
}
/**
 * `x => [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 * @export
 * @template R
 * @template T1
 * @template T2
 * @param {(x: R) => T1} f
 * @param {(x: R) => T2} g
 * @returns {(x: R) => Tuple<T1,T2>}
 */
export function tupleProd(f, g) {
    return (x) => [f(x), g(x)];
}
/**
 * `xy => [xy[1], xy[0]]`
 * @summary Flips the order of a tuple
 * @export
 * @template R
 * @template S
 * @param {Tuple<R, S>} xy
 * @returns {Tuple<S, R>}
 */
export function tupleFlip(xy) {
    return [xy[1], xy[0]];
}
/**
 * `xy => [f(xy[0]), g(xy[1])]`
 * @summary Maps two functions over a tuple
 * @export
 * @template R1
 * @template R2
 * @template T1
 * @template T2
 * @param {(x: R1) => T1} f
 * @param {(y: R2) => T2} g
 * @param {Tuple<R1, R2>} xy
 * @returns {(xy: Tuple<R1,R2>) => Tuple<T1, T2>}
 */
export function tupleMap(f, g, xy) {
    return [f(xy[0]), g(xy[1])];
}
//# sourceMappingURL=Tuple.js.map