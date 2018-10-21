import { constant, ident } from './Functions';

/**
 * Maybe extends a type to include ⊥ as a possible value.
 */

/**
 * @summary A type alias that extends a type to be nullable.
 */
export const bottom = null;
export type Maybe<T> = T | null;


/**
 * `bind(f)(⊥) = ⊥`
 * `bind(f)(x) = f(x)`
 * @summary An alias of `lift`
 * @see [[lift]]
 */
export function bind<S, T>(f: (x: S) => Maybe<T>): (xm: Maybe<S>) => Maybe<T> {
  return maybe(bottom, f);
}
// const monadReduction: <T>(xmm: Maybe<Maybe<T>>) => Maybe<T> = bind(lift(ident));

/**
 * `liftToArray(f)(xs) = concatMaybes(xs.map(f))`
 * @summary Resulting function maps `f` over its input and outputs only non ⊥ results.
 */
export function bindToArray<S, T>(f: (x: S) => Maybe<T>): (xs: S[]) => T[] {
  return xs => {
    const ys: T[] = [];
    for (const x of xs) {
      maybe<T, number>(0, y => ys.push(y))(f(x));
    }
    return ys;
  };
}

/**
 * @summary Resulting function maps `f` over its entries, keeping only non-⊥ results.
 */
// export function bindToMap<R, S, T, U>(
//   f: ([key, val]: [R, S]) => Maybe<[T, U]>
// ): (xs: Map<R, S>) => Map<T, U> {
//   return xs => {
//     const ys = new Map<T, U>();
//     for (const [xkey, xval] of xs) {
//       maybe<[T, U], Map<T, U>>(ys, ypair => ys.set(ypair[0], ypair[1]))(
//         f([xkey, xval])
//       );
//     }
//     return ys;
//   };
// }

/**
 * @summary Resulting function maps `f` over its elements, keeping only non-⊥ results.
 */
// export function bindToSet<S, T>(f: (x: S) => Maybe<T>): (xs: Set<S>) => Set<T> {
//   return xs => {
//     const ys = new Set<T>();
//     for (const x of xs) {
//       maybe<T, Set<T>>(ys, y => ys.add(y))(f(x));
//     }
//     return ys;
//   };
// }

/**
 * `concatMaybe([⊥, ...rest]) = concatMaybe(rest)`
 * `concatMaybe([x, ...rest]) = [x, ...concatMaybe(rest)]`
 * @summary Takes an array of possibly ⊥ values and returns an array of only non-⊥ values.
 */
export function concatMaybes<T>(xms: Array<Maybe<T>>): T[] {
  const vals: T[] = [];
  for (const xm of xms) {
    maybe<T, number>(0, x => vals.push(x))(xm);
  }
  return vals;
}

/**
 * `defaultTo(d)(⊥) = d`
 * `defaultTo(d)(x) = x`
 * @summary Returns the value from a nullable value or a default value
 */
export function defaultTo<T>(d: T, xm: Maybe<T>): T {
  return maybe(d, (x: T) => ident<T>(x))(xm);
}

/**
 * `isNonNull(x) === true` if and only if `x != ⊥`
 * @summary Tests if a nullable value is not ⊥
 */
export function isNonNull<T>(xm: Maybe<T>): xm is T {
  return maybe(false, constant(true))(xm);
}

/**
 * `isNull(x) === true` if and only if `x == ⊥`
 * @summary Tests if a nullable value is ⊥
 */
export function isNull<T>(xm: Maybe<T>): xm is null {
  return maybe(true, constant(false))(xm);
}

/**
 * `lift(f)(⊥) = ⊥`
 * `lift(f)(x) = f(x)`
 * @summary Lifts a function over non-⊥ values to one over nullable values
 */
export function lift<S, T>(f: (x: S) => T): (xm: Maybe<S>) => Maybe<T> {
  return bind(f);
}

/**
 * @summary Makes a maybe from a value and a boolean
 */
export function make<T>(isNonNil: boolean, value: () => T) {
  return isNonNil ? value() : bottom;
}
/**
 * Technically, this does *not* return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `maybe(nil, f)(⊥) = nil`
 * `maybe(nil, f)(x) = f(x)`
 * @summary Inductive rule of nullable types
 */
export function maybe<S, T>(nil: T, f: (x: S) => T): (xm: Maybe<S>) => T {
  return x => (x == bottom ? nil : f(x));
}
