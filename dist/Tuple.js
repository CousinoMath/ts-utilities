/**
 * @deprecated since Typescript 2.7
 * `(x, y) => [x, y]`
 * @summary Constructs a tuple
 */
export function tuple(x, y) {
    return [x, y];
}
/**
 * `curried = x => y => [x, y]`
 * @summary Curried construction of a tuple.
 */
export function curried(x) {
    return (y) => tuple(x, y);
}
/**
 * `x => [f(x), g(x)]`
 * @summary Creates a function returning a tuple from two functions that share a common input type
 */
export function product(f, g) {
    return x => [f(x), g(x)];
}
/**
 * `xy => [xy[1], xy[0]]`
 * @summary Flips the order of a tuple
 */
export function flip(xy) {
    return [xy[1], xy[0]];
}
/**
 * `xy => [f(xy[0]), g(xy[1])]`
 * @summary Maps two functions over a tuple
 */
export function map(f, g, xy) {
    return [f(xy[0]), g(xy[1])];
}
//# sourceMappingURL=Tuple.js.map