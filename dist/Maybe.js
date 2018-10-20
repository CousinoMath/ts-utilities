"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Functions_1 = require("./Functions");
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
function bindToArray(f) {
    return function (xs) {
        var ys = [];
        for (var _i = 0, xs_1 = xs; _i < xs_1.length; _i++) {
            var x = xs_1[_i];
            maybe(0, function (y) { return ys.push(y); })(f(x));
        }
        return ys;
    };
}
exports.bindToArray = bindToArray;
/**
 * @summary Resulting function maps `f` over its entries, keeping only non-null results.
 */
function bindToMap(f) {
    return function (xs) {
        var ys = new Map();
        for (var _i = 0, xs_2 = xs; _i < xs_2.length; _i++) {
            var _a = xs_2[_i], xkey = _a[0], xval = _a[1];
            maybe(ys, function (ypair) { return ys.set(ypair[0], ypair[1]); })(f([xkey, xval]));
        }
        return ys;
    };
}
exports.bindToMap = bindToMap;
/**
 * @summary Resulting function maps `f` over its elements, keeping only non-null results.
 */
function bindToSet(f) {
    return function (xs) {
        var ys = new Set();
        for (var _i = 0, xs_3 = xs; _i < xs_3.length; _i++) {
            var x = xs_3[_i];
            maybe(ys, function (y) { return ys.add(y); })(f(x));
        }
        return ys;
    };
}
exports.bindToSet = bindToSet;
/**
 * `concatMaybe([null, ...rest]) = concatMaybe(rest)`
 * `concatMaybe([x, ...rest]) = [x, ...concatMaybe(rest)]`
 * @summary Takes an array of possibly null values and returns an array of only non-null values.
 */
function concatMaybes(xms) {
    var vals = [];
    for (var _i = 0, xms_1 = xms; _i < xms_1.length; _i++) {
        var xm = xms_1[_i];
        maybe(0, function (x) { return vals.push(x); })(xm);
    }
    return vals;
}
exports.concatMaybes = concatMaybes;
/**
 * `defaultTo(d)(null) = d`
 * `defaultTo(d)(x) = x`
 * @summary Returns the value from a nullable value or a default value
 */
function defaultTo(d, xm) {
    return maybe(d, function (x) { return Functions_1.ident(x); })(xm);
}
exports.defaultTo = defaultTo;
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
 * `lift(f)(null) = null`
 * `lift(f)(x) = f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 */
function lift(f) {
    return bind(f);
}
exports.lift = lift;
/**
 * Technically, this does *not* return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `maybe(nil, f)(null) = nil`
 * `maybe(nil, f)(x) = f(x)`
 * @summary Inductive rule of nullable types
 */
function maybe(nil, f) {
    return function (x) { return (x == null ? nil : f(x)); };
}
exports.maybe = maybe;
//# sourceMappingURL=Maybe.js.map