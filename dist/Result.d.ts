/**
 * Wraps the result of a computation that can return/throw an error.
 */
/**
 * @summary The acceptable result of a computation.
 */
export interface Ok<R> {
    readonly kind: 'ok';
    readonly value: R;
}
/**
 * @summary The erroneous result of a computation.
 */
export interface Err<S> {
    readonly kind: 'err';
    readonly value: S;
}
/**
 * @summary A discriminated union representing the results of a computation
 */
export declare type Result<R, S> = Ok<R> | Err<S>;
/**
 * Wraps a result as an Ok value.
 * @param value
 */
export declare function ok<R, S>(value: R): Result<R, S>;
/**
 * Wraps a result as an Err value.
 * @param value
 */
export declare function err<R, S>(value: S): Result<R, S>;
/**
 * Returns true if and only if the Result is an Ok value.
 * @param result
 */
export declare function isOk<R, S>(result: Result<R, S>): boolean;
/**
 * Returns true if and only if the Result is an Err value.
 * @param result
 */
export declare function isErr<R, S>(result: Result<R, S>): boolean;
/**
 * Unwraps
 * @param result
 */
export declare function unwrapOk<R, S>(result: Result<R, S>): R;
export declare function unwrapOr<R, S>(result: Result<R, S>, dflt: R): R;
export declare function unwrapErr<R, S>(result: Result<R, S>): S;
export declare function map<R, S, T>(result: Result<R, S>, fn: (x: R) => T): Result<T, S>;
export declare function mapOr<R, S>(result: Result<R, S>, fn: (y: S) => R): R;
export declare function mapOrElse<R, S, T>(result: Result<R, S>, okFn: (x: R) => T, errFn: (y: S) => T): T;
