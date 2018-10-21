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

describe('List suites', () => {
  const { List, list, NonEmptyList } = require('../dist/es5/index');
  const make = List.make;
  const neMake = NonEmptyList.make;
  const empty = make();
  describe('static methods', () => {
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
        make(
          ['cat', 0],
          ['is', -1],
          ['suffering', 2],
          ['from', -3],
          ['what', 4]
        )
      );
      expect(List.unzip(strs.zip(nums.take(5)))).toEqual([
        strs.take(5),
        nums.take(5)
      ]);
    });
  });
  it('head|last|isEmpty|tail|init|length|size|nth', () => {
    // readonly properties + nth
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
    const neNums = neMake(1, 2, 3, 4, 5);
    expect(neNums.head).toBe(1);
    expect(neNums.last).toBe(5);
    expect(neNums.isEmpty).toBe(false);
  });
  describe('methods', () => {
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
      const neNums = neMake(1, 3, 5, 7, 9);
      expect(neNums.accumulate(plus, 0)).toEqual(neMake(0, 1, 4, 9, 16, 25));
      expect(neNums.accumulateRight(plus, 0)).toEqual(
        neMake(0, 9, 16, 21, 24, 25)
      );
      expect(neNums.accumulateRightWith(plus)).toEqual(
        neMake(9, 16, 21, 24, 25)
      );
      expect(neMake(1).accumulateRightWith(plus)).toEqual(neMake(1));
      expect(neNums.accumulateWith(plus)).toEqual(neMake(1, 4, 9, 16, 25));
      expect(neMake(1).accumulateWith(plus)).toEqual(neMake(1));
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
      const neFibs = neMake(1, 1, 2, 3);
      expect(neFibs.replace(1, 0)).toEqual(neMake(1, 0, 2, 3));
      expect(neFibs.replace(0, 0)).toEqual(neMake(0, 1, 2, 3));
      expect(neFibs.replace(4, 0)).toEqual(neFibs);
      expect(neFibs.replace(-1, 0)).toEqual(neFibs);
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
      const neNums1 = neMake(1, NaN, -0, 0, 2, 3, 1);
      const neNums2 = neMake(0, -0, NaN, 1, 4, 4);
      expect(neNums1.union(empty)).toEqual(neNums1);
      expect(neNums1.union(neNums2)).toEqual(neMake(1, NaN, -0, 0, 2, 3, 1, 4));
      expect(neNums1.unionBy(() => true, neNums2)).toEqual(neNums1);
      expect(neNums1.unionBy(() => false, neNums2)).toEqual(
        neMake(1, NaN, -0, 0, 2, 3, 1, 0, -0, NaN, 1, 4, 4)
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
      expect(xs.partition(x => x < 5)).toEqual([
        make(1, 1, 2, 3, 3, 2, 1, 1, 2, 3),
        make(5, 8, 13, 8, 5, 5)
      ]);
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
      const neXs = neMake(1, 1, 2, 3, 5, 8, 2, 1, 3, 4, 7, 11);
      expect(neXs.group()).toEqual(
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
      expect(neXs.groupBy(() => false)).toEqual(neXs.map(x => neMake(x)));
      expect(neXs.groupBy(() => true)).toEqual(
        neMake(neMake(...neXs.toArray()))
      );
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
      expect(xs.intersperse(' ')).toEqual(
        make('hello', ' ', 'polly', ' ', 'parrot')
      );
      xs = neMake('hello', 'polly', 'parrot');
      expect(xs.take(1).intersperse(' ')).toEqual(xs.take(1));
      expect(xs.intersperse(' ')).toEqual(
        neMake('hello', ' ', 'polly', ' ', 'parrot')
      );
    });
    it('is((In|Pre|Suf)fix|Subsequence)Of(By)?', () => {
      const xs = List.range(1, 6);
      expect(empty.isInfixOf(empty)).toBe(true);
      expect(empty.isInfixOf(xs)).toBe(true);
      expect(xs.isInfixOf(empty)).toBe(false);
      expect(make(3, 4).isInfixOf(xs)).toBe(true);
      expect(make(4, 3).isInfixOf(xs)).toBe(false);
      expect(xs.isInfixOf(xs)).toBe(true);
      expect(empty.isPrefixOf(empty)).toBe(true);
      expect(empty.isPrefixOf(xs)).toBe(true);
      expect(xs.isPrefixOf(empty)).toBe(false);
      expect(List.range(1,3).isPrefixOf(xs)).toBe(true);
      expect(make(1, 2, 4).isPrefixOf(xs)).toBe(false);
      expect(empty.isSuffixOf(empty)).toBe(true);
      expect(empty.isSuffixOf(xs)).toBe(true);
      expect(List.range(3, 6).isSuffixOf(xs)).toBe(true);
      expect(make(-5, 5, 6).isSuffixOf(xs)).toBe(false);
      expect(empty.isSubsequenceOf(empty)).toBe(true);
      expect(empty.isSubsequenceOf(xs)).toBe(true);
      expect(xs.isSubsequenceOf(empty)).toBe(false);
      expect(make(1, 3, 5).isSubsequenceOf(xs)).toBe(true);
      expect(make(1, 3, 9).isSubsequenceOf(xs)).toBe(false);
    });
    it('map', () => {
      // List and NonEmptyList
      expect(empty.map(() => true)).toEqual(empty);
      expect(make(1, 2, 3).map(String)).toEqual(make('1', '2', '3'));
      expect(neMake(1, 2, 3).map(String)).toEqual(neMake('1', '2', '3'));
    });
    xit('mapAccum(Right)?', () => {
      // List and NonEmptyList
    });
    xit('permutations|sub(sequences|strings)', () => {
      // List and NonEmptyList for all
    }); //create substrings
    xit('remove(By)?', () => {});
    it('reverse', () => {
      expect(empty.reverse()).toEqual(empty);
      expect(make(1).reverse()).toEqual(make(1));
      expect(make(1, 2, 3).reverse()).toEqual(make(3, 2, 1));
      expect(neMake(1).reverse()).toEqual(neMake(1));
      expect(neMake(1, 2, 3).reverse()).toEqual(neMake(3, 2, 1));
    });
    it('sortOn|uniques(By)?', () => {
      const xs = make(-5, 4, -3, 2, -1, 1, -2, 3, -4, 5);
      const numOrd = (x, y) => (x < y ? 'LT' : x > y ? 'GT' : 'EQ');
      const cmp1 = (x, y) => numOrd(x * x, y * y);
      const cmp2 = (x, y) => cmp1(y, x);
      expect(empty.sortOn(() => 'EQ')).toEqual(empty);
      expect(xs.sortOn(numOrd)).toEqual(List.range(-5, 5).remove(0));
      expect(xs.sortOn(cmp1)).toEqual(make(-1, 1, 2, -2, -3, 3, 4, -4, -5, 5));
      expect(xs.sortOn(cmp2)).toEqual(make(-5, 5, 4, -4, -3, 3, 2, -2, -1, 1));
      expect(empty.uniquesBy(() => true)).toEqual(empty);
      expect(xs.uniquesBy((x, y) => cmp1(x, y) === 'EQ')).toEqual(
        make(-5, 4, -3, 2, -1)
      );
      expect(xs.uniquesBy(() => false)).toEqual(xs);
      expect(xs.uniquesBy(() => true)).toEqual(make(-5));
      const neXs = neMake(-5, 4, -3, 2, -1, 1, -2, 3, -4, 5);
      expect(neXs.sortOn(numOrd)).toEqual(
        neMake(-5, -4, -3, -2, -1, 1, 2, 3, 4, 5)
      );
      expect(neXs.sortOn(cmp1)).toEqual(
        neMake(-1, 1, 2, -2, -3, 3, 4, -4, -5, 5)
      );
      expect(neXs.sortOn(cmp2)).toEqual(
        neMake(-5, 5, 4, -4, -3, 3, 2, -2, -1, 1)
      );
      expect(neXs.uniquesBy((x, y) => cmp1(x, y) === 'EQ')).toEqual(
        neMake(-5, 4, -3, 2, -1)
      );
      expect(neXs.uniquesBy(() => false)).toEqual(neXs);
      expect(neXs.uniquesBy(() => true)).toEqual(neMake(-5));
    });
    xit('splitAt', () => {});
    it('to(Array|List)', () => {
      xs = [1, 2, 3];
      expect(empty.toArray()).toEqual([]);
      expect(empty.toList()).toEqual(empty);
      expect(make(...xs).toArray()).toEqual(xs);
      expect(make(...xs).toList()).toEqual(make(...xs));
      expect(neMake(...xs).toList()).toEqual(make(...xs));
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
  });
  it('list', () => {
    // inductive rule
    expect(list(0, (accum, val) => accum + val)(empty)).toBe(0);
    expect(list(0, (accum, val) => accum + val)(make(1, 2, 3, 4, 5))).toBe(15);
    const len = list(0, accum => accum + 1);
    expect(len(empty)).toBe(0);
    expect(len(make(1, 2, 3))).toBe(3);
    const evens = list(
      [],
      (accum, value) => (value % 2 === 0 ? accum.concat(value) : accum)
    );
    const xs = make(1, 2, 3, 4, 5, 6);
    expect(evens(empty)).toEqual([]);
    expect(evens(xs)).toEqual([2, 4, 6]);
  });
  describe('AbstractList methods', () => {
    xit('allTruthy|some(Truthy)?|every', () => {});
    xit('(has|includes)(By)?', () => {});
    xit('max|min', () => {
      // List and NonEmptyList
    });
    xit('reduce(Right)?(With)?', () => {
      // List and NonEmptyList
    });
    it('toNonEmptyList', () => {
      xs = [1, 2, 3];
      expect(empty.toNonEmptyList()).toBeNull();
      expect(make(...xs).toNonEmptyList()).toEqual(neMake(...xs));
      expect(neMake(...xs).toNonEmptyList()).toEqual(neMake(...xs));
    });
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
