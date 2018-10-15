import { compose, constant } from "./Function";
import { Tuple, tuple } from "./Tuple";

/**
 * @summary Left half of the discriminated union
 */
// tslint:disable-next-line
export interface Left<R> {
  readonly kind: "left";
  readonly value: R;
}

/**
 * @summary Right half of the discriminated union
 */
// tslint:disable-next-line
export interface Right<S> {
  readonly kind: "right";
  readonly value: S;
}

/**
 * @summary Generic discriminated union
 */
export type Either<R, S> = Left<R> | Right<S>;

/**
 * Inductive rule for the `Either` type.
 * @summary Creates functions over `Either` values
 */
export function either<R, S, T>(
  f: (l: R) => T,
  g: (r: S) => T
): (e: Either<R, S>) => T {
  return (x: Either<R, S>) => (x.kind === "left" ? f(x.value) : g(x.value));
}

/**
 * The typical use of this needs to look like
 * <pre><code class='typescript'>(x: R) => left&lt;R, S&rt;(x)</code></pre>
 * because the Typescript compiler will not be able to infer
 * the correct type for the right half.
 * @summary Creates the 'left half' of an `Either` value
 */
export function left<R, S>(x: R): Either<R, S> {
  return { kind: "left", value: x };
}

/**
 * The typical use of this needs to look like
 * <pre><code class='typescript'>(y: S) => right&lt;R, S&rt;(y)</code></pre>
 * because the Typescript compiler will not be able to infer
 * the correct type for the left half.
 * @summary Creates the 'right half' of an `Either` value
 */
export function right<R, S>(y: S): Either<R, S> {
  return { kind: "right", value: y };
}

/**
 * @summary Tests whether an `Either` value is of the left type.
 */
export function isLeft<R, S>(xe: Either<R, S>): boolean {
  return either(constant(true), constant(false))(xe);
}

/**
 * @summary Test whether an `Either` value is of the right type.
 */
export function isRight<R, S>(xe: Either<R, S>): boolean {
  return either(constant(false), constant(true))(xe);
}

/**
 * The result of this function will be a tuple of arrays,
 * one of which has length 1 and the other which is empty.
 * @summary Converts an `Either` value to a tuple of arrays
 */
export function toPartition<R, S>(xe: Either<R, S>): Tuple<R[], S[]> {
  return either(
    (x: R) => tuple([x], new Array<S>()),
    (y: S) => tuple(new Array<R>(), [y])
  )(xe);
}

/**
 * @summary Enables transformations on `Either` values
 */
export function map<R, S, T, U>(
  f: (x: R) => T,
  g: (y: S) => U
): (xe: Either<R, S>) => Either<T, U> {
  const lf: (x: R) => Either<T, U> = compose<R, T, Either<T, U>>(
    left,
    f
  );
  const rg: (y: S) => Either<T, U> = compose<S, U, Either<T, U>>(
    right,
    g
  );
  return either(lf, rg);
}

/**
 * @summary Transforms the right half of `Either` values
 */
export function bindRight<R, S, U>(
  g: (y: S) => Either<R, U>
): (xe: Either<R, S>) => Either<R, U> {
  return either<R, S, Either<R, U>>(left, g);
}

/**
 * @summary Transforms the left half of `Either` values
 */
export function bindLeft<R, S, T>(
  f: (x: R) => Either<T, S>
): (xe: Either<R, S>) => Either<T, S> {
  return either<R, S, Either<T, S>>(f, right);
}

/**
 * @summary Converts Either to an iterable over the left type.
 */
export function leftIterable<R, S>(xe: Either<R, S>): Iterable<R> {
  return toPartition(xe)[0];
}

/**
 * @summary Converts Either to an iterable over the right type.
 */
export function rightIterable<R, S>(xe: Either<R, S>): Iterable<S> {
  return toPartition(xe)[1];
}
