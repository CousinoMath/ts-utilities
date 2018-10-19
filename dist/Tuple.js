"use strict";
/**
 * Helpers for tuples
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
function tuple(x, y) {
    return [x, y];
}
exports.tuple = tuple;
/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
function curried(x) {
    return (y) => tuple(x, y);
}
exports.curried = curried;
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
 * `map(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
function map(f, g) {
    return xy => [f(xy[0]), g(xy[1])];
}
exports.map = map;
function to3Tuple([[x, y], z]) {
    return [x, y, z];
}
exports.to3Tuple = to3Tuple;
function from3Tuple([x, y, z]) {
    return [[x, y], z];
}
exports.from3Tuple = from3Tuple;
function to4Tuple([[[w, x], y], z]) {
    return [w, x, y, z];
}
exports.to4Tuple = to4Tuple;
function from4Tuple([w, x, y, z]) {
    return [[[w, x], y], z];
}
exports.from4Tuple = from4Tuple;
function to5Tuple([[[[v, w], x], y], z]) {
    return [v, w, x, y, z];
}
exports.to5Tuple = to5Tuple;
function from5Tuple([v, w, x, y, z]) {
    return [[[[v, w], x], y], z];
}
exports.from5Tuple = from5Tuple;
//# sourceMappingURL=Tuple.js.map