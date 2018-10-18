import { numberOrd } from './Ordering';

export function equals2<T>(x: T, y: T): boolean {
  // tslint:disable-next-line
  return x == y;
}

export function equals3<T>(x: T, y: T): boolean {
  return x === y;
}

export function sameValue<T>(x: T, y: T): boolean {
  return Object.is(x, y);
}

export function sameValueZero<T>(x: T, y: T): boolean {
  const xType = typeof x;
  const yType = typeof y;
  if (xType === 'number' || yType === 'number') {
    return xType === yType && numberOrd(Number(x), Number(y)) === 'EQ';
  }
  return sameValue(x, y);
}
