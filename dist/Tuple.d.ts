/**
 * @typedef Tuple
 * @summary Tuple<R,S> = [R, S]`
 */
export declare type Tuple<R, S> = [R, S];
/**
 * @summary Constructs a tuple
 * @param {R} x
 * @param {S} y
 * @returns {Tuple<R,S>} `(x, y) => [x, y]`
 */
export declare function tuple<R, S>(x: R, y: S): Tuple<R, S>;
/**
 * `curried = x => y => [x, y]`
 * @summary Curried construction of a tuple.
 */
export declare let curried: (x: {}) => (y: {}) => [{}, {}];
/**
 * @summary Creates a function returning a tuple from two functions that share a common input type
 * @param {function(R): T1} f
 * @param {function(R): T2} g
 * @returns {function(R): Tuple<T1,T2>} `x => [f(x), g(x)]`
 */
export declare function product<R, T1, T2>(f: (x: R) => T1, g: (x: R) => T2): (x: R) => Tuple<T1, T2>;
/**
 * @summary Flips the order of a tuple
 * @param {Tuple<R, S>} xy
 * @returns {Tuple<S, R>} `xy => [xy[1], xy[0]]`
 */
export declare function flip<R, S>(xy: Tuple<R, S>): Tuple<S, R>;
/**
 * @summary Maps two functions over a tuple
 * @param {function(R1): T1} f
 * @param {function(R2): T2} g
 * @returns {function(Tuple<R1,R2>): Tuple<T1, T2>} `xy => [f(xy[0]), g(xy[1])]`
 */
export declare function map<R1, R2, T1, T2>(f: (x: R1) => T1, g: (y: R2) => T2): (xy: Tuple<R1, R2>) => Tuple<T1, T2>;
