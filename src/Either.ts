/**
 * A generic, discriminated union type and helpers
 */

import { compose, constant, ident } from './Functions';

/**
 * @summary Left half of the discriminated union
 */
// tslint:disable-next-line
export interface Left<R> {
  readonly kind: 'left';
  readonly value: R;
}

/**
 * @summary Right half of the discriminated union
 */
// tslint:disable-next-line
export interface Right<S> {
  readonly kind: 'right';
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
  return (x: Either<R, S>) => (x.kind === 'left' ? f(x.value) : g(x.value));
}

/**
 * Using left often means explicitly annotating types as
 * the type of the right values cannot be easily deduced.
 * @summary Creates the 'left half' of an `Either` value
 */
export function left<R, S>(x: R): Either<R, S> {
  return { kind: 'left', value: x };
}

/**
 * Using right often means explicitly annotating types as
 * the type of the left values cannot be easily deduced.
 * @summary Creates the 'right half' of an `Either` value
 */
export function right<R, S>(y: S): Either<R, S> {
  return { kind: 'right', value: y };
}

/**
 * `isLeft(left(_)) = true`
 * `isLeft(right(_)) = false`
 * @summary Tests whether an `Either` value is of the left type.
 */
export function isLeft<R, S>(xe: Either<R, S>): boolean {
  return either(constant(true), constant(false))(xe);
}

/**
 * `isRight(left(_)) = false`
 * `isRight(right(_)) = true`
 * @summary Test whether an `Either` value is of the right type.
 */
export function isRight<R, S>(xe: Either<R, S>): boolean {
  return either(constant(false), constant(true))(xe);
}

/**
 * `partition(xs) = [lefts(xs), rights(xs)]`
 * @summary Converts an array Eithers to a tuple of an array of left values and another of right values.
 * @see [[lefts]]
 * @see [[rights]]
 */
export function partition<R, S>(xes: Array<Either<R, S>>): [R[], S[]] {
  const leftsArr: R[] = [];
  const rightsArr: S[] = [];

  for (const xe of xes) {
    switch (xe.kind) {
      case 'left':
        leftsArr.push(xe.value);
        break;
      case 'right':
        rightsArr.push(xe.value);
        break;
    }
  }
  return [leftsArr, rightsArr];
}

/**
 * `lefts([left(x), ...rest]) = [x, lefts(rest)]`
 * `lefts([right(x), ...rest]) = lefts(rest)`
 * @summary Returns an array consisting of the left values of `xes`.
 * @see [[rights]]
 * @see [[partition]]
 */
export function lefts<R, S>(xes: Array<Either<R, S>>): R[] {
  const leftsArr: R[] = [];
  for (const xe of xes) {
    if (xe.kind === 'left') {
      leftsArr.push(xe.value);
    }
  }
  return leftsArr;
}

/**
 * `rights([left(x), ...rest]) = rights(rest)`
 * `rights([right(x), ...rest]) = [x, rights(rest)]`
 * @summary Returns an array consisting of the right values of `xes`.
 * @see [[lefts]]
 * @see [[partition]]
 */
export function rights<R, S>(xes: Array<Either<R, S>>): S[] {
  const rightsArr: S[] = [];

  for (const xe of xes) {
    if (xe.kind === 'right') {
      rightsArr.push(xe.value);
    }
  }
  return rightsArr;
}

/**
 * `lift(f, g)(left(x)) = left(f(x))`
 * `lift(f, g)(right(y)) = right(g(y))`
 * @summary Enables transformations on `Either` values
 */
export function lift<R, S, T, U>(
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
 * `bindRight(g)(left(x)) = left(x)`
 * `bindRight(g)(right(y)) = right(g(y))`
 * @summary Transforms the right half of `Either` values
 * @see [[bindLeft]]
 * @see [[lift]]
 */
export function bindRight<R, S, U>(
  g: (y: S) => Either<R, U>
): (xe: Either<R, S>) => Either<R, U> {
  return either<R, S, Either<R, U>>(left, g);
}

/**
 * `bindLeft(f)(left(x)) = left(f(x))`
 * `bindLeft(f)(right(y)) = right(y)`
 * @summary Transforms the left half of `Either` values
 * @see [[bindRight]]
 * @see [[lift]]
 */
export function bindLeft<R, S, T>(
  f: (x: R) => Either<T, S>
): (xe: Either<R, S>) => Either<T, S> {
  return either<R, S, Either<T, S>>(f, right);
}

/**
 * `leftDefault(d)(left(x)) = x`
 * `leftDefault(d)(right(y)) = d`
 * @summary Returns the left value if present, and a default otherwise.
 * @param d default value
 * @see [[rightDefault]]
 */
export function leftDefault<R, S>(d: R, xe: Either<R, S>): R {
  return either<R, S, R>(ident, constant(d))(xe);
}

/**
 * `rightDefault(d)(left(x)) = d`
 * `rightDefault(d)(right(y)) = y`
 * @summary Returns the right value if present, and a default otherwise.
 * @param d default value
 * @see [[leftDefault]]
 */
export function rightDefault<R, S>(d: S, xe: Either<R, S>): S {
  return either<R, S, S>(constant(d), ident)(xe);
}
