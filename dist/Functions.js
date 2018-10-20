"use strict";
/**
 * A collection of functional programming utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `compose(g, f)(x) = g(f(x))`
 * @summary Creates the composition of two functions
 */
function compose(g, f) {
    return (x) => g(f(x));
}
exports.compose = compose;
/**
 * `constant(x)(_) = x`
 * @summary Creates a function with constant output
 */
function constant(x) {
    return (y) => x;
}
exports.constant = constant;
/**
 * `curry(f)(x)(y) = f(x, y)`
 * @summary Curry a function
 */
function curry(f) {
    return x => y => f(x, y);
}
exports.curry = curry;
/**
 * `flip(f)(x, y) = f(y, x)`
 * @summary Flips the arguments for a function that returns another function
 */
function flip(f) {
    return (y, x) => f(x, y);
}
exports.flip = flip;
/**
 * `ident(x) = x`
 * @summary Identity function
 */
function ident(x) {
    return x;
}
exports.ident = ident;
/**
 * `on(f, op)(x, y) = op(f(x), f(y))`
 * @summary Threads a function `f` through a binary operation `op`
 */
function on(f, op) {
    return (x, y) => op(f(x), f(y));
}
exports.on = on;
/**
 * `uncurry(f)(x, y) = f(x)(y)`
 * @summary Uncurry a function
 */
function uncurry(f) {
    return (x, y) => f(x)(y);
}
exports.uncurry = uncurry;
//# sourceMappingURL=Functions.js.map