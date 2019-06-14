"use strict";
/**
 * Maybe extends a type to include ⊥ as a possible value.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
/**
 * @summary A type alias that extends a type to be nullable.
 */
exports.bottom = undefined;
/**
 * `bindMaybe(f)(⊥) = ⊥`
 * `bindMaybe(f)(x) = f(x)`
 * @summary An alias of `lift`
 * @see [[lift]]
 */
function bindMaybe(f) {
    return maybe(exports.bottom, f);
}
exports.bindMaybe = bindMaybe;
/**
 * `liftToArray(f)(xs) = concatMaybes(xs.map(f))`
 * @summary Resulting function maps `f` over its input and outputs only non ⊥ results.
 */
function bindToArray(f) {
    return (xs) => {
        const ys = [];
        for (const x of xs) {
            maybe(0, (y) => ys.push(y))(f(x));
        }
        return ys;
    };
}
exports.bindToArray = bindToArray;
/**
 * `concatMaybe([⊥, ...rest]) = concatMaybe(rest)`
 * `concatMaybe([x, ...rest]) = [x, ...concatMaybe(rest)]`
 * @summary Takes an array of possibly ⊥ values and returns an array of only non-⊥ values.
 */
function concatMaybes(xms) {
    const vals = [];
    for (const xm of xms) {
        maybe(0, (x) => vals.push(x))(xm);
    }
    return vals;
}
exports.concatMaybes = concatMaybes;
/**
 * `defaultTo(d)(⊥) = d`
 * `defaultTo(d)(x) = x`
 * @summary Returns the value from a nullable value or a default value
 */
function defaultTo(d, xm) {
    return maybe(d, (x) => internal_1.identity(x))(xm);
}
exports.defaultTo = defaultTo;
/**
 * `isNonNull(x) === true` if and only if `x != ⊥`
 * @summary Tests if a nullable value is not ⊥
 */
function isNonNull(xm) {
    return maybe(false, internal_1.constant(true))(xm);
}
exports.isNonNull = isNonNull;
/**
 * `isNull(x) === true` if and only if `x == ⊥`
 * @summary Tests if a nullable value is ⊥
 */
function isNull(xm) {
    return maybe(true, internal_1.constant(false))(xm);
}
exports.isNull = isNull;
/**
 * `liftMaybe(f)(⊥) = ⊥`
 * `liftMaybe(f)(x) = f(x)`
 * @summary Lifts a function over non-⊥ values to one over nullable values
 */
function liftMaybe(f) {
    return bindMaybe(f);
}
exports.liftMaybe = liftMaybe;
/**
 * @summary Makes a maybe from a value and a boolean
 */
function makeMaybe(isNonNil, value) {
    return isNonNil ? value() : exports.bottom;
}
exports.makeMaybe = makeMaybe;
/**
 * Technically, this does *not* return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `maybe(nil, f)(⊥) = nil`
 * `maybe(nil, f)(x) = f(x)`
 * @summary Inductive rule of nullable types
 */
function maybe(nil, f) {
    // tslint:disable-next-line
    return x => (x == exports.bottom ? nil : f(x));
}
exports.maybe = maybe;
//# sourceMappingURL=Maybe.js.map