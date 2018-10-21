/**
 * @summary Inductive rule for booleans.
 * @see [[ifte]]
 */
export function bool<T>(trueRes: T, falseRes: T): (b: boolean) => T {
  return b => (b ? trueRes : falseRes);
}

/**
 * @summary A functional if-then-else.
 * @param trueRes returned when `cond` is true
 * @param falseRes returned when `cond` is false
 */
export function ifThenElse<T>(cond: boolean, trueRes: T, falseRes: T): T {
  return cond ? trueRes : falseRes;
}
