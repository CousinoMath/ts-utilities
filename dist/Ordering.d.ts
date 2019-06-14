/**
 * @summary Union of literal types 'LT', 'EQ', and 'GT'
 */
export declare type Orderings = 'LT' | 'EQ' | 'GT';
/**
 * @summary Type alias of total orderings
 */
export declare type Ordering<T> = (x: T, y: T) => Orderings;
/**
 * `preorder(f, ord)(x, y) <-> ord(f(x), f(y))`
 * @summary Pulls back an ordering along a function.
 */
export declare function preorder<S, T>(f: (x: S) => T, ord: Ordering<T>): Ordering<S>;
/**
 * @summary A convenience Date ordering.
 */
export declare function dateOrd(x: Date, y: Date): Orderings;
/**
 * This function treats all zeros (+0 = 0, -0) as equal and NaNs as equals.
 * If only one of x and y are NaN, `numberOrd(x, y) = numberOrd(y, x) = 'LT'`.
 * This is the one wart on this function.
 * @summary Total ordering on number type. (excepting on NaNs)
 */
export declare function numberOrd(x: number, y: number): Orderings;
/**
 * @summary A convenience string ordering.
 */
export declare function stringOrd(x: string, y: string): Orderings;
/**
 * @summary Converts a typical comparing function `f` into an `Ordering`.
 */
export declare function toOrdering<T>(f: (x: T, y: T) => number): Ordering<T>;
