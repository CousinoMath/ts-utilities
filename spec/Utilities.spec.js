describe('Array suite', () => {
  const {
    accumulate,
    array,
    cumSum,
    fill,
    find,
    findIndex,
    first,
    last,
    nth,
    flatMap,
    flatten,
    from,
    range,
    reduce,
    sortOn,
    uniqueBy
  } = require('../dist/es5/index');
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
    const func = (elt, accum) =>
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
    let arr = new Array(5);
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
    expect(() => from(Number.MAX_SAFE_INTEGER, x => 1 / 0)).toThrowError(
      'Invalid array length.'
    );
  });
  it('range', () => {
    expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(range(0)).toEqual([]);
    expect(range(-1)).toEqual([]);
    expect(range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
    expect(range(1, 10, 0)).toEqual([]);
    expect(range(1, 10, -1)).toEqual([]);
  });
  it('reduce', () => {
    const arrIn = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
    const func = (accum, value) =>
      accum.concat(value + (accum.length == 0 ? 0 : accum[accum.length - 1]));
    const arrOut = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    expect(reduce(arrIn, func, [])).toEqual(arrOut);
  });
  it('sortOn', () => {
    const arr = [-5, 4, -3, 2, -1, 1, -2, 3, -4, 5];
    const numOrd = (x, y) => (x < y ? 'LT' : x > y ? 'GT' : 'EQ');
    const cmp1 = (x, y) => numOrd(x * x, y * y);
    const cmp2 = (x, y) => cmp1(y, x);
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
    const cmp1 = (x, y) => x === y;
    const strReverse = x =>
      x
        .split('')
        .reverse()
        .join('');
    const cmp2 = (x, y) => x === y || x === strReverse(y);
    const cmp3 = (x, y) => y.startsWith(x);
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
    expect(uniqueBy(cmp3, arr)).toEqual(['1', '21', '231', '312', '321']);
  });
});

