"use strict";
/**
 * A collection of Array utility functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("./Functions");
/**
 * `xs => [xs[0], f(xs[0], xs[1]), f(f(xs[0], xs[1]), xs[2]), ...]`
 * @summary Returns a function creates an array of running accumulations from an input array
 * @see [[cumSum]]
 * @param f accumulating function
 * @param xs an array to accumulate over
 */
function accumulate(f, xs) {
    if (xs.length < 2) {
        return xs;
    }
    else {
        const x = xs[0];
        const ys = xs.slice(1);
        const ind = (u, vs) => vs.concat(f(u, vs[vs.length - 1]));
        return array([x], ind)(ys);
    }
}
exports.accumulate = accumulate;
/**
 * @summary Creates a recursive function over arrays with arbitrary return type.
 * @param init value returned for an empty array
 * @param ind recursive rule applied to non-empty arrays
 */
function array(init, ind) {
    return xs => {
        let val = init;
        const len = xs.length;
        for (let i = 0; i < len; i++) {
            val = ind(xs[i], val);
        }
        return val;
    };
}
exports.array = array;
/**
 * `[xs[0], xs[0] + xs[1], xs[0] + xs[1] + xs[2], ...]`
 * @summary Takes an array and returns the array of running totals
 */
function cumSum(xs) {
    return accumulate((x, y) => x + y, xs);
}
exports.cumSum = cumSum;
/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Searches an array with a predicate returning the first element on which the predicate is true
 * @returns either returns the first element of `xs` that makes `f` true or returns null
 */
function find(xs, f) {
    for (const x of xs) {
        if (f(x)) {
            return x;
        }
    }
    return null;
}
exports.find = find;
/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Searches an array with a predicate returning the first index on whose value the predicate is true
 * @returns either the first index of `xs` whose element makes `f` true or returns -1
 */
function findIndex(xs, f) {
    for (let i = 0; i < xs.length; i++) {
        if (f(xs[i])) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
/**
 * @summary Flatly maps an array-valued function over an input array
 */
function flatMap(f, xs) {
    return array([], (x, ys) => ys.concat(f(x)))(xs);
}
exports.flatMap = flatMap;
/**
 * @summary Flattens an array of arrays
 */
function flatten(xss) {
    return flatMap(Functions_1.ident, xss);
}
exports.flatten = flatten;
/**
 * @deprecated since ES6 introduced this to the Array prototype
 * @summary Returns an array of specified length whose entries are `f` mapped over the indices.
 * @param len length of the resulting array
 * @param f function which will generate elements from their indices
 * @returns an array whose elements are `f` applied to their indices
 * @throws `RangeError` when array length is invalid, i.e. at least `2^32` or negative.
 */
function from(len, f) {
    if (len < 0 || Math.log2(len) >= 32) {
        // Math.log(0) = -Infinity < 32
        throw new RangeError("Invalid array length.");
    }
    const arr = new Array(len);
    for (let idx = 0; idx < len; idx++) {
        arr[idx] = f(idx);
    }
    return arr;
}
exports.from = from;
/**
 * Generates an array using an arithmetic sequence starting at `start`,
 * incrementing by `delta`, and stopping no later than `stop`
 * @summary Generates an array using an arithmetic sequence
 * @param [start=0]
 * @param stop
 * @param [delta=1]
 * @returns [start, start + delta, ..., start + n * delta], where n = Math.floor((stop - start) / delta)
 */
function range(start = 0, stop, delta = 1) {
    if (typeof stop === "undefined") {
        return from(Math.max(start, 0), Functions_1.ident);
    }
    else {
        const rng = stop - start;
        const len = Math.abs(delta) === 0 ? 0 : Math.floor((rng + Math.sign(rng)) / delta);
        return from(Math.max(len, 0), idx => start + idx * delta);
    }
}
exports.range = range;
/**
 * `f(..., f(xs[1], f(xs[0], init))...)`
 * This is different from `reduce` on the Array prototype. You'll find the
 * type signature there is
 *
 *     Array.prototype.reduce<T>: (f: (accum: T, value: T, index?: number, array?: T[]) => T, initVal: T) => T
 *
 * Whereas this reduce function can return a value whose type is different
 * than that of the array elements.
 * @deprecated ever since I learned about `reduce<T>(...)`
 * @summary An array reducer which can return an arbitrary value type.
 * @param xs array to be reduced
 * @param f reducing function
 * @param init initial value
 */
function reduce(xs, f, init) {
    return xs.reduce(f, init);
}
exports.reduce = reduce;
function sortBy(ord, xs) {
    function merge(ys1, ys2) {
        const len1 = ys1.length;
        const len2 = ys2.length;
        let i1 = 0;
        let i2 = 0;
        const ys = [];
        while (i1 < len1 && i2 < len2) {
            if (ord(ys1[i1], ys2[i2]) === "GT") {
                ys.push(ys2[i2]);
                i2++;
            }
            else {
                ys.push(ys1[i1]);
                i1++;
            }
        }
        if (i1 === len1) {
            ys.push(...ys2.slice(i2));
        }
        else {
            ys.push(...ys1.slice(i1));
        }
        return ys;
    }
    let sorted = xs.map(x => [x]);
    let results = [];
    while (sorted.length > 1) {
        if (sorted.length % 2 === 1) {
            const ys1 = sorted.pop();
            const ys2 = sorted.pop();
            if (typeof ys1 !== "undefined" && typeof ys2 !== "undefined") {
                sorted.push(merge(ys1, ys2));
            }
        }
        while (sorted.length > 1) {
            const ys1 = sorted.shift();
            const ys2 = sorted.shift();
            if (typeof ys1 !== "undefined" && typeof ys2 !== "undefined") {
                results.push(merge(ys1, ys2));
            }
        }
        sorted = results.concat(sorted);
        results = [];
    }
    return sorted[0];
}
exports.sortBy = sortBy;
function uniqueBy(eq, xs) {
    const ys = xs.slice(0);
    let len = ys.length;
    for (let i = 0; i < len; i++) {
        const x = ys[i];
        let j = i + 1;
        while (j < len) {
            if (eq(x, ys[j])) {
                ys.splice(j, 1);
                len--;
            }
            else {
                j++;
            }
        }
    }
    return ys;
}
exports.uniqueBy = uniqueBy;
//# sourceMappingURL=Arrays.js.map