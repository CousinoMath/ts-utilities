"use strict";
/**
 * A generic, discriminated union type and helpers
 */
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
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
    return (x) => (x.kind === 'left' ? f(x.value) : g(x.value));
}
exports.either = either;
/**
 * `isLeft(left(_)) = true`
 * `isLeft(right(_)) = false`
 * @summary Tests whether an `Either` value is of the left type.
 */
function isLeft(xe) {
    return either(internal_1.constant(true), internal_1.constant(false))(xe);
}
exports.isLeft = isLeft;
/**
 * `isRight(left(_)) = false`
 * `isRight(right(_)) = true`
 * @summary Test whether an `Either` value is of the right type.
 */
function isRight(xe) {
    return either(internal_1.constant(false), internal_1.constant(true))(xe);
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
    return either(internal_1.identity, internal_1.constant(d))(xe);
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
    const leftsArr = [];
    for (const xe of xes) {
        if (xe.kind === 'left') {
            leftsArr.push(xe.value);
        }
    }
    return leftsArr;
}
exports.lefts = lefts;
/**
 * `liftEither(f, g)(left(x)) = left(f(x))`
 * `liftEither(f, g)(right(y)) = right(g(y))`
 * @summary Enables transformations on `Either` values
 */
function liftEither(f, g) {
    const lf = internal_1.compose(left, f);
    const rg = internal_1.compose(right, g);
    return either(lf, rg);
}
exports.liftEither = liftEither;
/**
 * `partition(xs) = [lefts(xs), rights(xs)]`
 * @summary Converts an array Eithers to a tuple of an array of left values and another of right values.
 * @see [[lefts]]
 * @see [[rights]]
 */
function partition(xes) {
    const leftsArr = [];
    const rightsArr = [];
    for (const xe of xes) {
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
    return either(internal_1.constant(d), internal_1.identity)(xe);
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
    const rightsArr = [];
    for (const xe of xes) {
        if (xe.kind === 'right') {
            rightsArr.push(xe.value);
        }
    }
    return rightsArr;
}
exports.rights = rights;
//# sourceMappingURL=Either.js.map