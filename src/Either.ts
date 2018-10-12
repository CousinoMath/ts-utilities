import { compose, constant } from "./Function";
import { Tuple, tuple } from "./Tuple";

/**
 * @summary Left half of the discriminated union
 * @interface Left
 * @template S
 */
// tslint:disable-next-line
export interface Left<R> {
    readonly kind: "left";
    readonly value: R;
}

/**
 * @summary Right half of the discriminated union
 * @interface Right
 * @template S
 */
// tslint:disable-next-line
export interface Right<S> {
    readonly kind: "right";
    readonly value: S;
}

/**
 * @summary Generic discriminated union
 * @typedef Either
 * @template R
 * @template S
 */
export type Either<R, S> = Left<R> | Right<S>;

/**
 * Inductive rule for the `Either` type.
 * @summary Creates functions over `Either` values
 * @template R
 * @template S
 * @template T
 * @param {(l: R) => T} f
 * @param {(r: S) => T} g
 * @returns {(e: Either<R, S>) => T}
 */
export function either<R, S, T>(f: (l: R) => T, g: (r: S) => T): (e: Either<R, S>) => T {
    return (x: Either<R, S>) => x.kind === "left" ? f(x.value) : g(x.value);
}

/**
 * The typical use of this needs to look like
 * <pre><code class="typescript">(x: R) => left&lt;R, S&rt;(x)</code></pre>
 * because the Typescript compiler will not be able to infer
 * the correct type for the right half.
 * @summary Creates the "left half" of an `Either` value
 * @template R
 * @template S
 * @param {R} x
 * @returns {Either<R, S>}
 */
export function left<R, S>(x: R): Either<R, S> {
    return { kind: "left", value: x };
}

/**
 * The typical use of this needs to look like
 * <pre><code class="typescript">(y: S) => right&lt;R, S&rt;(y)</code></pre>
 * because the Typescript compiler will not be able to infer
 * the correct type for the left half.
 * @summary Creates the "right half" of an `Either` value
 * @template R
 * @template S
 * @param {S} y
 * @returns {Either<R, S>}
 */
export function right<R, S>(y: S): Either<R, S> {
    return { kind: "right", value: y };
}

/**
 * @summary Tests whether an `Either` value is of the left type.
 * @template R
 * @template S
 * @param {Either<R, S} xe
 * @returns boolean
 */
export function isLeft<R, S>(xe: Either<R, S>): boolean {
    return either(constant(true), constant(false))(xe);
}

/**
 * @summary Test whether an `Either` value is of the right type.
 * @template R
 * @template S
 * @param {Either<R, S>} xe
 * @returns boolean
 */
export function isRight<R, S>(xe: Either<R, S>): boolean {
    return either(constant(false), constant(true))(xe);
}

/**
 * The result of this function will be a tuple of arrays,
 * one of which has length 1 and the other which is empty.
 * @summary Converts an `Either` value to a tuple of arrays
 * @template R
 * @template S
 * @param {Either<R, S>} xe
 * @returns {Tuple<R[], S[]>}
 */
export function toPartition<R, S>(xe: Either<R, S>): Tuple<R[], S[]> {
    return either((x: R) => tuple([x], new Array<S>()), (y: S) => tuple(new Array<R>(), [y]))(xe);
}

/**
 * @summary Enables transformations on `Either` values
 * @template R
 * @template S
 * @template T
 * @template U
 * @param {(x: R) => T} f
 * @param {(y: S) => U} g
 * @returns {(xe: Either<R, S>) => Either<T, U>}
 */
export function eitherMap<R, S, T, U>(f: (x: R) => T, g: (y: S) => U): (xe: Either<R, S>) => Either<T, U> {
    const lf: (x: R) => Either<T, U> = compose<R, T, Either<T, U>>((xf: T) => left<T, U>(xf), f);
    const rg: (y: S) => Either<T, U> = compose<S, U, Either<T, U>>((yg: U) => right<T, U>(yg), g);
    return either(lf, rg);
}

/**
 * @summary Transforms the right half of `Either` values
 * @template R
 * @template S
 * @template U
 * @param {(y: S) => Either<R, U>} g
 * @returns {(xe: Either<R, S>) => Either<R, U>}
 */
export function bindRight<R, S, U>(g: (y: S) => Either<R, U>): (xe: Either<R, S>) => Either<R, U> {
    return either((x: R) => left<R, U>(x), g);
}

/**
 * @summary Transforms the left half of `Either` values
 * @template R
 * @template S
 * @template T
 * @param {(x: R) => Either<T, S>} f
 * @returns {(xe: Either<R, S>) => Either<T, S>}
 */
export function bindLeft<R, S, T>(f: (x: R) => Either<T, S>): (xe: Either<R, S>) => Either<T, S> {
    return either(f, (y: S) => right<T, S>(y));
}
