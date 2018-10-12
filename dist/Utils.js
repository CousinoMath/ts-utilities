/**
 * @summary Identity function
 * @param {T} x
 * @returns {T} `x`
 */
export function ident(x) { return x; }
/**
 * @summary Curry a function
 * @param {function(R, S): T} f
 * @returns {function(R): function(S): T} `x => y => f(x, y)`
 */
export function curry(f) {
    return function (x) { return function (y) { return f(x, y); }; };
}
/**
 * @summary Uncurry a function
 * @param {function(R): function(S): T} f
 * @returns {function(R, S): T} `(x, y) => f(x)(y)`
 */
export function uncurry(f) {
    return function (x, y) { return f(x)(y); };
}
/**
 * @summary Creates a function with constant output
 * @param {R} x
 * @returns {function(*): R} `y => x`
 */
export function constant(x) {
    return function (y) { return x; };
}
/**
 * @summary Flips the arguments for a function that returns another function
 * @param {function(R): function(S): T} f
 * @returns {function(S): function(R): T} `y => x => f(x)(y)`
 */
export function flip(f) {
    return function (y) { return function (x) { return f(x)(y); }; };
}
/**
 * @summary Creates the composition of two functions
 * @param {function(S): T} g
 * @returns {function(function(R): S): function(R): T} `f => x => g(f(x))`
 */
export function compose(g) {
    return function (f) { return function (x) { return g(f(x)); }; };
}
/**
 * @summary Threads a function `f` through a binary operation `op`
 * @param {function(R): S} f
 * @param {function(S, S): T} op
 * @returns {function(R, R): T} `(x, y) => op(f(x), f(y))`
 */
export function over(f, op) {
    return function (x, y) { return op(f(x), f(y)); };
}
//# sourceMappingURL=Utils.js.map