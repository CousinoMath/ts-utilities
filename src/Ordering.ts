import { on } from './Functions';

export type Orderings = 'LT' | 'EQ' | 'GT';
export type Ordering<T> = (x: T, y: T) => Orderings;

export function preorder<S, T>(f: (x: S) => T, ord: Ordering<T>): Ordering<S> {
  return on(f, ord);
}

export function numberOrd(x: number, y: number): Orderings {
  const xNan = Number.isNaN(x);
  const yNan = Number.isNaN(y);
  if (xNan || yNan) {
    return xNan && yNan ? 'EQ' : 'LT';
  }
  // Rid of anomolous NaN
  const xAbs = Math.abs(x);
  const yAbs = Math.abs(y);
  if (xAbs > 0 || yAbs > 0) {
    if (x < y) {
      return 'LT';
    } else if (x > y) {
      return 'GT';
    } else {
      return 'EQ';
    }
  } else {
    // xAbs === 0 && yAbs === 0 <-> x = y = [+-]?0
    return 'EQ';
  }
}

export function stringOrd(x: string, y: string): Orderings {
  if (x < y) {
    return 'LT';
  } else if (x > y) {
    return 'GT';
  } else {
    return 'EQ';
  }
}

export function dateOrd(x: Date, y: Date): Orderings {
  if (x < y) {
    return 'LT';
  } else if (x === y) {
    return 'EQ';
  } else {
    return 'GT';
  }
}
