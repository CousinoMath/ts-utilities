import {
  accumulate,
  array,
  cumSum,
  fill,
  find,
  findIndex,
  first,
  flatMap,
  flatten,
  from,
  last,
  nth,
  Ordering,
  range,
  reduce,
  sortOn,
  uniqueBy
} from '../src';

describe('Array suite', () => {
  it('accumulate', () => {
    const arrIn = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    const arrOut = [1, 2, 4, 7, 12, 20, 33, 54, 88, 143];
    expect(accumulate((accum, value) => accum + value, arrIn)).toEqual(arrOut);
    expect(accumulate((x, y) => x, [])).toEqual([]);
    expect(accumulate((x, y) => x, [1])).toEqual([1]);
  });
  it('array inductive rule', () => {
    const arrIn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const arrOut = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
    const func = (elt: number, accum: number[]) =>
      accum.concat(elt + (accum.length > 0 ? accum[accum.length - 1] : 0));
    expect(array([], func)(arrIn)).toEqual(arrOut);
    expect(array(true, (elt, accum) => false)([])).toBe(true);
  });
  it('cumSum', () => {
    const arr = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    const csArr = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047];
    expect(cumSum(arr)).toEqual(csArr);
  });
  it('Array fill', () => {
    const arr = new Array(5);
    expect(fill(arr, 0)).toEqual([0, 0, 0, 0, 0]);
    expect(fill(arr, 1, 1)).toEqual([0, 1, 1, 1, 1]);
    expect(fill(arr, 2, 2, 4)).toEqual([0, 1, 2, 2, 1]);
  });
  it('find(Index)?', () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(find(arrIn, x => 0 < x && 3 * x < 1)).toBe(1 / 5);
    expect(find(arrIn, x => 0 < x && 10 * x < 1)).toBeUndefined();
    expect(findIndex(arrIn, x => 0 < x && 3 * x < 1)).toBe(4);
    expect(findIndex(arrIn, x => 0 < x && 10 * x < 1)).toBe(-1);
  });
  it('first|last|nth', () => {
    expect(first([])).toBeUndefined();
    expect(first([1, 2, 3])).toBe(1);
    expect(last([])).toBeUndefined();
    expect(last([1, 2, 3])).toBe(3);
    expect(nth([], 0)).toBeUndefined();
    expect(nth([1, 2, 3], 0)).toBe(1);
    expect(nth([1, 2, 3], 1)).toBe(2);
    expect(nth([1, 2, 3], 2)).toBe(3);
    expect(nth([1, 2, 3], -1)).toBeUndefined();
    expect(nth([1, 2, 3], 3)).toBeUndefined();
  });
  it('flatMap', () => {
    const arrIn = ["It's always sunny", 'in Philadelphia'];
    const arrOut = ["It's", 'always', 'sunny', 'in', 'Philadelphia'];
    expect(flatMap(x => x.split(' '), arrIn)).toEqual(arrOut);
  });
  it('flatten', () => {
    const arrIn = [[1, 1 / 2, 1 / 3], [1 / 2, 1 / 3], [1 / 3], []];
    const arrOut = [1, 1 / 2, 1 / 3, 1 / 2, 1 / 3, 1 / 3];
    expect(flatten(arrIn)).toEqual(arrOut);
  });
  it('from', () => {
    const arrOut = [1, 1, 4, 27, 256];
    expect(from(5, x => Math.pow(x, x))).toEqual(arrOut);
    expect(() => from(-1, x => Math.sqrt(-1))).toThrowError(
      'Invalid array length.'
    );
    expect(() => from(Math.pow(2, 32), x => 1 / 0)).toThrowError(
      'Invalid array length.'
    );
  });
  it('range', () => {
    // expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // expect(range(0)).toEqual([]);
    // expect(range(-1)).toEqual([]);
    expect(range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
    expect(range(1, 10, 0)).toEqual([]);
    expect(range(1, 10, -1)).toEqual([]);
  });
  it('reduce', () => {
    const arrIn = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
    const func = (accum: number[], value: number) =>
      accum.concat(value + (accum.length === 0 ? 0 : accum[accum.length - 1]));
    const arrOut = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    expect(reduce(arrIn, func, [])).toEqual(arrOut);
  });
  it('sortOn', () => {
    const arr = [-5, 4, -3, 2, -1, 1, -2, 3, -4, 5];
    const numOrd: Ordering<number> = (x, y) =>
      x < y ? 'LT' : x > y ? 'GT' : 'EQ';
    const cmp1: Ordering<number> = (x, y) => numOrd(x * x, y * y);
    const cmp2: Ordering<number> = (x, y) => cmp1(y, x);
    expect(sortOn(numOrd, arr)).toEqual(arr.sort((x, y) => x - y));
    expect(sortOn(cmp1, arr)).toEqual(arr.sort((x, y) => x * x - y * y));
    expect(sortOn(cmp2, arr)).toEqual(arr.sort((x, y) => y * y - x * x));
  });
  it('uniqueBy', () => {
    const arr = [
      '1',
      '1',
      '21',
      '12',
      '123',
      '132',
      '213',
      '231',
      '312',
      '321'
    ];
    const cmp1 = (x: string, y: string) => x === y;
    const strReverse = (x: string) =>
      x
        .split('')
        .reverse()
        .join('');
    const cmp2 = (x: string, y: string) => x === y || x === strReverse(y);
    // const cmp3 = (x: string, y: string) => y.startsWith(x);
    expect(uniqueBy(cmp1, arr)).toEqual([
      '1',
      '21',
      '12',
      '123',
      '132',
      '213',
      '231',
      '312',
      '321'
    ]);
    expect(uniqueBy(cmp2, arr)).toEqual(['1', '21', '123', '132', '213']);
    // expect(uniqueBy(cmp3, arr)).toEqual(['1', '21', '231', '312', '321']);
  });
});
