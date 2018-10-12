import { constant, ident } from "./Function";

/**
 * @summary A type alias for nullable types
 * @typedef Maybe
 * @template T
 */
export type Maybe<T> = T | null;

/**
 * Technically, this does **not** return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `(x) => x == null ? nil : f(x)`
 * @summary Inductive rule of nullable types
 * @template T
 * @template S
 * @param {S} nil
 * @param {(x: T) => S} f
 * @returns {(x: Maybe<T>) => S}
 */
export function maybe<T, S>(nil: S, f: (x: T) => S): (xm: Maybe<T>) => S {
    return (x) => x == null ? nil : f(x);
}

/**
 * `x != null`
 * @summary Tests if a nullable value is not null
 * @template T
 * @param {Maybe<T>} xm
 * @returns {boolean}
 */
export function isNonNull<T>(xm: Maybe<T>): boolean {
    return maybe(false, constant(true))(xm);
}

/**
 * `x == null`
 * @summary Tests if a nullable value is null
 * @template T
 * @param {Maybe<T>} xm
 * @returns {boolean}
 */
export function isNull<T>(xm: Maybe<T>): boolean {
    return maybe(true, constant(false))(xm);
}

/**
 * `(xm) => xm == null ? d : xm`
 * @summary Returns the value from a nullable value or a default value
 * @template T
 * @param {T} d default value
 * @param {Maybe<T>} xm
 * @returns {T}
 */
export function defaultTo<T>(d: T, xm: Maybe<T>): T {
    return maybe(d, (x: T) => ident<T>(x))(xm);
}

/**
 * `(x) => x == null ? [] : [x]`
 * @summary Turns a nullable value into an array
 * @template T
 * @param {Maybe<T>} xm
 * @returns {Array<T>}
 */
export function maybeToArray<T>(xm: Maybe<T>): T[] {
    return maybe([], (x: T) => [x])(xm);
}

/**
 * `x != null`
 * @summary Turns a nullable value into a boolean according to whether it is non-null
 * @template T
 * @param {Maybe<T>} xm
 * @returns {boolean}
 */
export function maybeToBool<T>(xm: Maybe<T>): boolean {
    return isNonNull(xm);
}

/**
 * `(x) => x == null ? null : f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 * @template R
 * @template S
 * @param {(x: R) => S} f
 * @param {Maybe<R>} xm
 * @returns {Maybe<S>}
 */
export function maybeBind<R, S>(f: (x: R) => S, xm: Maybe<R>): Maybe<S> {
    return maybe(null, f)(xm);
}

/**
 * @summary An alias of `maybeBind`
 * @see {@link maybeBind}
 * @template R
 * @template S
 * @param {(x: R) => S} f
 * @param {Maybe<R>} xm
 * @returns {Maybe<S>}
 */
export function maybeMap<T, S>(f: (x: T) => S, xm: Maybe<T>): Maybe<S> {
    return maybeBind(f, xm);
}
