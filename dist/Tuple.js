import { curry } from "./Utils";
/**
 * @summary Constructs a tuple
 * @param {R} x
 * @param {S} y
 * @returns {Tuple<R,S>} `(x, y) => [x, y]`
 */
export function tuple(x, y) {
    return [x, y];
}
/**
 * `curried = x => y => [x, y]`
 * @summary Curried construction of a tuple.
 */
export var curried = curry(tuple);
/**
 * @summary Creates a function returning a tuple from two functions that share a common input type
 * @param {function(R): T1} f
 * @param {function(R): T2} g
 * @returns {function(R): Tuple<T1,T2>} `x => [f(x), g(x)]`
 */
export function product(f, g) {
    return function (x) { return [f(x), g(x)]; };
}
/**
 * @summary Flips the order of a tuple
 * @param {Tuple<R, S>} xy
 * @returns {Tuple<S, R>} `xy => [xy[1], xy[0]]`
 */
export function flip(xy) {
    return [xy[1], xy[0]];
}
/**
 * @summary Maps two functions over a tuple
 * @param {function(R1): T1} f
 * @param {function(R2): T2} g
 * @returns {function(Tuple<R1,R2>): Tuple<T1, T2>} `xy => [f(xy[0]), g(xy[1])]`
 */
export function map(f, g) {
    return function (xy) { return [f(xy[0]), g(xy[1])]; };
}
//# sourceMappingURL=Tuple.js.map