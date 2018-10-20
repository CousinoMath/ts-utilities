"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("./Functions");
/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
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
    return xy => [f(xy[0]), g(xy[1])];
}
exports.map = map;
/**
 * `product(f, g)(x) = [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
function product(f, g) {
    return x => [f(x), g(x)];
}
exports.product = product;
/**
 * `swap([x, y]) => [y, x]`
 * @summary Flips the order of a tuple
 */
function swap(xy) {
    return [xy[1], xy[0]];
}
exports.swap = swap;
/**
 * @summary A convenience function for building tuples.
 */
function tuple(x, y) {
    return [x, y];
}
exports.tuple = tuple;
/**
 * @summary A convenice function converting between 3-tuples.
 * @see [[to3Tuple]]
 */
function from3Tuple([x, y, z]) {
    return [[x, y], z];
}
exports.from3Tuple = from3Tuple;
/**
 * @summary A convenice function converting between 4-tuples.
 * @see [[to4Tuple]]
 */
function from4Tuple([w, x, y, z]) {
    return [[[w, x], y], z];
}
exports.from4Tuple = from4Tuple;
/**
 * @summary A convenice function converting between 5-tuples.
 * @see [[to5Tuple]]
 */
function from5Tuple([v, w, x, y, z]) {
    return [[[[v, w], x], y], z];
}
exports.from5Tuple = from5Tuple;
/**
 * @summary A convenice function converting between 3-tuples.
 * @see [[from3Tuple]]
 */
function to3Tuple([[x, y], z]) {
    return [x, y, z];
}
exports.to3Tuple = to3Tuple;
/**
 * @summary A convenice function converting between 4-tuples.
 * @see [[from4Tuple]]
 */
function to4Tuple([[[w, x], y], z]) {
    return [w, x, y, z];
}
exports.to4Tuple = to4Tuple;
/**
 * @summary A convenice function converting between 5-tuples.
 * @see [[from5Tuple]]
 */
function to5Tuple([[[[v, w], x], y], z]) {
    return [v, w, x, y, z];
}
exports.to5Tuple = to5Tuple;
//# sourceMappingURL=Tuple.js.map