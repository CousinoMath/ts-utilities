/**
 * Wraps the result of a computation that can return/throw an error.
 */

// tslint:disable interface-name
/**
 * @summary The acceptable result of a computation.
 */
export interface Ok<R> {
  readonly kind: 'ok';
  readonly value: R;
}

/**
 * @summary The erroneous result of a computation.
 */
export interface Err<S> {
  readonly kind: 'err';
  readonly value: S;
}

/**
 * @summary A discriminated union representing the results of a computation
 */
export type Result<R, S> = Ok<R> | Err<S>;

/**
 * Wraps a result as an Ok value.
 * @param value
 */
export function ok<R, S>(value: R): Result<R, S> {
  return { kind: 'ok', value };
}

/**
 * Wraps a result as an Err value.
 * @param value
 */
export function err<R, S>(value: S): Result<R, S> {
  return { kind: 'err', value };
}

/**
 * Returns true if and only if the Result is an Ok value.
 * @param result
 */
export function isOk<R, S>(result: Result<R, S>): boolean {
  return result.kind === 'ok';
}

/**
 * Returns true if and only if the Result is an Err value.
 * @param result
 */
export function isErr<R, S>(result: Result<R, S>): boolean {
  return result.kind === 'err';
}

/**
 * Unwraps
 * @param result
 */
export function unwrapOk<R, S>(result: Result<R, S>): R {
  if (result.kind === 'ok') {
    return result.value;
  }
  throw new Error('Cannot unwrap an Ok from an Err value.');
}

export function unwrapOr<R, S>(result: Result<R, S>, dflt: R): R {
  return result.kind === 'ok' ? result.value : dflt;
}

export function unwrapErr<R, S>(result: Result<R, S>): S {
  if (result.kind === 'err') {
    return result.value;
  }
  throw new Error('Tried to unwrap an Err from an Ok value.');
}

export function map<R, S, T>(result: Result<R, S>, fn: (x: R) => T): Result<T, S> {
  if (result.kind === 'ok') {
    return ok(fn(result.value));
  } else {
    return err(result.value);
  }
}

export function mapOr<R, S>(result: Result<R, S>, fn: (y: S) => R): R {
  if (result.kind === 'ok') {
    return result.value;
  } else {
    return fn(result.value);
  }
}

export function mapOrElse<R, S, T>(
  result: Result<R, S>,
  okFn: (x: R) => T,
  errFn: (y: S) => T,
) {
  if (result.kind === 'ok') {
    return okFn(result.value);
  } else {
    return errFn(result.value);
  }
}
