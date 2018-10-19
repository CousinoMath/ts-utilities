"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("./Functions");
/**
 * Technically, this does *not* return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `maybe(nil, f)(null) = nil`
 * `maybe(nil, f)(x) = f(x)`
 * @summary Inductive rule of nullable types
 */
function maybe(nil, f) {
    return x => (x == null ? nil : f(x));
}
exports.maybe = maybe;
/**
 * `isNonNull(x) === true` if and only if `x != null`
 * @summary Tests if a nullable value is not null
 */
function isNonNull(xm) {
    return maybe(false, Functions_1.constant(true))(xm);
}
exports.isNonNull = isNonNull;
/**
 * `isNull(x) === true` if and only if `x == null`
 * @summary Tests if a nullable value is null
 */
function isNull(xm) {
    return maybe(true, Functions_1.constant(false))(xm);
}
exports.isNull = isNull;
/**
 * `defaultTo(d)(null) = d`
 * `defaultTo(d)(x) = x`
 * @summary Returns the value from a nullable value or a default value
 */
function defaultTo(d, xm) {
    return maybe(d, (x) => Functions_1.ident(x))(xm);
}
exports.defaultTo = defaultTo;
// /**
//  * `maybeToArray(null) = []`
//  * `maybeToArray(x) = [x]`
//  * @summary Turns a nullable value into an array
//  */
// export function maybeToArray<T>(xm: Maybe<T>): T[] {
//   return maybe([], (x: T) => [x])(xm);
// }
/**
 * `first([]) = null`
 * `first([x, ...rest]) = x`
 * @summary Returns the first element of an array if it exists, and null otherwise.
 */
function first(xs) {
    return xs.length > 0 ? xs[0] : null;
}
exports.first = first;
/**
 * `last([]) = null`
 * `last([...rest, x]) = x`
 * @summary Returns the last element of an array if it exists, and null otherwise.
 */
function last(xs) {
    const len = xs.length;
    return len > 0 ? xs[len - 1] : null;
}
exports.last = last;
/**
 * `nth([], _) = nth(_, 0.5) = nth(_, NaN) = nth(_, Infinity) = null`
 * `nth([...firstNm1Elts, xn, ...rest], n) = xn`
 * @summary Returns the nth element of an array if it exists, and null otherwise.
 * @param n index of the element to return
 */
function nth(xs, n) {
    const len = xs.length;
    const inRange = len > 0 && Number.isInteger(n) && n >= 0 && n < len;
    return inRange ? xs[n] : null;
}
exports.nth = nth;
/**
 * `concatMaybe([null, ...rest]) = concatMaybe(rest)`
 * `concatMaybe([x, ...rest]) = [x, ...concatMaybe(rest)]`
 * @summary Takes an array of possibly null values and returns an array of only non-null values.
 */
function concatMaybes(xms) {
    const vals = [];
    for (const xm of xms) {
        maybe(0, x => vals.push(x))(xm);
    }
    return vals;
}
exports.concatMaybes = concatMaybes;
/**
 * `lift(f)(null) = null`
 * `lift(f)(x) = f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 */
function lift(f) {
    return maybe(null, f);
}
exports.lift = lift;
/**
 * `bind(f)(null) = null`
 * `bind(f)(x) = f(x)`
 * @summary An alias of `lift`
 * @see [[lift]]
 */
function bind(f) {
    return maybe(null, f);
}
exports.bind = bind;
// const monadReduction: <T>(xmm: Maybe<Maybe<T>>) => Maybe<T> = bind(lift(ident));
/**
 * `liftToArray(f)(xs) = concatMaybes(xs.map(f))`
 * @summary Resulting function maps `f` over its input and outputs only non null results.
 */
function liftToArray(f) {
    return xs => {
        const ys = [];
        for (const x of xs) {
            maybe(0, y => ys.push(y))(f(x));
        }
        return ys;
    };
}
exports.liftToArray = liftToArray;
function liftToSet(f) {
    return xs => {
        const ys = new Set();
        for (const x of xs) {
            maybe(ys, y => ys.add(y))(f(x));
        }
        return ys;
    };
}
exports.liftToSet = liftToSet;
function liftToMap(f) {
    return xs => {
        const ys = new Map();
        for (const [xkey, xval] of xs) {
            maybe(ys, ypair => ys.set(ypair[0], ypair[1]))(f([xkey, xval]));
        }
        return ys;
    };
}
exports.liftToMap = liftToMap;
//# sourceMappingURL=Maybe.js.map