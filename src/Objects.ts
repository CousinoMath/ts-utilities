import { numberOrd } from './internal';

/**
 * @summary A convenience function for `(x, y) => x == y`
 */
export function equals2<T>(x: T, y: T): boolean {
  // tslint:disable-next-line
  return x == y;
}

/**
 * @summary A convenience function for `(x, y) => x === y`
 */
export function equals3<T>(x: T, y: T): boolean {
  return x === y;
}

/**
 * @summary A convenience function for SameValueZero equality
 */
export function sameValueZero<T>(x: T, y: T): boolean {
  const xType = typeof x;
  const yType = typeof y;
  if (xType === 'number' || yType === 'number') {
    return xType === yType && numberOrd(Number(x), Number(y)) === 'EQ';
  }
  return Object.is(x, y);
}
