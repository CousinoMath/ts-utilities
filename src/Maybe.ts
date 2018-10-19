import { constant, ident } from './Functions';

/**
 * Maybe extends a type to include null as a possible value.
 */

/**
 * @summary A type alias that extends a type to be nullable.
 */
export type Maybe<T> = T | null;

/**
 * Technically, this does *not* return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `maybe(nil, f)(null) = nil`
 * `maybe(nil, f)(x) = f(x)`
 * @summary Inductive rule of nullable types
 */
export function maybe<S, T>(nil: T, f: (x: S) => T): (xm: Maybe<S>) => T {
  return x => (x == null ? nil : f(x));
}

/**
 * `isNonNull(x) === true` if and only if `x != null`
 * @summary Tests if a nullable value is not null
 */
export function isNonNull<T>(xm: Maybe<T>): boolean {
  return maybe(false, constant(true))(xm);
}

/**
 * `isNull(x) === true` if and only if `x == null`
 * @summary Tests if a nullable value is null
 */
export function isNull<T>(xm: Maybe<T>): boolean {
  return maybe(true, constant(false))(xm);
}

/**
 * `defaultTo(d)(null) = d`
 * `defaultTo(d)(x) = x`
 * @summary Returns the value from a nullable value or a default value
 */
export function defaultTo<T>(d: T, xm: Maybe<T>): T {
  return maybe(d, (x: T) => ident<T>(x))(xm);
}

// /**
//  * `maybeToArray(null) = []`
//  * `maybeToArray(x) = [x]`
//  * @summary Turns a nullable value into an array
//  */
// export function maybeToArray<T>(xm: Maybe<T>): T[] {
//   return maybe([], (x: T) => [x])(xm);
// }

/**
 * `first([]) = null`
 * `first([x, ...rest]) = x`
 * @summary Returns the first element of an array if it exists, and null otherwise.
 */
export function first<T>(xs: T[]): Maybe<T> {
  return xs.length > 0 ? xs[0] : null;
}

/**
 * `last([]) = null`
 * `last([...rest, x]) = x`
 * @summary Returns the last element of an array if it exists, and null otherwise.
 */
export function last<T>(xs: T[]): Maybe<T> {
  const len = xs.length;
  return len > 0 ? xs[len - 1] : null;
}

/**
 * `nth([], _) = nth(_, 0.5) = nth(_, NaN) = nth(_, Infinity) = null`
 * `nth([...firstNm1Elts, xn, ...rest], n) = xn`
 * @summary Returns the nth element of an array if it exists, and null otherwise.
 * @param n index of the element to return
 */
export function nth<T>(xs: T[], n: number): Maybe<T> {
  const len = xs.length;
  const inRange = len > 0 && Number.isInteger(n) && n >= 0 && n < len;
  return inRange ? xs[n] : null;
}

/**
 * `concatMaybe([null, ...rest]) = concatMaybe(rest)`
 * `concatMaybe([x, ...rest]) = [x, ...concatMaybe(rest)]`
 * @summary Takes an array of possibly null values and returns an array of only non-null values.
 */
export function concatMaybes<T>(xms: Array<Maybe<T>>): T[] {
  const vals: T[] = [];
  for (const xm of xms) {
    maybe<T, number>(0, x => vals.push(x))(xm);
  }
  return vals;
}

/**
 * `lift(f)(null) = null`
 * `lift(f)(x) = f(x)`
 * @summary Lifts a function over non-null values to one over nullable values
 */
export function lift<S, T>(f: (x: S) => T): (xm: Maybe<S>) => Maybe<T> {
  return maybe(null, f);
}

/**
 * `bind(f)(null) = null`
 * `bind(f)(x) = f(x)`
 * @summary An alias of `lift`
 * @see [[lift]]
 */
export function bind<S, T>(f: (x: S) => Maybe<T>): (xm: Maybe<S>) => Maybe<T> {
  return maybe(null, f);
}
// const monadReduction: <T>(xmm: Maybe<Maybe<T>>) => Maybe<T> = bind(lift(ident));

/**
 * `liftToArray(f)(xs) = concatMaybes(xs.map(f))`
 * @summary Resulting function maps `f` over its input and outputs only non null results.
 */
export function liftToArray<S, T>(f: (x: S) => Maybe<T>): (xs: S[]) => T[] {
  return xs => {
    const ys: T[] = [];
    for (const x of xs) {
      maybe<T, number>(0, y => ys.push(y))(f(x));
    }
    return ys;
  };
}

export function liftToSet<S, T>(f: (x: S) => Maybe<T>): (xs: Set<S>) => Set<T> {
  return xs => {
    const ys = new Set<T>();
    for (const x of xs) {
      maybe<T, Set<T>>(ys, y => ys.add(y))(f(x));
    }
    return ys;
  };
}

export function liftToMap<R, S, T, U>(
  f: ([key, val]: [R, S]) => Maybe<[T, U]>
): (xs: Map<R, S>) => Map<T, U> {
  return xs => {
    const ys = new Map<T, U>();
    for (const [xkey, xval] of xs) {
      maybe<[T, U], Map<T, U>>(ys, ypair => ys.set(ypair[0], ypair[1]))(
        f([xkey, xval])
      );
    }
    return ys;
  };
}
