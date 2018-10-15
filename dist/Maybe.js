import { constant, ident } from "./Function";
/**
 * Technically, this does **not** return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `(x) => x == null ? nil : f(x)`
 * @summary Inductive rule of nullable types
 */
export function maybe(nil, f) {
    return x => (x == null ? nil : f(x));
}
/**
 * `x != null`
 * @summary Tests if a nullable value is not null
 */
export function isNonNull(xm) {
    return maybe(false, constant(true))(xm);
}
/**
 * `x == null`
 * @summary Tests if a nullable value is null
 */
export function isNull(xm) {
    return maybe(true, constant(false))(xm);
}
/**
 * `(xm) => xm == null ? d : xm`
 * @summary Returns the value from a nullable value or a default value
 */
export function defaultTo(d, xm) {
    return maybe(d, (x) => ident(x))(xm);
}
/**
 * `(x) => x == null ? [] : [x]`
 * @summary Turns a nullable value into an array
 */
export function maybeToArray(xm) {
    return maybe([], (x) => [x])(xm);
}
/**
 * `x != null`
 * @summary Turns a nullable value into a boolean according to whether it is non-null
 */
export function maybeToBool(xm) {
    return isNonNull(xm);
}
/**
 * `(x) => x == null ? null : f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 */
export function bind(f, xm) {
    return maybe(null, f)(xm);
}
/**
 * @summary An alias of `maybeBind`
 * @see [[maybeBind]]
 */
export function map(f, xm) {
    return bind(f, xm);
}
/**
 * @summary Returns an iterable object suitable for use in `for of` loops
 * @see [[maybeToArray]]
 */
export function iterable(xm) {
    return maybeToArray(xm);
}
//# sourceMappingURL=Maybe.js.map