/**
 * Helpers for tuples
 */
/**
 * @deprecated since Typescript 2.7
 * `tuple(x, y) = [x, y]`
 * @summary Constructs a tuple
 */
export function tuple(x, y) {
    return [x, y];
}
/**
 * `curried(x)(y) = [x, y]`
 * @summary Curried construction of a tuple.
 */
export function curried(x) {
    return (y) => tuple(x, y);
}
/**
 * `product(f, g)(x) = [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
export function product(f, g) {
    return x => [f(x), g(x)];
}
/**
 * `swap([x, y]) => [y, x]`
 * @summary Flips the order of a tuple
 */
export function swap(xy) {
    return [xy[1], xy[0]];
}
/**
 * `map(f, g)([x, y]) = [f(x), g(y)]`
 * @summary Maps two functions over a tuple
 */
export function map(f, g) {
    return xy => [f(xy[0]), g(xy[1])];
}
//# sourceMappingURL=Tuple.js.map