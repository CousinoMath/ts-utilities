/**
 * @summary Identity function
 * @param {T} x
 * @returns {T} `x`
 */
export declare function ident<T>(x: T): T;
/**
 * @summary Curry a function
 * @param {function(R, S): T} f
 * @returns {function(R): function(S): T} `x => y => f(x, y)`
 */
export declare function curry<R, S, T>(f: (x: R, y: S) => T): (x: R) => (y: S) => T;
/**
 * @summary Uncurry a function
 * @param {function(R): function(S): T} f
 * @returns {function(R, S): T} `(x, y) => f(x)(y)`
 */
export declare function uncurry<R, S, T>(f: (x: R) => (y: S) => T): (x: R, y: S) => T;
/**
 * @summary Creates a function with constant output
 * @param {R} x
 * @returns {function(*): R} `y => x`
 */
export declare function constant<R, S>(x: R): (y: S) => R;
/**
 * @summary Flips the arguments for a function that returns another function
 * @param {function(R): function(S): T} f
 * @returns {function(S): function(R): T} `y => x => f(x)(y)`
 */
export declare function flip<R, S, T>(f: (x: R) => (y: S) => T): (y: S) => (x: R) => T;
/**
 * @summary Creates the composition of two functions
 * @param {function(S): T} g
 * @returns {function(function(R): S): function(R): T} `f => x => g(f(x))`
 */
export declare function compose<R, S, T>(g: (y: S) => T): (f: (x: R) => S) => (x: R) => T;
/**
 * @summary Threads a function `f` through a binary operation `op`
 * @param {function(R): S} f
 * @param {function(S, S): T} op
 * @returns {function(R, R): T} `(x, y) => op(f(x), f(y))`
 */
export declare function over<R, S, T>(f: (x: R) => S, op: (x: S, y: S) => T): (x: R, y: R) => T;
/**
 * @summary Returns an array of an arithmetic sequence of numbers
 * @param {number} start the number which begins the array
 * @param {number} stop the number which is the upper bound for the end of the array
 * @param {number} delta the increment between two array values (assumed to be not equal to 0)
 * @returns {Array<number>} `[start, start + delta, ..., start + n * delta]` where `n = Math.floor((stop - start) / delta)`
 */
export declare function range(start: number, stop: number, delta: number): Array<number>;
