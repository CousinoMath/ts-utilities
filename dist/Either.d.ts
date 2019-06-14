/**
 * A generic, discriminated union type and helpers
 */
/**
 * @summary Left half of the discriminated union
 */
export interface Left<R> {
    readonly kind: 'left';
    readonly value: R;
}
/**
 * @summary Right half of the discriminated union
 */
export interface Right<S> {
    readonly kind: 'right';
    readonly value: S;
}
/**
 * @summary Generic discriminated union
 */
export declare type Either<R, S> = Left<R> | Right<S>;
/**
 * `bindLeft(f)(left(x)) = left(f(x))`
 * `bindLeft(f)(right(y)) = right(y)`
 * @summary Transforms the left half of `Either` values
 * @see [[bindRight]]
 * @see [[lift]]
 */
export declare function bindLeft<R, S, T>(f: (x: R) => Either<T, S>): (xe: Either<R, S>) => Either<T, S>;
/**
 * `bindRight(g)(left(x)) = left(x)`
 * `bindRight(g)(right(y)) = right(g(y))`
 * @summary Transforms the right half of `Either` values
 * @see [[bindLeft]]
 * @see [[lift]]
 */
export declare function bindRight<R, S, U>(g: (y: S) => Either<R, U>): (xe: Either<R, S>) => Either<R, U>;
/**
 * Inductive rule for the `Either` type.
 * @summary Creates functions over `Either` values
 */
export declare function either<R, S, T>(f: (l: R) => T, g: (r: S) => T): (e: Either<R, S>) => T;
/**
 * `isLeft(left(_)) = true`
 * `isLeft(right(_)) = false`
 * @summary Tests whether an `Either` value is of the left type.
 */
export declare function isLeft<R, S>(xe: Either<R, S>): boolean;
/**
 * `isRight(left(_)) = false`
 * `isRight(right(_)) = true`
 * @summary Test whether an `Either` value is of the right type.
 */
export declare function isRight<R, S>(xe: Either<R, S>): boolean;
/**
 * Using left often means explicitly annotating types as
 * the type of the right values cannot be easily deduced.
 * @summary Creates the 'left half' of an `Either` value
 */
export declare function left<R, S>(x: R): Either<R, S>;
/**
 * `leftDefault(d)(left(x)) = x`
 * `leftDefault(d)(right(y)) = d`
 * @summary Returns the left value if present, and a default otherwise.
 * @param d default value
 * @see [[rightDefault]]
 */
export declare function leftDefault<R, S>(d: R, xe: Either<R, S>): R;
/**
 * `lefts([left(x), ...rest]) = [x, lefts(rest)]`
 * `lefts([right(x), ...rest]) = lefts(rest)`
 * @summary Returns an array consisting of the left values of `xes`.
 * @see [[rights]]
 * @see [[partition]]
 */
export declare function lefts<R, S>(xes: Array<Either<R, S>>): R[];
/**
 * `liftEither(f, g)(left(x)) = left(f(x))`
 * `liftEither(f, g)(right(y)) = right(g(y))`
 * @summary Enables transformations on `Either` values
 */
export declare function liftEither<R, S, T, U>(f: (x: R) => T, g: (y: S) => U): (xe: Either<R, S>) => Either<T, U>;
/**
 * `partition(xs) = [lefts(xs), rights(xs)]`
 * @summary Converts an array Eithers to a tuple of an array of left values and another of right values.
 * @see [[lefts]]
 * @see [[rights]]
 */
export declare function partition<R, S>(xes: Array<Either<R, S>>): [R[], S[]];
/**
 * Using right often means explicitly annotating types as
 * the type of the left values cannot be easily deduced.
 * @summary Creates the 'right half' of an `Either` value
 */
export declare function right<R, S>(y: S): Either<R, S>;
/**
 * `rightDefault(d)(left(x)) = d`
 * `rightDefault(d)(right(y)) = y`
 * @summary Returns the right value if present, and a default otherwise.
 * @param d default value
 * @see [[leftDefault]]
 */
export declare function rightDefault<R, S>(d: S, xe: Either<R, S>): S;
/**
 * `rights([left(x), ...rest]) = rights(rest)`
 * `rights([right(x), ...rest]) = [x, rights(rest)]`
 * @summary Returns an array consisting of the right values of `xes`.
 * @see [[lefts]]
 * @see [[partition]]
 */
export declare function rights<R, S>(xes: Array<Either<R, S>>): S[];
