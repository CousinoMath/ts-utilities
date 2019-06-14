"use strict";
/**
 * Helpers for tuples
 */
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
function curried(x) {
    return internal_1.curry(tuple)(x);
}
exports.curried = curried;
/**
 * `mapTuple(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
function mapTuple(f, g) {
    return ([x, y]) => [f(x), g(y)];
}
exports.mapTuple = mapTuple;
/**
 * `product(f, g)(x) = [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
function product(f, g) {
    return (x) => [f(x), g(x)];
}
exports.product = product;
/**
 * `swap([x, y]) => [y, x]`
 * @summary Flips the order of a tuple
 */
function swap([x, y]) {
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
//# sourceMappingURL=Tuple.js.map