describe('Booleans suite', () => {
  const { bool, ifThenElse } = require('../dist/es5/index');
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
  const {
    bindLeft,
    bindRight,
    left,
    right,
    leftDefault,
    rightDefault,
    either,
    isLeft,
    isRight,
    liftEither,
    partition,
    lefts,
    rights,
    Either
  } = require('../dist/es5/index');
  it('bind(Left|Right)', () => {
    const leftFn = bindLeft(
      x =>
        x.length === 0 ? left('empty string') : right(x.toLocaleUpperCase())
    );
    const rightFn = bindRight(x => (x === 0 ? left('zero') : right(x + 1)));
    expect(leftFn(left(''))).toEqual(left('empty string'));
    expect(leftFn(left('hello'))).toEqual(right('HELLO'));
    expect(leftFn(right(0))).toEqual(right(0));
    expect(rightFn(left('string'))).toEqual(left('string'));
    expect(rightFn(right(0))).toEqual(left('zero'));
    expect(rightFn(right(1))).toEqual(right(2));
  });
  it('(left|right)Default', () => {
    expect(leftDefault('default', left('string'))).toBe('string');
    expect(leftDefault('default', right(1))).toBe('default');
    expect(rightDefault(0, left('string'))).toBe(0);
    expect(rightDefault(0, right(1))).toBe(1);
  });
  it('either', () => {
    const eitherFn = either(
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
    const eitherFn = liftEither(x => x.toLocaleUpperCase(), y => y + 1);
    expect(eitherFn(left('string'))).toEqual(left('STRING'));
    expect(eitherFn(right(8))).toEqual(right(9));
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
    const strsL = strs.map(left);
    const nums = [2, 1, 3, 4, 7, 11, 18];
    const numsR = nums.map(right);
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
  const {
    identity,
    curry,
    constant,
    uncurry,
    flip,
    compose,
    on
  } = require('../dist/es5/index');
  it('identity', () => {
    expect(identity(0)).toBe(0);
    expect(identity(identity)('string')).toBe('string');
  });
  it('curry|uncurry', () => {
    const curriedFn = curry((xs, ys) => xs.concat(ys));
    const uncurriedFn = uncurry(curriedFn);
    expect(curriedFn('hello ')('string')).toBe('hello string');
    expect(uncurriedFn('hello ', 'string')).toBe('hello string');
    expect(curry(uncurriedFn)('hello ')('string')).toBe('hello string');
  });
  it('constant', () => {
    expect(constant(0)('hello')).toBe(0);
  });
  it('flip', () => {
    const fn = (x, y) => x - y;
    expect(flip(fn)(0, 7)).toBe(fn(7, 0));
  });
  it('compose', () => {
    const plus5 = y => 5 + y;
    const times3 = y => 3 * y;
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
    const eq = (x, y) => x === y;
    const len = x => x.length;
    const eqLen = on(len, eq);
    expect(eqLen('hello', 'holla')).toBe(true);
    expect(eqLen('hello', 'bonjour')).toBe(false);
  });
});

describe('Maybe suite', () => {
  const {
    bindMaybe,
    bindToArray,
    concatMaybes,
    defaultTo,
    isNonNull,
    isNull,
    liftMaybe,
    makeMaybe,
    maybe
  } = require('../dist/es5/index');
  it('bind', () => {
    const head = x => (x.length === 0 ? null : x[0]);
    expect(bindMaybe(head)()).toBeNull();
    expect(bindMaybe(head)(null)).toBeNull();
    expect(bindMaybe(head)([])).toBeNull();
    expect(bindMaybe(head)([1, 2, 3, 4])).toBe(1);
  });
  it('bindTo(Array|Set|Map)', () => {
    const head = x => (x.length === 0 ? null : x[0]);
    expect(bindToArray(head)([])).toEqual([]);
    expect(bindToArray(head)(['One', '', 'day'])).toEqual(['O', 'd']);
  });
  it('concatMaybes', () => {
    expect(concatMaybes([null, 1, null, 2, , 3, null])).toEqual([1, 2, 3]);
    expect(concatMaybes([])).toEqual([]);
    expect(concatMaybes([null, null, , null])).toEqual([]);
  });
  it('defaultTo', () => {
    expect(defaultTo(0)).toBe(0);
    expect(defaultTo(0, null)).toBe(0);
    expect(defaultTo(0, 1)).toBe(1);
  });
  it('is(Non)?Null', () => {
    expect(isNull()).toBe(true);
    expect(isNull(null)).toBe(true);
    expect(isNull(0)).toBe(false);
    expect(isNonNull()).toBe(false);
    expect(isNonNull(null)).toBe(false);
    expect(isNonNull(0)).toBe(true);
  });
  it('lift', () => {
    expect(liftMaybe(x => x.length)()).toBeNull();
    expect(liftMaybe(x => x.length)(null)).toBeNull();
    expect(liftMaybe(x => x.length)([])).toBe(0);
    expect(liftMaybe(x => x.length)([0])).toBe(1);
  });
  it('make', () => {
    expect(makeMaybe(true, () => 1)).toBe(1);
    expect(makeMaybe(false, () => 1)).toBeNull();
  });
  it('maybe', () => {
    expect(maybe(0, x => x * x + 1)()).toBe(0);
    expect(maybe(0, x => x * x + 1)(null)).toBe(0);
    expect(maybe(0, x => x * x + 1)(2)).toBe(5);
  });
});

describe('Objects suite', () => {
  const {
    equals2,
    equals3,
    sameValue,
    sameValueZero
  } = require('../dist/es5/index');

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
    expect(cross.map(xy => equals2(xy[0], xy[1]))).toEqual(eq2);
    expect(cross.map(xy => equals3(xy[0], xy[1]))).toEqual(eq3);
    expect(cross.map(xy => sameValue(xy[0], xy[1]))).toEqual(svs);
    expect(cross.map(xy => sameValueZero(xy[0], xy[1]))).toEqual(svzs);
    expect(sameValueZero(0, -0)).toBe(true);
  });
});

describe('Ordering suite', () => {
  const {
    dateOrd,
    numberOrd,
    preorder,
    stringOrd,
    toOrdering
  } = require('../dist/es5/index');
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
    expect(preorder(x => x.length, numberOrd)('hello', 'hola')).toBe('GT');
  });
  it('stringOrd', () => {
    expect(stringOrd('', 'hello')).toBe('LT');
    expect(stringOrd('hola', 'hello')).toBe('GT');
    expect(stringOrd('hello', 'hello')).toBe('EQ');
  });
  it('toOrdering', () => {
    const ord = toOrdering((x, y) => x - y);
    expect(ord(-0, 0)).toBe('EQ');
    expect(ord(1, 0)).toBe('GT');
    expect(ord(0, 1)).toBe('LT');
  });
});

describe('Polyfills', () => {
  const { is, isInteger, isNaN, log2, sign } = require('../dist/es5/index');
  it('Object is', () => {
    const obj = Object.create(null);
    const anys = [undefined, null, true, false, '', obj, 0, -0, NaN, 1];
    const crossAnys = anys.reduce(
      (accum, value, valIdx) =>
        accum.concat(anys.map((x, xIdx) => [value, x, valIdx === xIdx])),
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
  const {
    curried,
    mapTuple,
    product,
    swap,
    tuple
  } = require('../dist/es5/index');
  it('curried', () => {
    expect(curried(0)(1)).toEqual([0, 1]);
  });
  it('map', () => {
    expect(mapTuple(x => x + 1, y => y * 2)([2, 2])).toEqual([3, 4]);
  });
  it('product', () => {
    expect(product(x => x + 1, y => 2 * y)(2)).toEqual([3, 4]);
  });
  it('swap', () => {
    expect(swap([0, 1])).toEqual([1, 0]);
  });
  it('tuple', () => {
    expect(tuple(0, 1)).toEqual([0, 1]);
  });
});
