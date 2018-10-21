describe('Array suite', () => {
  // const Arrays = require('../dist/Arrays');
  const Arrays = require('../dist/es5/Arrays');
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
  it('find(Index)?', () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(Arrays.find(arrIn, x => 0 < x && 3 * x < 1)).toBe(1 / 5);
    expect(Arrays.find(arrIn, x => 0 < x && 10 * x < 1)).toBeNull();
    expect(Arrays.findIndex(arrIn, x => 0 < x && 3 * x < 1)).toBe(4);
    expect(Arrays.findIndex(arrIn, x => 0 < x && 10 * x < 1)).toBe(-1);
  });
  it('first|last|nth', () => {
    expect(Arrays.first([])).toBeNull();
    expect(Arrays.first([1, 2, 3])).toBe(1);
    expect(Arrays.last([])).toBeNull();
    expect(Arrays.last([1, 2, 3])).toBe(3);
    expect(Arrays.nth([], 0)).toBeNull();
    expect(Arrays.nth([1, 2, 3], 0)).toBe(1);
    expect(Arrays.nth([1, 2, 3], 1)).toBe(2);
    expect(Arrays.nth([1, 2, 3], 2)).toBe(3);
    expect(Arrays.nth([1, 2, 3], -1)).toBeNull();
    expect(Arrays.nth([1, 2, 3], 3)).toBeNull();
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
    expect(() => Arrays.from(-1, x => Math.sqrt(-1))).toThrowError(
      'Invalid array length.'
    );
    expect(() => Arrays.from(Number.MAX_SAFE_INTEGER, x => 1 / 0)).toThrowError(
      'Invalid array length.'
    );
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
  // const Booleans = require('../dist/Booleans');
  const Booleans = require('../dist/es5/Booleans');
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
  // const Either = require('../dist/Either');
  const Either = require('../dist/es5/Either');
  it('bind(Left|Right)', () => {
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
  it('(left|right)Default', () => {
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
  it('is(Left|Right)', () => {
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
  // const Functions = require('../dist/Functions');
  const Functions = require('../dist/es5/Functions');
  it('ident', () => {
    expect(Functions.ident(0)).toBe(0);
    expect(Functions.ident(Functions.ident)('string')).toBe('string');
  });
  it('curry|uncurry', () => {
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

describe('List suite', () => {
  // const { List, list } = require('../dist/List');
  const { AbstractList } = require('../dist/es5/AbstractList');
  const { List, list } = require('../dist/es5/List');
  const { NonEmptyList } = require('../dist/es5/NonEmptyList');
  const make = List.make;
  const neMake = NonEmptyList.make;
  const empty = make();
  // static methods
  it('and|or', () => {
    expect(List.and(empty)).toBe(true);
    expect(List.and(make(true, true, true))).toBe(true);
    expect(List.and(make(false, true, true))).toBe(false);
    expect(List.and(make(true, true, false))).toBe(false);
    expect(List.or(empty)).toBe(false);
    expect(List.or(make(false, false, false))).toBe(false);
    expect(List.or(make(true, false, false))).toBe(true);
    expect(List.or(make(false, false, true))).toBe(true);
  });
  it('concat', () => {
    expect(List.concat()).toEqual(empty);
    expect(List.concat(empty, empty)).toEqual(empty);
    expect(List.concat(make(1, 2, 3))).toEqual(make(1, 2, 3));
    expect(List.concat(make(1), make(2), make(3))).toEqual(make(1, 2, 3));
  });
  it('list', () => {
    expect(list(0, (accum, val) => accum + val)(empty)).toBe(0);
    expect(list(0, (accum, val) => accum + val)(make(1, 2, 3, 4, 5))).toBe(15);
  });
  it('make', () => {
    expect(List.make()).toEqual(empty);
    expect(List.make(1, 2, 3, 4, 5)).toEqual(new List([1, 2, 3, 4, 5]));
  });
  it('range', () => {
    expect(List.range(10)).toEqual(make(0, 1, 2, 3, 4, 5, 6, 7, 8, 9));
    expect(List.range(0)).toEqual(empty);
    expect(List.range(-1)).toEqual(empty);
    expect(List.range(1, 1)).toEqual(make(1));
    expect(List.range(1, 10)).toEqual(make(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
    expect(List.range(1, 10, 2)).toEqual(make(1, 3, 5, 7, 9));
    expect(List.range(10, 1, -2)).toEqual(make(10, 8, 6, 4, 2));
    expect(() => List.range(1, 10, 0)).toThrowError(
      'Invalid list length encountered in call to List.range'
    );
    expect(() => List.range(1, 10, -1)).toThrowError(
      'Invalid list length encountered in call to List.range'
    );
  });
  it('repeat', () => {
    expect(List.repeat(0, '')).toEqual(empty);
    expect(List.repeat(1, '')).toEqual(make(''));
    expect(List.repeat(5, '')).toEqual(make('', '', '', '', ''));
    expect(() => List.repeat(-1, '')).toThrowError(
      'Invalid list length encountered in a call to List.repeat'
    );
    expect(() => List.repeat(Math.pow(2, 32), '')).toThrowError(
      'Invalid list length encountered in a call to List.repeat'
    );
  });
  it('(un)?zip', () => {
    const strs = make('cat', 'is', 'suffering', 'from', 'what', 'we', 'vets');
    const nums = make(0, -1, 2, -3, 4, -5, 6, -7);
    const xs = List.unzip(List.unzip(strs.zip(nums.take(5)))[0].zip(nums));
    expect(strs.zip(nums.take(5))).toEqual(
      make(['cat', 0], ['is', -1], ['suffering', 2], ['from', -3], ['what', 4])
    );
    expect(List.unzip(strs.zip(nums.take(5)))).toEqual([
      strs.take(5),
      nums.take(5)
    ]);
  });
  it('zipWith', () => {
    const nums1 = make(1, 1, 2, 3, 5, 8, 13, 21, 34, 55);
    const nums2 = make(2, 1, 3, 4, 7, 11, 18, 29, 47, 76);
    expect(nums1.take(5).zipWith((x, y) => y - x, nums2)).toEqual(
      make(1, 0, 1, 1, 2)
    );
    expect(nums1.zipWith((x, y) => y - x, nums2.take(6))).toEqual(
      make(1, 0, 1, 1, 2, 3)
    );
  });
  // readonly properties + nth
  it('head|last|isEmpty|tail|init|length|size|nth', () => {
    const nums = make(1, 2, 3, 4, 5);
    expect(empty.head).toBeNull();
    expect(nums.head).toBe(1);
    expect(empty.last).toBeNull();
    expect(nums.last).toBe(5);
    expect(empty.isEmpty).toBe(true);
    expect(nums.isEmpty).toBe(false);
    expect(empty.tail).toEqual(empty);
    expect(nums.tail).toEqual(make(2, 3, 4, 5));
    expect(empty.init).toEqual(empty);
    expect(nums.init).toEqual(make(1, 2, 3, 4));
    expect(empty.length).toBe(0);
    expect(nums.length).toBe(5);
    expect(empty.size).toBe(0);
    expect(nums.size).toBe(5);
    expect(empty.nth(0)).toBeNull();
    expect(nums.nth(0)).toBe(1);
    expect(nums.nth(4)).toBe(5);
    expect(nums.nth(-1)).toBeNull();
    expect(nums.nth(5)).toBeNull();
  });
  // methods
  it('accumulate(Right)?(With)?', () => {
    const nums = make(1, 3, 5, 7, 9);
    const plus = (x, y) => x + y;
    expect(nums.accumulate(plus, 0)).toEqual(make(0, 1, 4, 9, 16, 25));
    expect(empty.accumulate(plus, 0)).toEqual(make(0));
    expect(nums.accumulateRight(plus, 0)).toEqual(make(0, 9, 16, 21, 24, 25));
    expect(empty.accumulateRight(plus, 0)).toEqual(make(0));
    expect(nums.accumulateRightWith(plus)).toEqual(make(9, 16, 21, 24, 25));
    expect(empty.accumulateRightWith(plus)).toEqual(empty);
    expect(make(1).accumulateRightWith(plus)).toEqual(make(1));
    expect(nums.accumulateWith(plus)).toEqual(make(1, 4, 9, 16, 25));
    expect(empty.accumulateWith(plus)).toEqual(empty);
    expect(make(1).accumulateWith(plus)).toEqual(make(1));
  });
  it('append|prepend', () => {
    expect(empty.append(1)).toEqual(neMake(1));
    expect(empty.append(1).append(2)).toEqual(neMake(1, 2));
    expect(
      empty
        .append(1)
        .prepend(0)
        .append(2)
    ).toEqual(neMake(0, 1, 2));
  });
  it('delete|insert|replace', () => {
    const fibs = make(1, 1, 2, 3);
    expect(empty.delete(0)).toEqual(empty);
    expect(fibs.delete(2)).toEqual(make(1, 1, 3));
    expect(fibs.delete(-1)).toEqual(fibs);
    expect(fibs.delete(4)).toEqual(fibs);
    expect(empty.insert(0, 0)).toEqual(make(0));
    expect(empty.insert(-1, 0)).toEqual(empty);
    expect(empty.insert(1, 0)).toEqual(empty);
    expect(fibs.insert(1, 0)).toEqual(make(1, 0, 1, 2, 3));
    expect(fibs.insert(0, 0)).toEqual(make(0, 1, 1, 2, 3));
    expect(fibs.insert(4, 0)).toEqual(make(1, 1, 2, 3, 0));
    expect(fibs.insert(-1, 0)).toEqual(fibs);
    expect(fibs.insert(5, 0)).toEqual(fibs);
    expect(empty.replace(0, 0)).toEqual(empty);
    expect(empty.replace(-1, 0)).toEqual(empty);
    expect(fibs.replace(1, 0)).toEqual(make(1, 0, 2, 3));
    expect(fibs.replace(0, 0)).toEqual(make(0, 1, 2, 3));
    expect(fibs.replace(4, 0)).toEqual(fibs);
    expect(fibs.replace(-1, 0)).toEqual(fibs);
  });
  it('(difference|intersect|union)(By)?', () => {
    const nums1 = make(1, NaN, -0, 0, 2, 3, 1);
    const nums2 = make(0, -0, NaN, 1, 4, 4);
    expect(empty.difference(empty)).toEqual(empty);
    expect(empty.difference(nums2)).toEqual(empty);
    expect(nums1.difference(empty)).toEqual(nums1);
    expect(nums1.difference(nums2)).toEqual(make(2, 3, 1));
    expect(nums1.differenceBy(() => true, nums2)).toEqual(make(1));
    expect(nums1.differenceBy(() => false, nums2)).toEqual(nums1);
    expect(empty.intersect(empty)).toEqual(empty);
    expect(empty.intersect(nums2)).toEqual(empty);
    expect(nums1.intersect(empty)).toEqual(empty);
    expect(nums1.intersect(nums2)).toEqual(make(1, NaN, -0, 0, 1));
    expect(nums1.intersectBy(() => true, nums2)).toEqual(nums1);
    expect(nums1.intersectBy(() => false, nums2)).toEqual(empty);
    expect(empty.union(empty)).toEqual(empty);
    expect(empty.union(nums2)).toEqual(nums2.drop(-1).delete(1));
    expect(nums1.union(empty)).toEqual(nums1);
    expect(nums1.union(nums2)).toEqual(make(1, NaN, -0, 0, 2, 3, 1, 4));
    expect(nums1.unionBy(() => true, nums2)).toEqual(nums1);
    expect(nums1.unionBy(() => false, nums2)).toEqual(
      make(1, NaN, -0, 0, 2, 3, 1, 0, -0, NaN, 1, 4, 4)
    );
  });
  it('take|drop', () => {
    const xs = make(0, 1, 2, 3, 4, 5);
    expect(xs.take(Math.PI)).toEqual(xs);
    expect(xs.take(-0)).toEqual(empty);
    expect(xs.take(0)).toEqual(empty);
    expect(xs.take(3)).toEqual(make(0, 1, 2));
    expect(xs.take(-3)).toEqual(make(3, 4, 5));
    expect(xs.take(-6)).toEqual(xs);
    expect(xs.take(6)).toEqual(xs);
    expect(xs.drop(Math.PI)).toEqual(xs);
    expect(xs.drop(-0)).toEqual(xs);
    expect(xs.drop(0)).toEqual(xs);
    expect(xs.drop(3)).toEqual(make(3, 4, 5));
    expect(xs.drop(-3)).toEqual(make(0, 1, 2));
    expect(xs.drop(6)).toEqual(empty);
    expect(xs.drop(-6)).toEqual(empty);
  });
  it('(take(drop)?|drop)(Tail)?While', () => {
    const xs = make(1, 2, 4, 8, 16, 32, 64, 32, 16, 8, 4, 2, 1);
    expect(xs.takeWhile(() => false)).toEqual(empty);
    expect(xs.takeWhile(() => true)).toEqual(xs);
    expect(xs.takeWhile(n => n < 10)).toEqual(make(1, 2, 4, 8));
    expect(xs.takeTailWhile(() => false)).toEqual(empty);
    expect(xs.takeTailWhile(() => true)).toEqual(xs);
    expect(xs.takeTailWhile(n => n < 10)).toEqual(make(8, 4, 2, 1));
    expect(xs.dropWhile(() => false)).toEqual(xs);
    expect(xs.dropWhile(() => true)).toEqual(empty);
    expect(xs.dropWhile(n => n < 10)).toEqual(
      make(16, 32, 64, 32, 16, 8, 4, 2, 1)
    );
    expect(xs.dropTailWhile(() => false)).toEqual(xs);
    expect(xs.dropTailWhile(() => true)).toEqual(empty);
    expect(xs.dropTailWhile(n => n < 10)).toEqual(
      make(1, 2, 4, 8, 16, 32, 64, 32, 16)
    );
    expect(xs.takeDropWhile(n => n < 10)).toEqual([
      make(1, 2, 4, 8),
      make(16, 32, 64, 32, 16, 8, 4, 2, 1)
    ]);
    expect(xs.takeDropTailWhile(n => n < 10)).toEqual([
      make(1, 2, 4, 8, 16, 32, 64, 32, 16),
      make(8, 4, 2, 1)
    ]);
  });
  it('filter|partition', () => {
    const xs = make(1, 1, 2, 3, 5, 8, 13, 8, 5, 3, 2, 1, 1, 2, 3, 5);
    expect(empty.filter(() => true)).toEqual(empty);
    expect(xs.filter(() => false)).toEqual(empty);
    expect(xs.filter(() => true)).toEqual(xs);
    expect(xs.filter(x => x < 5)).toEqual(make(1, 1, 2, 3, 3, 2, 1, 1, 2, 3));
    expect(empty.partition(() => true)).toEqual([empty, empty]);
    expect(xs.partition(() => false)).toEqual([empty, xs]);
    expect(xs.partition(() => true)).toEqual([xs, empty]);
    expect(xs.partition(x => x < 5)).toEqual([make(1, 1, 2, 3, 3, 2, 1, 1, 2, 3), make(5, 8, 13, 8, 5, 5)]);
  });
  it('find(Index|Indices)?', () => {
    const xs = make(1, 1, 2, 3, 5, 8, 13, 21, 34);
    expect(xs.find(() => false)).toBeNull();
    expect(xs.find(() => true)).toBe(1);
    expect(xs.find(x => x % 2 === 0)).toBe(2);
    expect(xs.findIndex(() => false)).toBeNull();
    expect(xs.findIndex(() => true)).toBe(0);
    expect(xs.findIndex(x => x % 2 === 0)).toBe(2);
    expect(xs.findIndices(() => false)).toEqual(empty);
    expect(xs.findIndices(() => true)).toEqual(List.range(0, xs.length - 1));
    expect(xs.findIndices(x => x % 2 === 0)).toEqual(make(2, 5, 8));
  });
  it('flatMap', () => {
    const factors = n => List.range(1, n).filter(d => n % d === 0);
    const xs = make(1, 2, 3, 4, 5);
    expect(xs.flatMap(factors)).toEqual(make(1, 1, 2, 1, 3, 1, 2, 4, 1, 5));
    expect(xs.flatMap(() => empty)).toEqual(empty);
    expect(xs.flatMap(x => make(x))).toEqual(xs);
  });
  it('group(By)?', () => {
    const xs = make(1, 1, 2, 3, 5, 8, 2, 1, 3, 4, 7, 11);
    expect(empty.group()).toEqual(empty);
    expect(xs.group()).toEqual(
      make(
        neMake(1, 1, 1),
        neMake(2, 2),
        neMake(3, 3),
        neMake(5),
        neMake(8),
        neMake(4),
        neMake(7),
        neMake(11)
      )
    );
    expect(xs.groupBy(() => false)).toEqual(xs.map(x => neMake(x)));
    expect(xs.groupBy(() => true)).toEqual(make(neMake(...xs.toArray())));
  });
  it('inits|tails', () => {
    const xs = make(1, 2, 3);
    expect(empty.inits()).toEqual(neMake(empty));
    expect(xs.inits()).toEqual(
      neMake(empty, make(1), make(1, 2), make(1, 2, 3))
    );
    expect(empty.tails()).toEqual(neMake(empty));
    expect(xs.tails()).toEqual(
      neMake(make(1, 2, 3), make(2, 3), make(3), empty)
    );
  });
  it('intercalate|intersperse', () => {
    let xs = make(',', ' ');
    expect(xs.intercalate(empty)).toEqual(empty);
    expect(xs.intercalate(make(make('well')))).toEqual(make('well'));
    expect(
      xs.intercalate(make(make('well'), make("you're"), make('a')))
    ).toEqual(make('well', ',', ' ', "you're", ',', ' ', 'a'));
    xs = make('hello', 'polly', 'parrot');
    expect(empty.intersperse(' ')).toEqual(empty);
    expect(xs.take(1).intersperse(' ')).toEqual(xs.take(1));
    expect(xs.intersperse(' ')).toEqual(make('hello', ' ', 'polly', ' ', 'parrot'));
  });
  xit('is((In|Pre|Suf)fix|Subsequence)Of(By)?', () => {});
  xit('map', () => {});
  xit('mapAccum(Right)?', () => {});
  xit('permutations|sub(sequences|strings)', () => {}); //create substrings
  xit('remove(By)?', () => {});
  it('reverse', () => {
    expect(empty.reverse()).toEqual(empty);
    expect(make(1).reverse()).toEqual(make(1));
    expect(make(1, 2, 3).reverse()).toEqual(make(3, 2, 1));
  });
  xit('sortOn|uniques(By)?', () => {});
  xit('splitAt', () => {});
  it('to(Array|List)', () => {
    xs = [1, 2, 3];
    expect(empty.toArray()).toEqual([]);
    expect(empty.toList()).toEqual(empty);
    expect(make(...xs).toArray()).toEqual(xs);
    expect(make(...xs).toList()).toEqual(make(...xs));
  });
  // inductive rule
  it('list', () => {
    const len = list(0, (accum) => accum + 1);
    expect(len(empty)).toBe(0);
    expect(len(make(1, 2, 3))).toBe(3);
    const evens = list([], (accum, value) => value % 2 === 0 ? accum.concat(value) : accum);
    const xs = make(1, 2, 3, 4, 5, 6);
    expect(evens(empty)).toEqual([]);
    expect(evens(xs)).toEqual([2, 4, 6]);
  });
  // AbstractList methods
  xit('(all|some)Truthy', () => {});
  xit('every|some', () => {});
  xit('(has|includes)(By)?', () => {});
  xit('max|min', () => {});
  xit('reduce(Right)?(With)?', () => {});
  xit('toNonEmptyList', () => {});
});

describe('Maybe suite', () => {
  // const Maybe = require('../dist/Maybe');
  const Maybe = require('../dist/es5/Maybe');
  it('bind', () => {
    const head = x => (x.length === 0 ? null : x[0]);
    expect(Maybe.bind(head)()).toBeNull();
    expect(Maybe.bind(head)(null)).toBeNull();
    expect(Maybe.bind(head)([])).toBeNull();
    expect(Maybe.bind(head)([1, 2, 3, 4])).toBe(1);
  });
  it('bindTo(Array|Set|Map)', () => {
    const head = x => (x.length === 0 ? null : x[0]);
    expect(Maybe.bindToArray(head)([])).toEqual([]);
    expect(Maybe.bindToArray(head)(['One', '', 'day'])).toEqual(['O', 'd']);
    // expect(Maybe.bindToSet(head)(new Set())).toEqual(new Set());
    // expect(Maybe.bindToSet(head)(new Set(['One', '', 'day']))).toEqual(
    //   new Set(['O', 'd'])
    // );
    // const mapHead = ([x, y]) => (y.length === 0 ? null : [x, y[0]]);
    // expect(Maybe.bindToMap(mapHead)(new Map())).toEqual(new Map());
    // expect(
    //   Maybe.bindToMap(mapHead)(new Map([[0, 'One'], [1, ''], [2, 'day']]))
    // ).toEqual(new Map([[0, 'O'], [2, 'd']]));
  });
  it('concatMaybes', () => {
    expect(Maybe.concatMaybes([null, 1, null, 2, , 3, null])).toEqual([
      1,
      2,
      3
    ]);
    expect(Maybe.concatMaybes([])).toEqual([]);
    expect(Maybe.concatMaybes([null, null, , null])).toEqual([]);
  });
  it('defaultTo', () => {
    expect(Maybe.defaultTo(0)).toBe(0);
    expect(Maybe.defaultTo(0, null)).toBe(0);
    expect(Maybe.defaultTo(0, 1)).toBe(1);
  });
  it('is(Non)?Null', () => {
    expect(Maybe.isNull()).toBe(true);
    expect(Maybe.isNull(null)).toBe(true);
    expect(Maybe.isNull(0)).toBe(false);
    expect(Maybe.isNonNull()).toBe(false);
    expect(Maybe.isNonNull(null)).toBe(false);
    expect(Maybe.isNonNull(0)).toBe(true);
  });
  it('lift', () => {
    expect(Maybe.lift(x => x.length)()).toBeNull();
    expect(Maybe.lift(x => x.length)(null)).toBeNull();
    expect(Maybe.lift(x => x.length)([])).toBe(0);
    expect(Maybe.lift(x => x.length)([0])).toBe(1);
  });
  it('make', () => {
    expect(Maybe.make(true, () => 1)).toBe(1);
    expect(Maybe.make(false, () => 1)).toBeNull();
  });
  it('maybe', () => {
    expect(Maybe.maybe(0, x => x * x + 1)()).toBe(0);
    expect(Maybe.maybe(0, x => x * x + 1)(null)).toBe(0);
    expect(Maybe.maybe(0, x => x * x + 1)(2)).toBe(5);
  });
});

describe('NonEmptyList', () => {
  // const { AbstractList } = require('../dist/es5/AbstractList');
  const { List, list } = require('../dist/es5/List');
  const { NonEmptyList } = require('../dist/es5/NonEmptyList');
  const neMake = NonEmptyList.make;
  const make = List.make;
  it('head|isEmpty|last', () => {
    const nums = neMake(1, 2, 3, 4, 5);
    expect(nums.head).toBe(1);
    expect(nums.last).toBe(5);
    expect(nums.isEmpty).toBe(false);
  });
  it('accumulate(Right)?(With)?', () => {
    const nums = neMake(1, 3, 5, 7, 9);
    const plus = (x, y) => x + y;
    expect(nums.accumulate(plus, 0)).toEqual(neMake(0, 1, 4, 9, 16, 25));
    expect(nums.accumulateRight(plus, 0)).toEqual(neMake(0, 9, 16, 21, 24, 25));
    expect(nums.accumulateRightWith(plus)).toEqual(neMake(9, 16, 21, 24, 25));
    expect(neMake(1).accumulateRightWith(plus)).toEqual(neMake(1));
    expect(nums.accumulateWith(plus)).toEqual(neMake(1, 4, 9, 16, 25));
    expect(neMake(1).accumulateWith(plus)).toEqual(neMake(1));
  });
  it('group(By)?', () => {
    const xs = neMake(1, 1, 2, 3, 5, 8, 2, 1, 3, 4, 7, 11);
    expect(xs.group()).toEqual(
      neMake(
        neMake(1, 1, 1),
        neMake(2, 2),
        neMake(3, 3),
        neMake(5),
        neMake(8),
        neMake(4),
        neMake(7),
        neMake(11)
      )
    );
    expect(xs.groupBy(() => false)).toEqual(xs.map(x => neMake(x)));
    expect(xs.groupBy(() => true)).toEqual(neMake(neMake(...xs.toArray())));
  });
  it('intersperse', () => {
    xs = neMake('hello', 'polly', 'parrot');
    expect(xs.take(1).intersperse(' ')).toEqual(xs.take(1));
    expect(xs.intersperse(' ')).toEqual(neMake('hello', ' ', 'polly', ' ', 'parrot'));
  });
  xit('map', () => {});
  xit('mapAccum(Right)?', () => {});
  xit('max|min', () => {});
  xit('permutations', () => {});
  xit('reduce(Right)?With', () => {});
  xit('replace', () => {});
  it('reverse', () => {
    expect(neMake(1).reverse()).toEqual(neMake(1));
    expect(neMake(1, 2, 3).reverse()).toEqual(neMake(3, 2, 1));
  });
  xit('sortOn|uniques(By)?', () => {});
  xit('subsequences', () => {});
  it('to(NonEmpty)?List', () => {
    xs = [1, 2, 3];
    expect(neMake(...xs).toNonEmptyList()).toEqual(neMake(...xs));
    expect(neMake(...xs).toList()).toEqual(make(...xs));
});
  it('union(By)?', () => {
    const nums1 = neMake(1, NaN, -0, 0, 2, 3, 1);
    const nums2 = neMake(0, -0, NaN, 1, 4, 4);
    expect(nums1.union(nums2)).toEqual(neMake(1, NaN, -0, 0, 2, 3, 1, 4));
    expect(nums1.unionBy(() => true, nums2)).toEqual(nums1);
    expect(nums1.unionBy(() => false, nums2)).toEqual(
      neMake(1, NaN, -0, 0, 2, 3, 1, 0, -0, NaN, 1, 4, 4)
    );
  });
})
describe('Objects suite', () => {
  // const Objects = require('../dist/Objects');
  const Objects = require('../dist/es5/Objects');

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
    expect(Objects.sameValueZero(0, -0)).toBe(true);
  });
});

describe('Ordering suite', () => {
  // const Ordering = require('../dist/Ordering');
  const Ordering = require('../dist/es5/Ordering');
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
    expect(ord(1, 0)).toBe('GT');
    expect(ord(0, 1)).toBe('LT');
  });
});

describe('Polyfills', () => {
  const Polyfills = require('../dist/es5/Polyfills');
  it('Array fill', () => {
    let arr = new Array(5);
    expect(Polyfills.fill(arr, 0)).toEqual([0, 0, 0, 0, 0]);
    expect(Polyfills.fill(arr, 1, 1)).toEqual([0, 1, 1, 1, 1]);
    expect(Polyfills.fill(arr, 2, 2, 4)).toEqual([0, 1, 2, 2, 1]);
  });
  it('Object is', () => {
    const obj = Object.create(null);
    const anys = [undefined, null, true, false, '', obj, 0, -0, NaN, 1];
    const crossAnys = anys.reduce(
      (accum, value, valIdx) =>
        accum.concat(anys.map((x, xIdx) => [value, x, valIdx === xIdx])),
      []
    );
    const results = crossAnys.map(cross => cross[2]);
    expect(crossAnys.map(cross => Polyfills.is(cross[0], cross[1]))).toEqual(
      results
    );
    expect(Polyfills.is(Object.create(null), Object.create(null))).toBe(false);
  });
  it('Number isInteger', () => {
    const nums = [0, -0, 1, Math.PI, Infinity, -Infinity, NaN];
    const results = [true, true, true, false, false, false, false];
    expect(nums.map(Polyfills.isInteger)).toEqual(results);
  });
  it('Number isNaN', () => {
    const nums = [0, -0, 1, Infinity, -Infinity, NaN];
    const results = [false, false, false, false, false, true];
    expect(nums.map(Polyfills.isNaN)).toEqual(results);
  });
  it('Math log2', () => {
    const nums = [1, 2, 4, -1, Infinity, -Infinity, NaN];
    const results = [0, 1, 2, NaN, Infinity, NaN, NaN];
    expect(nums.map(Polyfills.log2)).toEqual(results);
  });
  it('Math sign', () => {
    const nums = [0, -0, 1, -1, Infinity, -Infinity, NaN];
    const results = [0, -0, 1, -1, 1, -1, NaN];
    expect(nums.map(Polyfills.sign)).toEqual(results);
  });
});

describe('Tuple suite', () => {
  // const Tuple = require('../dist/Tuple');
  const Tuple = require('../dist/es5/Tuple');
  it('curried', () => {
    expect(Tuple.curried(0)(1)).toEqual([0, 1]);
  });
  it('map', () => {
    expect(Tuple.map(x => x + 1, y => y * 2)([2, 2])).toEqual([3, 4]);
  });
  it('product', () => {
    expect(Tuple.product(x => x + 1, y => 2 * y)(2)).toEqual([3, 4]);
  });
  it('swap', () => {
    expect(Tuple.swap([0, 1])).toEqual([1, 0]);
  });
  it('tuple', () => {
    expect(Tuple.tuple(0, 1)).toEqual([0, 1]);
  });
});
