import { Ordering } from './Ordering';
/**
 * @summary Returns the greatest integer no more than the argument.
 */
export declare function greatestInt(x: number): number;
/**
 * @summary Returns the fractional part of the input.
 */
export declare function fractionPart(x: number): number;
/**
 * ```
 * fromContinuedFraction([]) = NaN
 * fromContinuedFraction([x0]) = x0
 * fromContinuedFraction([x0, ...xs]) = x0 + 1/fromContinuedFraction([...xs])
 * ```
 * @summary Converts a continued fraction, represented as a list, into a number
 */
export declare function fromContinuedFraction(xs: number[]): number;
/**
 * `max() = -Infinity`
 * @summary Returns a maximum of its arguments
 */
export declare function max(...xs: number[]): number;
/**
 * @summary Returns the maximum, by `ord`, of its arguments
 * @param ord the ordering using to determine the maximum
 */
export declare function maxBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T;
/**
 * `min() = +Infinity`
 * @summary Returns the minimum of its arguments
 */
export declare function min(...xs: number[]): number;
/**
 * @summary Returns the minimum, by `ord`, of its arguments
 * @param ord the ordering using to determine the minimum
 */
export declare function minBy<T>(ord: Ordering<T>, x0: T, ...xs: T[]): T;
/**
 * `sum() = 0`
 * @summary Returns the sum of its arguments
 */
export declare function sum(...xs: number[]): number;
/**
 * `product() = 1`
 * @summary Retruns the product of its arguments
 */
export declare function product(...xs: number[]): number;
/**
 * @summary Converts a number into a continued fraction, represented as an array.
 * @param x number to be converted to continued fraction representation
 * @param maxLen maximum length of the continued fraction array
 */
export declare function toContinuedFraction(x: number, maxLen: number): number[];
