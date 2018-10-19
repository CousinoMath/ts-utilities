"use strict";
/**
 * Helpers for finite and infinite Iterables
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("./Functions");
/**
 * @summary Applies a function over the elements of an iterable.
 */
function map(fn) {
    function* generatorT(xs) {
        for (const x of xs) {
            yield fn(x);
        }
    }
    return generatorT;
}
exports.map = map;
/**
 * @summary Filter an iterable to one whose elements all make `pred` true.
 */
function filter(pred) {
    function* generatorT(xs) {
        for (const x of xs) {
            if (pred(x)) {
                yield x;
            }
        }
    }
    return generatorT;
}
exports.filter = filter;
/**
 * @summary Maps a function over elements of an iterable and concatenates the results.
 */
function concatMap(fn) {
    function* generatorT(xs) {
        for (const x of xs) {
            for (const y of fn(x)) {
                yield y;
            }
        }
    }
    return generatorT;
}
exports.concatMap = concatMap;
/**
 * @summary Takes the first `n` elements of an iterable and return the results as an array.
 * @param n a positive integer
 */
function take(n) {
    if (!Number.isInteger(n) || n === 0) {
        return (xs) => [];
    }
    if (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) {
        return Functions_1.ident;
    }
    if (n > 0) {
        return (xs) => {
            const arr = [];
            let count = n;
            const iterT = xs[Symbol.iterator]();
            let nextT = iterT.next();
            while (count-- > 0 && !nextT.done) {
                arr.push(nextT.value);
                nextT = iterT.next();
            }
            return arr;
        };
    }
    else {
        return (xs) => {
            return {
                [Symbol.iterator]() {
                    const keep = [];
                    const iterT = xs[Symbol.iterator]();
                    let nextT = iterT.next();
                    let count = 0;
                    while (count-- > n && !nextT.done) {
                        keep.push(nextT.value);
                        nextT = iterT.next();
                    }
                    while (!nextT.done) {
                        keep.shift();
                        keep.push(nextT.value);
                        nextT = iterT.next();
                    }
                    return keep[Symbol.iterator]();
                }
            };
        };
    }
}
exports.take = take;
/**
 * @summary Drops the first `n` elements of an iterable.
 * @param n a positive integer
 */
function drop(n) {
    if (Number.isNaN(n) || n === 0) {
        return Functions_1.ident;
    }
    if (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) {
        return (xs) => [];
    }
    if (n > 0) {
        return (xs) => {
            let count = n;
            const iterT = xs[Symbol.iterator]();
            let nextT = iterT.next();
            while (count-- > 0 && !nextT.done) {
                nextT = iterT.next();
            }
            if (nextT.done) {
                return {
                    [Symbol.iterator]() {
                        return {
                            next(y) {
                                return nextT;
                            }
                        };
                    }
                };
            }
            else {
                return {
                    [Symbol.iterator]() {
                        return iterT;
                    }
                };
            }
        };
    }
    else {
        return (xs) => {
            const keep = [];
            const discard = [];
            const iterT = xs[Symbol.iterator]();
            let nextT = iterT.next();
            let count = 0;
            while (count-- > n && !nextT.done) {
                discard.push(nextT.value);
                nextT = iterT.next();
            }
            while (!nextT.done) {
                keep.push(discard[0]);
                discard.shift();
                discard.push(nextT.value);
            }
            return keep;
        };
    }
}
exports.drop = drop;
/**
 * @summary Takes the shortest subsequence of an iterable whose elements all make `pred` true.
 */
function takeWhile(pred) {
    function* generatorT(xs) {
        const prev = [];
        for (const x of xs) {
            if (!pred(x)) {
                return prev.length === 0 ? undefined : prev.pop();
            }
            if (prev.length > 0) {
                yield prev[(prev.length = 1)];
                prev.pop();
                prev.push(x);
            }
            else {
                prev.push(x);
            }
        }
    }
    return generatorT;
}
exports.takeWhile = takeWhile;
/**
 * @summary Drops the shortest subsequence of an iterable whose elements all make `pred` true.
 */
function dropWhile(pred) {
    return xs => {
        const iterT = xs[Symbol.iterator]();
        let nextT = iterT.next();
        while (!nextT.done && pred(nextT.value)) {
            nextT = iterT.next();
        }
        return {
            [Symbol.iterator]() {
                if (nextT.done) {
                    return {
                        next(y) {
                            return nextT;
                        }
                    };
                }
                else {
                    // @todo this skips over the first false result
                    return iterT;
                }
            }
        };
    };
}
exports.dropWhile = dropWhile;
/**
 * @summary Returns an infinite iterable which cycles through the elements of `xs`
 */
function* cycle(xs) {
    while (true) {
        for (const x of xs) {
            yield x;
        }
    }
}
exports.cycle = cycle;
/**
 * @summary Returns an infinite iterable which repeatedly returns `x`
 */
function* repeat(x) {
    while (true) {
        yield x;
    }
}
exports.repeat = repeat;
/**
 * @summary Returns the infinite iterable `(0, 1, 2, 3, ...)`.
 */
