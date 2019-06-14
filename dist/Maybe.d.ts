/**
 * Maybe extends a type to include ⊥ as a possible value.
 */
/**
 * @summary A type alias that extends a type to be nullable.
 */
export declare const bottom: undefined;
export declare type Maybe<T> = T | null | undefined;
/**
 * `bindMaybe(f)(⊥) = ⊥`
 * `bindMaybe(f)(x) = f(x)`
 * @summary An alias of `lift`
 * @see [[lift]]
 */
export declare function bindMaybe<S, T>(f: (x: S) => Maybe<T>): (xm: Maybe<S>) => Maybe<T>;
/**
 * `liftToArray(f)(xs) = concatMaybes(xs.map(f))`
 * @summary Resulting function maps `f` over its input and outputs only non ⊥ results.
 */
export declare function bindToArray<S, T>(f: (x: S) => Maybe<T>): (xs: S[]) => T[];
/**
 * `concatMaybe([⊥, ...rest]) = concatMaybe(rest)`
 * `concatMaybe([x, ...rest]) = [x, ...concatMaybe(rest)]`
 * @summary Takes an array of possibly ⊥ values and returns an array of only non-⊥ values.
 */
export declare function concatMaybes<T>(xms: Array<Maybe<T>>): T[];
/**
 * `defaultTo(d)(⊥) = d`
 * `defaultTo(d)(x) = x`
 * @summary Returns the value from a nullable value or a default value
 */
export declare function defaultTo<T>(d: T, xm: Maybe<T>): T;
/**
 * `isNonNull(x) === true` if and only if `x != ⊥`
 * @summary Tests if a nullable value is not ⊥
 */
export declare function isNonNull<T>(xm: Maybe<T>): xm is T;
/**
 * `isNull(x) === true` if and only if `x == ⊥`
 * @summary Tests if a nullable value is ⊥
 */
export declare function isNull<T>(xm: Maybe<T>): xm is null | undefined;
/**
 * `liftMaybe(f)(⊥) = ⊥`
 * `liftMaybe(f)(x) = f(x)`
 * @summary Lifts a function over non-⊥ values to one over nullable values
 */
export declare function liftMaybe<S, T>(f: (x: S) => T): (xm: Maybe<S>) => Maybe<T>;
/**
 * @summary Makes a maybe from a value and a boolean
 */
export declare function makeMaybe<T>(isNonNil: boolean, value: () => T): T | undefined;
/**
 * Technically, this does *not* return a function of an optional
 * parameter, as such a function could be called with no
 * parameters, i.e. the first parameter being `undefined`.
 * `maybe(nil, f)(⊥) = nil`
 * `maybe(nil, f)(x) = f(x)`
 * @summary Inductive rule of nullable types
 */
export declare function maybe<S, T>(nil: T, f: (x: S) => T): (xm: Maybe<S>) => T;
