import {
  accumulate,
  array,
  bindLeft,
  bindMaybe,
  bindRight,
  bindToArray,
  bool,
  compose,
  concatMaybes,
  constant,
  cumSum,
  curried,
  curry,
  dateOrd,
  defaultTo,
  either,
  Either,
  equals2,
  equals3,
  fill,
  find,
  findIndex,
  first,
  flatMap,
  flatten,
  flip,
  from,
  identity,
  ifThenElse,
  is,
  isInteger,
  isLeft,
  isNaN,
  isNonNull,
  isNull,
  isRight,
  last,
  left,
  leftDefault,
  lefts,
  liftEither,
  liftMaybe,
  log2,
  makeMaybe,
  mapTuple,
  maybe,
  Maybe,
  nth,
  numberOrd,
  on,
  Ordering,
  partition,
  preorder,
  product,
  range,
  reduce,
  right,
  rightDefault,
  rights,
  sameValue,
  sameValueZero,
  sign,
  sortOn,
  stringOrd,
  swap,
  toOrdering,
  tuple,
  uncurry,
  uniqueBy
} from '../src/index';
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
    expect(find(arrIn, x => 0 < x && 10 * x < 1)).toBeNull();
    expect(findIndex(arrIn, x => 0 < x && 3 * x < 1)).toBe(4);
    expect(findIndex(arrIn, x => 0 < x && 10 * x < 1)).toBe(-1);
  });
  it('first|last|nth', () => {
    expect(first([])).toBeNull();
    expect(first([1, 2, 3])).toBe(1);
    expect(last([])).toBeNull();
    expect(last([1, 2, 3])).toBe(3);
    expect(nth([], 0)).toBeNull();
    expect(nth([1, 2, 3], 0)).toBe(1);
    expect(nth([1, 2, 3], 1)).toBe(2);
    expect(nth([1, 2, 3], 2)).toBe(3);
    expect(nth([1, 2, 3], -1)).toBeNull();
    expect(nth([1, 2, 3], 3)).toBeNull();
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

describe('Booleans suite', () => {
  it('bool inductive rule', () => {
    expect(bool(0, 1)(true)).toBe(0);
    expect(bool(0, 1)(false)).toBe(1);
  });
  it('if-then-else', () => {
    expect(ifThenElse(true, 0, 1)).toBe(0);
    expect(ifThenElse(false, 0, 1)).toBe(1);
  });
});

describe('Either suite', () => {
  it('bind(Left|Right)', () => {
    const leftFn = bindLeft<string, string, string>(
      x =>
        x.length === 0 ? left('empty string') : right(x.toLocaleUpperCase())
    );
    const rightFn = bindRight<string, number, number>(
      x => (x === 0 ? left('zero') : right(x + 1))
    );
    expect(leftFn(left(''))).toEqual(left('empty string'));
    expect(leftFn(left('hello'))).toEqual(right('HELLO'));
    expect(leftFn(right('0'))).toEqual(right('0'));
    expect(rightFn(left('string'))).toEqual(left<string, number>('string'));
    expect(rightFn(right(0))).toEqual(left<string, number>('zero'));
    expect(rightFn(right(1))).toEqual(right<string, number>(2));
  });
  it('(left|right)Default', () => {
    expect(leftDefault('default', left('string'))).toBe('string');
    expect(leftDefault('default', right(1))).toBe('default');
    expect(rightDefault(0, left('string'))).toBe(0);
    expect(rightDefault(0, right(1))).toBe(1);
  });
  it('either', () => {
    const eitherFn = either<string, number, string>(
      x => x.toLocaleUpperCase(),
      y => Number(y).toString()
    );
    expect(eitherFn(left('hello'))).toBe('HELLO');
    expect(eitherFn(right(7))).toBe('7');
  });
  it('is(Left|Right)', () => {
    expect(isLeft(left(0))).toBe(true);
    expect(isLeft(right(0))).toBe(false);
    expect(isRight(left(0))).toBe(false);
    expect(isRight(right(0))).toBe(true);
  });
  it('liftEither', () => {
    const eitherFn = liftEither<string, number, string, number>(
      x => x.toLocaleUpperCase(),
      y => y + 1
    );
    expect(eitherFn(left('string'))).toEqual(left<string, number>('STRING'));
    expect(eitherFn(right(8))).toEqual(right<string, number>(9));
  });
  it('partition|lefts|rights', () => {
    const strs = [
      "you've",
      'got',
      'a',
      'fine',
      'army',
      'base',
      'here',
      'colonel'
    ];
    const strsL = strs.map<Either<string, number>>(left);
    const nums = [2, 1, 3, 4, 7, 11, 18];
    const numsR = nums.map<Either<string, number>>(right);
    expect(lefts(strsL)).toEqual(strs);
    expect(lefts(numsR)).toEqual([]);
    expect(rights(strsL)).toEqual([]);
    expect(rights(numsR)).toEqual(nums);
    expect(partition(strsL)).toEqual([strs, []]);
    expect(partition(numsR)).toEqual([[], nums]);
    expect(partition(strsL.concat(numsR))).toEqual([strs, nums]);
    expect(partition(numsR.concat(strsL))).toEqual([strs, nums]);
  });
});

describe('Functions suite', () => {
  it('identity', () => {
    expect(identity(0)).toBe(0);
    expect(identity(identity)('string')).toBe('string');
  });
  it('curry|uncurry', () => {
    const curriedFn = curry<string, string, string>((xs, ys) => xs.concat(ys));
    const uncurriedFn = uncurry(curriedFn);
    expect(curriedFn('hello ')('string')).toBe('hello string');
    expect(uncurriedFn('hello ', 'string')).toBe('hello string');
    expect(curry(uncurriedFn)('hello ')('string')).toBe('hello string');
  });
  it('constant', () => {
    expect(constant(0)('hello')).toBe(0);
  });
  it('flip', () => {
    const fn = (x: number, y: number) => x - y;
    expect(flip(fn)(0, 7)).toBe(fn(7, 0));
  });
  it('compose', () => {
    const plus5 = (y: number) => 5 + y;
    const times3 = (y: number) => 3 * y;
    expect(
      compose(
        times3,
        plus5
      )(1)
    ).toBe(18);
    expect(
      compose(
        plus5,
        times3
      )(1)
    ).toBe(8);
  });
  it('on', () => {
    const eq = (x: number, y: number) => x === y;
    const len = (x: string) => x.length;
    const eqLen = on(len, eq);
    expect(eqLen('hello', 'holla')).toBe(true);
    expect(eqLen('hello', 'bonjour')).toBe(false);
  });
});

describe('Maybe suite', () => {
  it('bind', () => {
    const head: (xs: number[]) => Maybe<number> = xs =>
      xs.length === 0 ? null : xs[0];
    // expect(bindMaybe(head)(undefined)).toBeNull();
    expect(bindMaybe(head)(null)).toBeNull();
    expect(bindMaybe(head)([])).toBeNull();
    expect(bindMaybe(head)([1, 2, 3, 4])).toBe(1);
  });
  it('bindTo(Array|Set|Map)', () => {
    const head: (x: string) => Maybe<string> = x =>
      x.length === 0 ? null : x[0];
    expect(bindToArray(head)([])).toEqual([]);
    expect(bindToArray(head)(['One', '', 'day'])).toEqual(['O', 'd']);
  });
  it('concatMaybes', () => {
    expect(concatMaybes([null, 1, null, 2, /* undefined, */ 3, null])).toEqual([
      1,
      2,
      3
    ]);
    expect(concatMaybes([])).toEqual([]);
    expect(concatMaybes([null, null, /* undefined, */ null])).toEqual([]);
  });
  it('defaultTo', () => {
    // expect(defaultTo(0, undefined)).toBe(0);
    expect(defaultTo<number>(0, null)).toBe(0);
    expect(defaultTo<number>(0, 1)).toBe(1);
  });
  it('is(Non)?Null', () => {
    // expect(isNull(undefined)).toBe(true);
    expect(isNull(null)).toBe(true);
    expect(isNull(0)).toBe(false);
    expect(isNonNull(undefined)).toBe(false);
    expect(isNonNull(null)).toBe(false);
    expect(isNonNull(0)).toBe(true);
  });
  it('lift', () => {
    // expect(liftMaybe<number[], number>(x => x.length)(undefined)).toBeNull();
    expect(liftMaybe<number[], number>(x => x.length)(null)).toBeNull();
    expect(liftMaybe<number[], number>(x => x.length)([])).toBe(0);
    expect(liftMaybe<number[], number>(x => x.length)([0])).toBe(1);
  });
  it('make', () => {
    expect(makeMaybe(true, () => 1)).toBe(1);
    expect(makeMaybe(false, () => 1)).toBeNull();
  });
  it('maybe', () => {
    // expect(maybe<number, number>(0, x => x * x + 1)(undefined)).toBe(0);
    expect(maybe<number, number>(0, x => x * x + 1)(null)).toBe(0);
    expect(maybe<number, number>(0, x => x * x + 1)(2)).toBe(5);
  });
});

describe('Objects suite', () => {
  it('equality', () => {
    const bools: boolean[] = [true, false];
    const nums: number[] = [1, 0, +0, -0, -1, Infinity, -Infinity, NaN];
    const strs: string[] = ['1', '0', '+0', '-0', '-1', ''];
    const nils: any[] = [null, undefined];
    const arrs: any[] = [[], [[]], [0], [1]];
    const objs: any[] = [{}, { property: 0 }, { '0': 0 }];
    const elts: any[] = [...bools, ...nums, ...strs, ...nils, ...arrs, ...objs];
    const cross = elts.reduce<Array<[any, any]>>(
      (xs, x) => xs.concat(...elts.map(y => [x, y])),
      []
    );
    const eq2 = cross.map(xy => xy[0] === xy[1]);
    const eq3 = cross.map(xy => xy[0] === xy[1]);
    const svs = cross.map(xy => is(xy[0], xy[1]));
    const svz = (x: any, y: any) =>
      is(x, y) ||
      (typeof x === typeof y &&
        typeof y === 'number' &&
        typeof y === 'number' &&
        Math.abs(x) === Math.abs(y) &&
        Math.abs(y) === 0);
    const svzs = cross.map(xy => svz(xy[0], xy[1]));
    expect(cross.map(xy => equals2(xy[0], xy[1]))).toEqual(eq2);
    expect(cross.map(xy => equals3(xy[0], xy[1]))).toEqual(eq3);
    expect(cross.map(xy => sameValue(xy[0], xy[1]))).toEqual(svs);
    expect(cross.map(xy => sameValueZero(xy[0], xy[1]))).toEqual(svzs);
    expect(sameValueZero(0, -0)).toBe(true);
  });
});

describe('Ordering suite', () => {
  it('dateOrd', () => {
    const d1 = new Date(2014, 2, 28);
    const d2 = new Date(2014, 3, 2);
    const d3 = new Date(2014, 2, 28);
    expect(dateOrd(d1, d2)).toBe('LT');
    expect(dateOrd(d2, d1)).toBe('GT');
    expect(dateOrd(d1, d1)).toBe('EQ');
    expect(dateOrd(d3, d1)).toBe('EQ');
  });
  it('numberOrder', () => {
    expect(numberOrd(NaN, NaN)).toBe('EQ');
    expect(numberOrd(NaN, 0)).toBe('LT');
    expect(numberOrd(-0, 0)).toBe('EQ');
    expect(numberOrd(0, 1)).toBe('LT');
    expect(numberOrd(1, 0)).toBe('GT');
    expect(numberOrd(1, 1)).toBe('EQ');
  });
  it('preorder', () => {
    expect(
      preorder<string, number>(x => x.length, numberOrd)('hello', 'hola')
    ).toBe('GT');
  });
  it('stringOrd', () => {
    expect(stringOrd('', 'hello')).toBe('LT');
    expect(stringOrd('hola', 'hello')).toBe('GT');
    expect(stringOrd('hello', 'hello')).toBe('EQ');
  });
  it('toOrdering', () => {
    const ord = toOrdering<number>((x, y) => x - y);
    expect(ord(-0, 0)).toBe('EQ');
    expect(ord(1, 0)).toBe('GT');
    expect(ord(0, 1)).toBe('LT');
  });
});

describe('Polyfills', () => {
  it('Object is', () => {
    const obj = Object.create(null);
    const anys = [undefined, null, true, false, '', obj, 0, -0, NaN, 1];
    const crossAnys = anys.reduce(
      (accum: Array<[any, any, boolean]>, value: any, valIdx) =>
        accum.concat(
          anys.map<[any, any, boolean]>((x, xIdx) => [
            value,
            x,
            valIdx === xIdx
          ])
        ),
      []
    );
    const results = crossAnys.map(cross => cross[2]);
    expect(crossAnys.map(cross => is(cross[0], cross[1]))).toEqual(results);
    expect(is(Object.create(null), Object.create(null))).toBe(false);
  });
  it('Number isInteger', () => {
    const nums = [0, -0, 1, Math.PI, Infinity, -Infinity, NaN];
    const results = [true, true, true, false, false, false, false];
    expect(nums.map(isInteger)).toEqual(results);
  });
  it('Number isNaN', () => {
    const nums = [0, -0, 1, Infinity, -Infinity, NaN];
    const results = [false, false, false, false, false, true];
    expect(nums.map(isNaN)).toEqual(results);
  });
  it('Math log2', () => {
    const nums = [1, 2, 4, -1, Infinity, -Infinity, NaN];
    const results = [0, 1, 2, NaN, Infinity, NaN, NaN];
    expect(nums.map(log2)).toEqual(results);
  });
  it('Math sign', () => {
    const nums = [0, -0, 1, -1, Infinity, -Infinity, NaN];
    const results = [0, -0, 1, -1, 1, -1, NaN];
    expect(nums.map(sign)).toEqual(results);
  });
});

describe('Tuple suite', () => {
  it('curried', () => {
    expect(curried(0)(1)).toEqual([0, 1]);
  });
  it('map', () => {
    expect(
      mapTuple<number, number, number, number>(x => x + 1, y => y * 2)([2, 2])
    ).toEqual([3, 4]);
  });
  it('product', () => {
    expect(product<number, number, number>(x => x + 1, y => 2 * y)(2)).toEqual([
      3,
      4
    ]);
  });
  it('swap', () => {
    expect(swap([0, 1])).toEqual([1, 0]);
  });
  it('tuple', () => {
    expect(tuple(0, 1)).toEqual([0, 1]);
  });
});
