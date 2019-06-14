/**
 * A collection of functional programming utilities.
 */
/**
 * `compose(g, f)(x) = g(f(x))`
 * @summary Creates the composition of two functions
 */
export declare function compose<R, S, T>(g: (y: S) => T, f: (x: R) => S): (x: R) => T;
/**
 * `constant(x)(_) = x`
 * @summary Creates a function with constant output
 */
export declare function constant<R>(x: R): <S>(y: S) => R;
/**
 * `curry(f)(x)(y) = f(x, y)`
 * @summary Curry a function
 */
export declare function curry<R, S, T>(f: (x: R, y: S) => T): (x: R) => (y: S) => T;
/**
 * `flip(f)(x, y) = f(y, x)`
 * @summary Flips the arguments for a function that returns another function
 */
export declare function flip<R, S, T>(f: (x: R, y: S) => T): (y: S, x: R) => T;
/**
 * `ident(x) = x`
 * @summary Identity function
 */
export declare function identity<T>(x: T): T;
/**
 * `on(f, op)(x, y) = op(f(x), f(y))`
 * @summary Threads a function `f` through a binary operation `op`
 */
export declare function on<R, S, T>(f: (x: R) => S, op: (x: S, y: S) => T): (x: R, y: R) => T;
/**
 * `uncurry(f)(x, y) = f(x)(y)`
 * @summary Uncurry a function
 */
export declare function uncurry<R, S, T>(f: (x: R) => (y: S) => T): (x: R, y: S) => T;