function* naturals() {
    let n = 0;
    while (true) {
        yield n++;
    }
}
exports.naturals = naturals;
/**
 * @summary Returns true if and only if every element of the iterable makes `pred` true.
 * Short-circuits once a false is observed.
 */
function every(pred) {
    return xs => {
        for (const x of xs) {
            if (!pred(x)) {
                return false;
            }
        }
        return true;
    };
}
exports.every = every;
/**
 * @summary Returns true if and only if there is at least one element of the iterable which makes `pred` true.
 * Short-circuits once a true is observed.
 */
function some(pred) {
    return xs => {
        for (const x of xs) {
            if (pred(x)) {
                return true;
            }
        }
        return false;
    };
}
exports.some = some;
/**
 * @summary Applies a reduction over the elements of an iterable.
 * @see [[iterable]]
 */
function reduce(fn, init) {
    return iterable(init, fn);
}
exports.reduce = reduce;
/**
 * @summary Applies a reduction over the elements of an iterable and returns the partial results
 */
function accumulate(fn, init) {
    function* generatorT(xs) {
        let valT = init;
        yield valT;
        for (const x of xs) {
            valT = fn(valT, x);
            yield valT;
        }
    }
    return generatorT;
}
exports.accumulate = accumulate;
/**
 * @summary Zips up two iterables into one iterable of tuples.
 * Stops as soon as one of the two iterables stops.
 */
function zip(xs, ys) {
    return {
        [Symbol.iterator]() {
            const iterS = xs[Symbol.iterator]();
            const iterT = ys[Symbol.iterator]();
            let nextS = iterS.next();
            let nextT = iterT.next();
            return {
                next(y) {
                    const done = nextS.done && nextT.done;
                    const value = [nextS.value, nextT.value];
                    nextS = iterS.next();
                    nextT = iterT.next();
                    return { done, value };
                }
            };
        }
    };
}
exports.zip = zip;
/**
 * @summary Unzips an iterable of tuples into a tuple of iterables.
 */
function unzip(xys) {
    const iterS = [];
    const iterT = [];
    for (const [x, y] of xys) {
        iterS.push(x);
        iterT.push(y);
    }
    return [iterS, iterT];
}
exports.unzip = unzip;
/**
 * @summary Builds functions over iterables recursively.
 */
function iterable(init, fn) {
    return xs => {
        let valT = init;
        for (const x of xs) {
            valT = fn(valT, x);
        }
        return valT;
    };
}
exports.iterable = iterable;
/**
 * @summary Joins together an iterable collection of iterables
 * Be careful regarding infinite iterables.
 */
function* concat(xss) {
    for (const xs of xss) {
        for (const x of xs) {
            yield x;
        }
    }
}
exports.concat = concat;
/**
 * @summary Interleaves two iterables into one.
 * Stops as soon as one of the two iterables stops.
 */
function interleave(xs, ys) {
    return {
        [Symbol.iterator]() {
            const iterX = xs[Symbol.iterator]();
            const iterY = ys[Symbol.iterator]();
            let turnX = true;
            let lastT = iterX.next();
            let done = lastT.done;
            return {
                next(y) {
                    if (done) {
                        return lastT;
                    }
                    const nextT = lastT;
                    turnX = !turnX;
                    lastT = turnX ? iterX.next() : iterY.next();
                    done = done || lastT.done;
                    return nextT;
                }
            };
        }
    };
}
exports.interleave = interleave;
/**
 * @summary Returns an iterable that generates only unique values.
 * This uses a Set as a cache for values that have been seen
 * already. So mindful of the space consumed when passing in
 * a large iterable.
 */
function* unique(xs) {
    const seen = new Set();
    for (const x of xs) {
        if (!seen.has(x)) {
            seen.add(x);
            yield x;
        }
    }
}
exports.unique = unique;
/**
 * @summary Bundles the results of an iterable into groups of `n`.
 * `n` is allowed to be +Infinity, in which case, the first
 * bundle returned contains everything. Be careful about
 * infinite iterables.
 */
function bundle(n) {
    if ((!Number.isInteger(n) && n !== Number.POSITIVE_INFINITY) || n <= 1) {
        return (xs) => map((x) => [x])(xs);
    }
    function* generator(xs) {
        let nextBundle = [];
        for (const x of xs) {
            if (nextBundle.length < n) {
                nextBundle.push(x);
            }
            else {
                yield nextBundle;
                nextBundle = [];
            }
        }
        return nextBundle;
    }
    return generator;
}
exports.bundle = bundle;
/**
 * @summary Generates all values from an iterable and returns them as an array.
 * This function short-circuits when `xs` is an array. Be
 * careful about infinite iterables.
 */
function toArray(xs) {
    if (xs instanceof Array) {
        return xs;
    }
    const arr = [];
    const iterT = xs[Symbol.iterator]();
    let nextT = iterT.next();
    while (!nextT.done) {
        arr.push(nextT.value);
        nextT = iterT.next();
    }
    return arr;
}
exports.toArray = toArray;
//# sourceMappingURL=Iterable.js.map