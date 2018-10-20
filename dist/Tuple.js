"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Functions_1 = require("./Functions");
/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
function curried(x) {
    return Functions_1.curry(tuple)(x);
}
exports.curried = curried;
/**
 * `map(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
function map(f, g) {
    return function (_a) {
        var x = _a[0], y = _a[1];
        return [f(x), g(y)];
    };
}
exports.map = map;
/**
 * `product(f, g)(x) = [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
function product(f, g) {
    return function (x) { return [f(x), g(x)]; };
}
exports.product = product;
/**
 * `swap([x, y]) => [y, x]`
 * @summary Flips the order of a tuple
 */
function swap(_a) {
    var x = _a[0], y = _a[1];
    return [y, x];
}
exports.swap = swap;
/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
function tuple(x, y) {
    return [x, y];
}
exports.tuple = tuple;
// /**
//  * @summary A convenice function converting between 3-tuples.
//  * @see [[to3Tuple]]
//  */
// export function from3Tuple<R, S, T>([x, y, z]: [R, S, T]): [[R, S], T] {
//   return [[x, y], z];
// }
// /**
//  * @summary A convenice function converting between 4-tuples.
//  * @see [[to4Tuple]]
//  */
// export function from4Tuple<Q, R, S, T>([w, x, y, z]: [Q, R, S, T]): [
//   [[Q, R], S],
//   T
// ] {
//   return [[[w, x], y], z];
// }
// /**
//  * @summary A convenice function converting between 5-tuples.
//  * @see [[to5Tuple]]
//  */
// export function from5Tuple<P, Q, R, S, T>([v, w, x, y, z]: [P, Q, R, S, T]): [
//   [[[P, Q], R], S],
//   T
// ] {
//   return [[[[v, w], x], y], z];
// }
// /**
//  * @summary A convenice function converting between 3-tuples.
//  * @see [[from3Tuple]]
//  */
// export function to3Tuple<R, S, T>([[x, y], z]: [[R, S], T]): [R, S, T] {
//   return [x, y, z];
// }
// /**
//  * @summary A convenice function converting between 4-tuples.
//  * @see [[from4Tuple]]
//  */
// export function to4Tuple<Q, R, S, T>([[[w, x], y], z]: [[[Q, R], S], T]): [
//   Q,
//   R,
//   S,
//   T
// ] {
//   return [w, x, y, z];
// }
// /**
//  * @summary A convenice function converting between 5-tuples.
//  * @see [[from5Tuple]]
//  */
// export function to5Tuple<P, Q, R, S, T>([[[[v, w], x], y], z]: [
//   [[[P, Q], R], S],
//   T
// ]): [P, Q, R, S, T] {
//   return [v, w, x, y, z];
// }
//# sourceMappingURL=Tuple.js.map