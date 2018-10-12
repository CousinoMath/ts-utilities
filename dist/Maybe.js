import { constant, ident } from "./Function";
/**
 * Technically, this does **not** return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `(x) => x == null ? nil : f(x)`
 * @summary Universal property of nullable types
 * @export
 * @template T
 * @template S
 * @param {S} nil
 * @param {(x: T) => S} f
 * @returns {(x: Maybe<T>) => S}
 */
export function maybe(nil, f) {
    return (x) => x == null ? nil : f(x);
}
/**
 * `x != null`
 * @summary Tests if a nullable value is not null
 * @export
 * @template T
 * @param {Maybe<T>} xm
 * @returns {boolean}
 */
export const isNonNull = maybe(false, constant(true));
/**
 * `x == null`
 * @summary Tests if a nullable value is null
 * @export
 * @template T
 * @param {Maybe<T>} xm
 * @returns {boolean}
 */
export const isNull = maybe(true, constant(false));
/**
 * `(xm) => xm == null ? d : xm`
 * @summary Returns the value from a nullable value or a default value
 * @export
 * @template T
 * @param {T} d default value
 * @param {Maybe<T>} xm
 * @returns {T}
 */
export function defaultTo(d, xm) {
    return maybe(d, (x) => ident(x))(xm);
}
/**
 * `(x) => x == null ? [] : [x]`
 * @summary Turns a nullable value into an array
 * @export
 * @template T
 * @param {Maybe<T>} xm
 * @returns {Array<T>}
 */
export function maybeToArray(xm) {
    return maybe([], (x) => [x])(xm);
}
/**
 * `x != null`
 * @summary Turns a nullable value into a boolean according to whether it is non-null
 * @export
 * @template T
 * @param {Maybe<T>} xm
 * @returns {boolean}
 */
export function maybeToBool(xm) {
    return isNonNull(xm);
}
/**
 * `(x) => x == null ? null : f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 * @export
 * @template R
 * @template S
 * @param {(x: R) => S} f
 * @param {Maybe<R>} xm
 * @returns {Maybe<S>}
 */
export function maybeBind(f, xm) {
    return maybe(null, f)(xm);
}
/**
 * @summary An alias of `maybeBind`
 * @see maybeBind
 * @export
 * @template R
 * @template S
 * @param {(x: R) => S} f
 * @param {Maybe<R>} xm
 * @returns {Maybe<S>}
 */
export function maybeMap(f, xm) {
    return maybeBind(f, xm);
}
//# sourceMappingURL=Maybe.js.map