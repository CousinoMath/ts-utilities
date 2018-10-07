import {ident} from "./Utils";

/**
 * @summary Creates a recursive function over arrays with arbitrary return type.
 * @param {S} init value returned for an empty array
 * @param {function(T,S): S} ind recursive rule applied to non-empty arrays
 * @returns {function(Array<T>): S}
 */
export function array<T, S>(init: S, ind: (x: T, ys: S) => S): (xs: T[]) => S {
    return (xs) => (xs.length === 0 ? init : array(ind(xs[0], init), ind)(xs.slice(1)));
}

/**
 * @summary An `Array` reducer which can return an arbitrary value type.
 * @param {Array<T>} xs array to be reduced
 * @param {function(S, T): S} f reducing function
 * @param {S} init initial value
 * @returns {S} `f(..., f(xs[1], f(xs[0], init))...)`
 */
export function reduce<T, S>(xs: T[], f: (accum: S, value: T) => S, init: S): S {
    return array(init, (x: T, ys: S) => f(ys, x))(xs);
}

/**
 * @summary Returns a function creates an array of running accumulations from an input array
 * @see cumSum
 * @param {function(T,T): T} f accumulating function
 * @returns {function(Array<T>): Array<T>} `xs => [xs[0], f(xs[0], xs[1]), f(f(xs[0], xs[1]), xs[2]), ...]`
 */
export function accumulate<T>(f: (x: T, y: T) => T): (xs: T[]) => T[] {
    return (xs) => {
        if (xs.length < 2) {
            return xs;
        } else {
            const x = xs[0];
            const ys = xs.slice(1);
            const ind = (u: T, vs: T[]) => vs.concat(f(u, vs[vs.length - 1]));
            return array([x], ind)(ys);
        }
    };
}

/**
 * @function cumSum
 * @summary Takes an array and returns the array of running totals
 * @param {Array<T>} xs
 * @returns {Array<T>} `[xs[0], xs[0] + xs[1], xs[0] + xs[1] + xs[2], ...]`
 */
export const cumSum = accumulate((x: number, y: number) => x + y);

/**
 * @summary Flatly maps an array-valued function over an input array
 * @param {Array<Array<T>>} xss
 * @returns {Array<T>}
 */
export function flatMap<T, S>(f: (x: T) => S[]): (xs: T[]) => S[] {
    return array([], (x: T, ys: S[]) => ys.concat(f(x)));
}

/**
 * @summary Flattens an array of arrays
 * @param {Array<Array<T>>} xss
 * @returns {Array<T>}
 */
export function flatten<T>(xss: T[][]): T[] {
    return flatMap<T[], T>(ident)(xss);
}

/**
 * @summary Returns an array of specified length whose entries are `f` mapped over the indices.
 * @param {number} len length of the resulting array
 * @param {function(number): T} f function that will generate the elements from their indices
 * @returns {Array<T>}
 */
export function from<T>(len: number, f: (idx: number) => T): T[] {
    return (new Array(len)).map((_, index) => f(index));
}

/**
 * @summary Generates an array using an arithmetic sequence
 * Generates an array using an arithmetic sequence starting at `start`,
 * incrementing by `delta`, and stopping no later than `stop`
 * @param {number=} start initial value, defaults to `0`
 * @param {number} stop stopping value
 * @param {number=} delta increment, defaults to `1`
 * @returns {Array<number>} `[start, ..., start + n * delta]` where `n = Math.floor((stop - start) / delta)`
 */
export function range(start = 0, stop: number, delta = 1): number[] {
    const len = delta === 0 || start >= stop ? 0 : Math.floor((stop - start) / delta);
    return from(len, (idx) => start + idx * delta);
}

/**
 * @summary Searches an array with a predicate returning the first element on which the predicate is true
 * @param {Array<T>} xs
 * @param {function(T): boolean} f predicate
 * @returns {T | null} returns the first element on which the predicate is true or returns null
 */
export function find<T>(xs: T[], f: (x: T) => boolean): T | null {
    for (const x of xs) {
        if (f(x)) { return x; }
    }
    return null;
}

/**
 * @summary Searches an array with a predicate returning the first index on whose value the predicate is true
 * @param {Array<T>} xs
 * @param {function(T): boolean} f predicate
 * @returns {number} returns the first index on whose value the predicate is true or returns -1
 */
export function findIndex<T>(xs: T[], f: (x: T) => boolean): number {
    for (let i = 0; i < xs.length; i++) {
        if (f(xs[i])) { return i; }
    }
    return -1;
}
