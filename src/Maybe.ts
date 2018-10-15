import { constant, ident } from "./Function";

/**
 * @summary A type alias for nullable types
 */
export type Maybe<T> = T | null;

/**
 * Technically, this does **not** return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `(x) => x == null ? nil : f(x)`
 * @summary Inductive rule of nullable types
 */
export function maybe<T, S>(nil: S, f: (x: T) => S): (xm: Maybe<T>) => S {
  return x => (x == null ? nil : f(x));
}

/**
 * `x != null`
 * @summary Tests if a nullable value is not null
 */
export function isNonNull<T>(xm: Maybe<T>): boolean {
  return maybe(false, constant(true))(xm);
}

/**
 * `x == null`
 * @summary Tests if a nullable value is null
 */
export function isNull<T>(xm: Maybe<T>): boolean {
  return maybe(true, constant(false))(xm);
}

/**
 * `(xm) => xm == null ? d : xm`
 * @summary Returns the value from a nullable value or a default value
 */
export function defaultTo<T>(d: T, xm: Maybe<T>): T {
  return maybe(d, (x: T) => ident<T>(x))(xm);
}

/**
 * `(x) => x == null ? [] : [x]`
 * @summary Turns a nullable value into an array
 */
export function maybeToArray<T>(xm: Maybe<T>): T[] {
  return maybe([], (x: T) => [x])(xm);
}

/**
 * `x != null`
 * @summary Turns a nullable value into a boolean according to whether it is non-null
 */
export function maybeToBool<T>(xm: Maybe<T>): boolean {
  return isNonNull(xm);
}

/**
 * `(x) => x == null ? null : f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 */
export function bind<R, S>(f: (x: R) => S, xm: Maybe<R>): Maybe<S> {
  return maybe(null, f)(xm);
}

/**
 * @summary An alias of `maybeBind`
 * @see [[maybeBind]]
 */
export function map<T, S>(f: (x: T) => S, xm: Maybe<T>): Maybe<S> {
  return bind(f, xm);
}

/**
 * @summary Returns an iterable object suitable for use in `for of` loops
 * @see [[maybeToArray]]
 */
export function iterable<T>(xm: Maybe<T>): Iterable<T> {
  return maybeToArray(xm);
}
