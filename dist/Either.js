"use strict";
/**
 * A generic, discriminated union type and helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Functions_1 = require("./Functions");
/**
 * `bindLeft(f)(left(x)) = left(f(x))`
 * `bindLeft(f)(right(y)) = right(y)`
 * @summary Transforms the left half of `Either` values
 * @see [[bindRight]]
 * @see [[lift]]
 */
function bindLeft(f) {
    return either(f, right);
}
exports.bindLeft = bindLeft;
/**
 * `bindRight(g)(left(x)) = left(x)`
 * `bindRight(g)(right(y)) = right(g(y))`
 * @summary Transforms the right half of `Either` values
 * @see [[bindLeft]]
 * @see [[lift]]
 */
function bindRight(g) {
    return either(left, g);
}
exports.bindRight = bindRight;
/**
 * Inductive rule for the `Either` type.
 * @summary Creates functions over `Either` values
 */
function either(f, g) {
    return function (x) { return (x.kind === 'left' ? f(x.value) : g(x.value)); };
}
exports.either = either;
/**
 * `isLeft(left(_)) = true`
 * `isLeft(right(_)) = false`
 * @summary Tests whether an `Either` value is of the left type.
 */
function isLeft(xe) {
    return either(Functions_1.constant(true), Functions_1.constant(false))(xe);
}
exports.isLeft = isLeft;
/**
 * `isRight(left(_)) = false`
 * `isRight(right(_)) = true`
 * @summary Test whether an `Either` value is of the right type.
 */
function isRight(xe) {
    return either(Functions_1.constant(false), Functions_1.constant(true))(xe);
}
exports.isRight = isRight;
/**
 * Using left often means explicitly annotating types as
 * the type of the right values cannot be easily deduced.
 * @summary Creates the 'left half' of an `Either` value
 */
function left(x) {
    return { kind: 'left', value: x };
}
exports.left = left;
/**
 * `leftDefault(d)(left(x)) = x`
 * `leftDefault(d)(right(y)) = d`
 * @summary Returns the left value if present, and a default otherwise.
 * @param d default value
 * @see [[rightDefault]]
 */
function leftDefault(d, xe) {
    return either(Functions_1.ident, Functions_1.constant(d))(xe);
}
exports.leftDefault = leftDefault;
/**
 * `lefts([left(x), ...rest]) = [x, lefts(rest)]`
 * `lefts([right(x), ...rest]) = lefts(rest)`
 * @summary Returns an array consisting of the left values of `xes`.
 * @see [[rights]]
 * @see [[partition]]
 */
function lefts(xes) {
    var leftsArr = [];
    for (var _i = 0, xes_1 = xes; _i < xes_1.length; _i++) {
        var xe = xes_1[_i];
        if (xe.kind === 'left') {
            leftsArr.push(xe.value);
        }
    }
    return leftsArr;
}
exports.lefts = lefts;
/**
 * `lift(f, g)(left(x)) = left(f(x))`
 * `lift(f, g)(right(y)) = right(g(y))`
 * @summary Enables transformations on `Either` values
 */
function lift(f, g) {
    var lf = Functions_1.compose(left, f);
    var rg = Functions_1.compose(right, g);
    return either(lf, rg);
}
exports.lift = lift;
/**
 * `partition(xs) = [lefts(xs), rights(xs)]`
 * @summary Converts an array Eithers to a tuple of an array of left values and another of right values.
 * @see [[lefts]]
 * @see [[rights]]
 */
function partition(xes) {
    var leftsArr = [];
    var rightsArr = [];
    for (var _i = 0, xes_2 = xes; _i < xes_2.length; _i++) {
        var xe = xes_2[_i];
        switch (xe.kind) {
            case 'left':
                leftsArr.push(xe.value);
                break;
            case 'right':
                rightsArr.push(xe.value);
                break;
        }
    }
    return [leftsArr, rightsArr];
}
exports.partition = partition;
/**
 * Using right often means explicitly annotating types as
 * the type of the left values cannot be easily deduced.
 * @summary Creates the 'right half' of an `Either` value
 */
function right(y) {
    return { kind: 'right', value: y };
}
exports.right = right;
/**
 * `rightDefault(d)(left(x)) = d`
 * `rightDefault(d)(right(y)) = y`
 * @summary Returns the right value if present, and a default otherwise.
 * @param d default value
 * @see [[leftDefault]]
 */
function rightDefault(d, xe) {
    return either(Functions_1.constant(d), Functions_1.ident)(xe);
}
exports.rightDefault = rightDefault;
/**
 * `rights([left(x), ...rest]) = rights(rest)`
 * `rights([right(x), ...rest]) = [x, rights(rest)]`
 * @summary Returns an array consisting of the right values of `xes`.
 * @see [[lefts]]
 * @see [[partition]]
 */
function rights(xes) {
    var rightsArr = [];
    for (var _i = 0, xes_3 = xes; _i < xes_3.length; _i++) {
        var xe = xes_3[_i];
        if (xe.kind === 'right') {
            rightsArr.push(xe.value);
        }
    }
    return rightsArr;
}
exports.rights = rights;
//# sourceMappingURL=Either.js.map