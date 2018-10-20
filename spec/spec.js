describe('Array suite', () => {
  const Arrays = require('../dist/Arrays');
  it('accumulate', () => {
    const arrIn = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    const arrOut = [1, 2, 4, 7, 12, 20, 33, 54, 88, 143];
    expect(Arrays.accumulate((accum, value) => accum + value, arrIn)).toEqual(
      arrOut
    );
    expect(Arrays.accumulate((x, y) => x, [])).toEqual([]);
    expect(Arrays.accumulate((x, y) => x, [1])).toEqual([1]);
  });
  it('array inductive rule', () => {
    const arrIn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const arrOut = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
    const func = (elt, accum) =>
      accum.concat(elt + (accum.length > 0 ? accum[accum.length - 1] : 0));
    expect(Arrays.array([], func)(arrIn)).toEqual(arrOut);
    expect(Arrays.array(true, (elt, accum) => false)([])).toBe(true);
  });
  it('cumSum', () => {
    const arr = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    const csArr = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047];
    expect(Arrays.cumSum(arr)).toEqual(csArr);
  });
  it('find', () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(Arrays.find(arrIn, x => 0 < x && 3 * x < 1)).toBe(1 / 5);
    expect(Arrays.find(arrIn, x => 0 < x && 10 * x < 1)).toBeNull();
  });
  it('findIndex', () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(Arrays.findIndex(arrIn, x => 0 < x && 3 * x < 1)).toBe(4);
    expect(Arrays.findIndex(arrIn, x => 0 < x && 10 * x < 1)).toBe(-1);
  });
  it('first, last, nth', () => {
    expect(Arrays.first([])).toBeNull();
    expect(Arrays.first([1,2,3])).toBe(1);
    expect(Arrays.last([])).toBeNull();
    expect(Arrays.last([1,2,3])).toBe(3);
    expect(Arrays.nth([], 0)).toBeNull();
    expect(Arrays.nth([1,2,3], 0)).toBe(1);
    expect(Arrays.nth([1,2,3], 1)).toBe(2);
    expect(Arrays.nth([1,2,3], 2)).toBe(3);
    expect(Arrays.nth([1,2,3], -1)).toBeNull();
    expect(Arrays.nth([1,2,3], 3)).toBeNull();
  });
  it('flatMap', () => {
    const arrIn = ["It's always sunny", 'in Philadelphia'];
    const arrOut = ["It's", 'always', 'sunny', 'in', 'Philadelphia'];
    expect(Arrays.flatMap(x => x.split(' '), arrIn)).toEqual(arrOut);
  });
  it('flatten', () => {
    const arrIn = [[1, 1 / 2, 1 / 3], [1 / 2, 1 / 3], [1 / 3], []];
    const arrOut = [1, 1 / 2, 1 / 3, 1 / 2, 1 / 3, 1 / 3];
    expect(Arrays.flatten(arrIn)).toEqual(arrOut);
  });
  it('from', () => {
    const arrOut = [1, 1, 4, 27, 256];
    expect(Arrays.from(5, x => Math.pow(x, x))).toEqual(arrOut);
    try {
      expect(Arrays.from(-1, x => Math.sqrt(-1))).toThrowError(
        RangeError,
        'Invalid array length.'
      );
    } catch (err) {}
    try {
      expect(Arrays.from(Number.MAX_SAFE_INTEGER, x => 1 / 0)).toThrowError(
        RangeError,
        'Invalid array length.'
      );
    } catch(err) {}
  });
  it('range', () => {
    expect(Arrays.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(Arrays.range(0)).toEqual([]);
    expect(Arrays.range(-1)).toEqual([]);
    expect(Arrays.range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(Arrays.range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(Arrays.range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
    expect(Arrays.range(1, 10, 0)).toEqual([]);
    expect(Arrays.range(1, 10, -1)).toEqual([]);
  });
  it('reduce', () => {
    const arrIn = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
    const func = (accum, value) =>
      accum.concat(value + (accum.length == 0 ? 0 : accum[accum.length - 1]));
    const arrOut = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    expect(Arrays.reduce(arrIn, func, [])).toEqual(arrOut);
  });
  it('sortOn', () => {
    const arr = [-5, 4, -3, 2, -1, 1, -2, 3, -4, 5];
    const numOrd = (x, y) => (x < y ? 'LT' : x > y ? 'GT' : 'EQ');
    const cmp1 = (x, y) => numOrd(x * x, y * y);
    const cmp2 = (x, y) => cmp1(y, x);
    expect(Arrays.sortOn(numOrd, arr)).toEqual(arr.sort((x, y) => x - y));
    expect(Arrays.sortOn(cmp1, arr)).toEqual(arr.sort((x, y) => x * x - y * y));
    expect(Arrays.sortOn(cmp2, arr)).toEqual(arr.sort((x, y) => y * y - x * x));
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
    const cmp1 = (x, y) => x === y;
    const strReverse = x =>
      x
        .split('')
        .reverse()
        .join('');
    const cmp2 = (x, y) => x === y || x === strReverse(y);
    const cmp3 = (x, y) => y.startsWith(x);
    expect(Arrays.uniqueBy(cmp1, arr)).toEqual([
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
    expect(Arrays.uniqueBy(cmp2, arr)).toEqual([
      '1',
      '21',
      '123',
      '132',
      '213'
    ]);
    expect(Arrays.uniqueBy(cmp3, arr)).toEqual([
      '1',
      '21',
      '231',
      '312',
      '321'
    ]);
  });
});

describe('Booleans suite', () => {
  const Booleans = require('../dist/Booleans');
  it('bool inductive rule', () => {
    expect(Booleans.bool(0, 1)(true)).toBe(0);
    expect(Booleans.bool(0, 1)(false)).toBe(1);
  });
  it('if-then-else', () => {
    expect(Booleans.ifte(true, 0, 1)).toBe(0);
    expect(Booleans.ifte(false, 0, 1)).toBe(1);
  });
});

describe('Either suite', () => {
  const Either = require('../dist/Either');
  it('bindLeft/bindRight', () => {
    const leftFn = Either.bindLeft(
      x =>
        x.length === 0
          ? Either.left('empty string')
          : Either.right(x.toLocaleUpperCase())
    );
    const rightFn = Either.bindRight(
      x => (x === 0 ? Either.left('zero') : Either.right(x + 1))
    );
    expect(leftFn(Either.left(''))).toEqual(Either.left('empty string'));
    expect(leftFn(Either.left('hello'))).toEqual(Either.right('HELLO'));
    expect(leftFn(Either.right(0))).toEqual(Either.right(0));
    expect(rightFn(Either.left('string'))).toEqual(Either.left('string'));
    expect(rightFn(Either.right(0))).toEqual(Either.left('zero'));
    expect(rightFn(Either.right(1))).toEqual(Either.right(2));
  });
  it('defaults left/right', () => {
    expect(Either.leftDefault('default', Either.left('string'))).toBe('string');
    expect(Either.leftDefault('default', Either.right(1))).toBe('default');
    expect(Either.rightDefault(0, Either.left('string'))).toBe(0);
    expect(Either.rightDefault(0, Either.right(1))).toBe(1);
  });
  it('either', () => {
    const eitherFn = Either.either(
      x => x.toLocaleUpperCase(),
      y => Number(y).toString()
    );
    expect(eitherFn(Either.left('hello'))).toBe('HELLO');
    expect(eitherFn(Either.right(7))).toBe('7');
  });
  it('isLeft/isRight', () => {
    expect(Either.isLeft(Either.left(0))).toBe(true);
    expect(Either.isLeft(Either.right(0))).toBe(false);
    expect(Either.isRight(Either.left(0))).toBe(false);
    expect(Either.isRight(Either.right(0))).toBe(true);
  });
  it('lift', () => {
    const eitherFn = Either.lift(x => x.toLocaleUpperCase(), y => y + 1);
    expect(eitherFn(Either.left('string'))).toEqual(Either.left('STRING'));
    expect(eitherFn(Either.right(8))).toEqual(Either.right(9));
  });
  it('partition, lefts, rights', () => {
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
    const strsL = strs.map(Either.left);
    const nums = [2, 1, 3, 4, 7, 11, 18];
    const numsR = nums.map(Either.right);
    expect(Either.lefts(strsL)).toEqual(strs);
    expect(Either.lefts(numsR)).toEqual([]);
    expect(Either.rights(strsL)).toEqual([]);
    expect(Either.rights(numsR)).toEqual(nums);
    expect(Either.partition(strsL)).toEqual([strs, []]);
    expect(Either.partition(numsR)).toEqual([[], nums]);
    expect(Either.partition(strsL.concat(numsR))).toEqual([strs, nums]);
    expect(Either.partition(numsR.concat(strsL))).toEqual([strs, nums]);
  });
});

describe('Functions suite', () => {
  const Functions = require('../dist/Functions');
  it('ident', () => {
    expect(Functions.ident(0)).toBe(0);
    expect(Functions.ident(Functions.ident)('string')).toBe('string');
  });
  it('curry / uncurry', () => {
    const curriedFn = Functions.curry((xs, ys) => xs.concat(ys));
    const uncurriedFn = Functions.uncurry(curriedFn);
    expect(curriedFn('hello ')('string')).toBe('hello string');
    expect(uncurriedFn('hello ', 'string')).toBe('hello string');
    expect(Functions.curry(uncurriedFn)('hello ')('string')).toBe(
      'hello string'
    );
  });
  it('constant', () => {
    expect(Functions.constant(0)('hello')).toBe(0);
  });
  it('flip', () => {
    const fn = (x, y) => x - y;
    expect(Functions.flip(fn)(0, 7)).toBe(fn(7, 0));
  });
  it('compose', () => {
    const plus5 = y => 5 + y;
    const times3 = y => 3 * y;
    expect(
      Functions.compose(
        times3,
        plus5
      )(1)
    ).toBe(18);
    expect(
      Functions.compose(
        plus5,
        times3
      )(1)
    ).toBe(8);
  });
  it('on', () => {
    const eq = (x, y) => x === y;
    const len = x => x.length;
    const eqLen = Functions.on(len, eq);
    expect(eqLen('hello', 'holla')).toBe(true);
    expect(eqLen('hello', 'bonjour')).toBe(false);
  });
});

describe('Objects suite', () => {
  const Objects = require('../dist/Objects');

  it('equality', () => {
    const bools = [true, false];
    const nums = [1, 0, +0, -0, -1, Infinity, -Infinity, NaN];
    const strs = ['1', '0', '+0', '-0', '-1', ''];
    const nils = [null, undefined];
    const arrs = [[], [[]], [0], [1]];
    const objs = [{}, { property: 0 }, { '0': 0 }];
    const elts = [].concat(bools, nums, strs, nils, arrs, objs);
    const cross = elts.reduce((xs, x) => elts.map(y => [x, y]), []);
    const eq2 = cross.map(xy => xy[0] == xy[1]);
    const eq3 = cross.map(xy => xy[0] === xy[1]);
    const svs = cross.map(xy => Object.is(xy[0], xy[1]));
    const svz = (x, y) =>
      Object.is(x, y) ||
      (typeof x === typeof y &&
        typeof y === 'number' &&
        typeof y === 'number' &&
        Math.abs(x) === Math.abs(y) &&
        Math.abs(y) === 0);
    const svzs = cross.map(xy => svz(xy[0], xy[1]));
    expect(cross.map(xy => Objects.equals2(xy[0], xy[1]))).toEqual(eq2);
    expect(cross.map(xy => Objects.equals3(xy[0], xy[1]))).toEqual(eq3);
    expect(cross.map(xy => Objects.sameValue(xy[0], xy[1]))).toEqual(svs);
    expect(cross.map(xy => Objects.sameValueZero(xy[0], xy[1]))).toEqual(svzs);
  });
});

describe('Ordering suite', () => {
  const Ordering = require('../dist/Ordering');
  it('dateOrd', () => {
    const d1 = new Date(2014, 2, 28);
    const d2 = new Date(2014, 3, 2);
    const d3 = new Date(2014, 2, 28);
    expect(Ordering.dateOrd(d1, d2)).toBe('LT');
    expect(Ordering.dateOrd(d2, d1)).toBe('GT');
    expect(Ordering.dateOrd(d1, d1)).toBe('EQ');
    expect(Ordering.dateOrd(d3, d1)).toBe('EQ');
  });
  it('numberOrder', () => {
    expect(Ordering.numberOrd(NaN, NaN)).toBe('EQ');
    expect(Ordering.numberOrd(NaN, 0)).toBe('LT');
    expect(Ordering.numberOrd(-0, 0)).toBe('EQ');
    expect(Ordering.numberOrd(0, 1)).toBe('LT');
    expect(Ordering.numberOrd(1, 0)).toBe('GT');
    expect(Ordering.numberOrd(1, 1)).toBe('EQ');
  });
  it('preorder', () => {
    expect(
      Ordering.preorder(x => x.length, Ordering.numberOrd)('hello', 'hola')
    ).toBe('GT');
  });
  it('stringOrd', () => {
    expect(Ordering.stringOrd('', 'hello')).toBe('LT');
    expect(Ordering.stringOrd('hola', 'hello')).toBe('GT');
    expect(Ordering.stringOrd('hello', 'hello')).toBe('EQ');
  });
  it('toOrdering', () => {
    const ord = Ordering.toOrdering((x, y) => x - y);
    expect(ord(-0, 0)).toBe('EQ');
    expect(ord(1,0)).toBe('GT');
    expect(ord(0,1)).toBe('LT');
  });
});
