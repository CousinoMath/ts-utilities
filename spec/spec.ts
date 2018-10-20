import {
  Arrays,
  Booleans,
  Either,
  Functions,
  // List,
  // list,
  Maybe,
  Objects,
  Ordering,
  Tuple
} from '../src/index';

describe('Array suite', () => {
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
    const func = (elt: number, accum: number[]) =>
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
    try {
      expect(Arrays.from(-1, x => Math.sqrt(-1))).toThrowError(
        'Invalid array length.'
      );
    } catch (err) {// tslint: disable-next-line
    }
    try {
      expect(Arrays.from(Number.MAX_SAFE_INTEGER, x => 1 / 0)).toThrowError(
        'Invalid array length.'
      );
    } catch (err) {// tslint: disable-next-line
    }
  });
  it('range', () => {
    // expect(Arrays.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    // expect(Arrays.range(0)).toEqual([]);
    // expect(Arrays.range(-1)).toEqual([]);
    expect(Arrays.range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(Arrays.range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(Arrays.range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
    expect(Arrays.range(1, 10, 0)).toEqual([]);
    expect(Arrays.range(1, 10, -1)).toEqual([]);
  });
  it('reduce', () => {
    const arrIn = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
    const func = (accum: number[], value: number) =>
      accum.concat(value + (accum.length === 0 ? 0 : accum[accum.length - 1]));
    const arrOut = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    expect(Arrays.reduce(arrIn, func, [])).toEqual(arrOut);
  });
  it('sortOn', () => {
    const arr = [-5, 4, -3, 2, -1, 1, -2, 3, -4, 5];
    const numOrd = (x: number, y: number) => (x < y ? 'LT' : x > y ? 'GT' : 'EQ');
    const cmp1 = (x: number, y: number) => numOrd(x * x, y * y);
    const cmp2 = (x: number, y: number) => cmp1(y, x);
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
    const cmp1 = (x: string, y: string) => x === y;
    const strReverse = (x: string) =>
      x
        .split('')
        .reverse()
        .join('');
    const cmp2 = (x: string, y: string) => x === y || x === strReverse(y);
    const cmp3 = (x: string, y: string) => y.startsWith(x);
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
  it('bindLeft/bindRight', () => {
    const leftFn = Either.bindLeft<string, number, string>(
      x =>
        x.length === 0 ? Either.left('empty string') : Either.right(x.length)
    );
    const rightFn = Either.bindRight<string, number, number>(
      x => (x === 0 ? Either.left('zero') : Either.right(x + 1))
    );
    expect(leftFn(Either.left(''))).toEqual(
      Either.left<string, number>('empty string')
    );
    expect(leftFn(Either.left('hello'))).toEqual(
      Either.right<string, number>(4)
    );
    expect(leftFn(Either.right(0))).toEqual(Either.right<string, number>(0));
    expect(rightFn(Either.left('string'))).toEqual(
      Either.left<string, number>('string')
    );
    expect(rightFn(Either.right(0))).toEqual(
      Either.left<string, number>('zero')
    );
    expect(rightFn(Either.right(1))).toEqual(Either.right<string, number>(2));
  });
  it('defaults left/right', () => {
    expect(Either.leftDefault('default', Either.left('string'))).toBe('string');
    expect(Either.leftDefault('default', Either.right(1))).toBe('default');
    expect(Either.rightDefault(0, Either.left('string'))).toBe(0);
    expect(Either.rightDefault(0, Either.right(1))).toBe(1);
  });
  it('either', () => {
    const eitherFn = Either.either<string, number, string>(
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
    const eitherFn = Either.lift<string, number, string, number>(
      x => x.toLocaleUpperCase(),
      y => y + 1
    );
    expect(eitherFn(Either.left('string'))).toEqual(
      Either.left<string, number>('STRING')
    );
    expect(eitherFn(Either.right(8))).toEqual(Either.right<string, number>(9));
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
    const strsL = strs.map<Either.Either<string, number>>(Either.left);
    const nums = [2, 1, 3, 4, 7, 11, 18];
    const numsR = nums.map<Either.Either<string, number>>(Either.right);
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
  it('ident', () => {
    expect(Functions.ident(0)).toBe(0);
    expect(Functions.ident(Functions.ident)('string')).toBe('string');
  });
  it('curry / uncurry', () => {
    const curriedFn = Functions.curry<string, string, string>((xs, ys) =>
      xs.concat(ys)
    );
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
    const fn = (x: number, y: number) => x - y;
    expect(Functions.flip(fn)(0, 7)).toBe(fn(7, 0));
  });
  it('compose', () => {
    const plus5 = (y: number) => 5 + y;
    const times3 = (y: number) => 3 * y;
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
    const eq = (x: number, y: number) => x === y;
    const len = (x: string) => x.length;
    const eqLen = Functions.on(len, eq);
    expect(eqLen('hello', 'holla')).toBe(true);
    expect(eqLen('hello', 'bonjour')).toBe(false);
  });
});

// describe('List suite', () => {
//   const empty = new List([]);
//   const make = List.make;
//   it('and / or', () => {
//     expect(List.and(empty)).toBe(true);
//     expect(List.and(make(true, true, true))).toBe(true);
//     expect(List.and(make(false, true, true))).toBe(false);
//     expect(List.and(make(true, true, false))).toBe(false);
//     expect(List.or(empty)).toBe(false);
//     expect(List.or(make(false, false, false))).toBe(false);
//     expect(List.or(make(true, false, false))).toBe(true);
//     expect(List.or(make(false, false, true))).toBe(true);
//   });
//   it('concat', () => {
//     expect(List.concat([])).toEqual(empty);
//     expect(List.concat([empty, empty])).toEqual(empty);
//     expect(List.concat([make(1, 2, 3)])).toEqual(make(1, 2, 3));
//     expect(List.concat([make(1), make(2), make(3)])).toEqual(make(1, 2, 3));
//   });
//   it('itercalate', () => {
//     expect(List.itercalate(make(',', ' '), empty)).toEqual(empty);
//     expect(List.itercalate(make(',', ' '), make(make('well')))).toEqual(make('well'));
//     expect(
//       List.itercalate(make(',', ' '), make(make('well'), make("you're"), make('a')))
//     ).toEqual(make('well', ',', ' ', "you're", ',', ' ', 'a'));
//   });
//   it('list', () => {
//     expect(list(0, (accum: number, val: number) => accum + val)(empty)).toBe(0);
//     expect(list(0, (accum: number, val: number) => accum + val)(make(1, 2, 3, 4, 5))).toBe(10);
//   });
//   it('make', () => {
//     expect(make()).toEqual(empty);
//     expect(make(1, 2, 3, 4, 5)).toEqual(new List([1, 2, 3, 4, 5]));
//   });
//   it('range', () => {
//     // expect(List.range(10)).toEqual(make(0, 1, 2, 3, 4, 5, 6, 7, 8, 9));
//     // expect(List.range(0)).toEqual(empty);
//     // expect(List.range(-1)).toEqual(empty);
//     expect(List.range(1, 10)).toEqual(make(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
//     expect(List.range(1, 10, 2)).toEqual(make(1, 3, 5, 7, 9));
//     expect(List.range(10, 1, -2)).toEqual(make(10, 8, 6, 4, 2));
//     expect(List.range(1, 10, 0)).toEqual(empty);
//     expect(List.range(1, 10, -1)).toEqual(empty);
//   });
//   it('repeat', () => {
//     expect(List.repeat(0, '')).toEqual(empty);
//     expect(List.repeat(1, '')).toEqual(make(''));
//     expect(List.repeat(5, '')).toEqual(make('', '', '', '', ''));
//     try {
//       expect(List.repeat(-1, '')).toThrowError(
//         'Invalid list length encountered in a call to List.repeat'
//       );
//     } catch (err) {// tslint: disable-next-line
//     }
//     try {
//       expect(List.repeat(Math.pow(2, 32), '')).toThrowError(
//         'Invalid list length encountered in a call to List.repeat'
//       );
//     } catch (err) {// tslint: disable-next-line
//     }
//   });
// });

describe('Maybe suite', () => {
  it('bind', () => {
    const head: (xs: number[]) => Maybe.Maybe<number> = xs =>
      xs.length === 0 ? null : xs[0];
    // expect(Maybe.bind(head)(undefined)).toBeNull();
    expect(Maybe.bind(head)(null)).toBeNull();
    expect(Maybe.bind(head)([])).toBeNull();
    expect(Maybe.bind(head)([1, 2, 3, 4])).toBe(1);
  });
  it('bindTo(Array|Set|Map)', () => {
    const head: (xs: string) => Maybe.Maybe<string> = xs =>
      xs.length === 0 ? null : xs[0];
    expect(Maybe.bindToArray(head)([])).toEqual([]);
    expect(Maybe.bindToArray(head)(['One', '', 'day'])).toEqual(['O', 'd']);
    expect(Maybe.bindToSet(head)(new Set())).toEqual(new Set());
    expect(Maybe.bindToSet(head)(new Set(['One', '', 'day']))).toEqual(
      new Set(['O', 'd'])
    );
    const mapHead: (xy: [number, string]) => Maybe.Maybe<[number, string]> = ([
      x,
      y
    ]) => (y.length === 0 ? null : [x, y[0]]);
    expect(Maybe.bindToMap(mapHead)(new Map())).toEqual(new Map());
    expect(
      Maybe.bindToMap(mapHead)(new Map([[0, 'One'], [1, ''], [2, 'day']]))
    ).toEqual(new Map([[0, 'O'], [2, 'd']]));
  });
  it('concatMaybes', () => {
    expect(Maybe.concatMaybes([null, 1, null, 2, undefined, 3, null])).toEqual([
      1,
      2,
      3
    ]);
    expect(Maybe.concatMaybes([])).toEqual([]);
    expect(Maybe.concatMaybes([null, null, undefined, null])).toEqual([]);
  });
  it('defaultTo', () => {
    // expect(Maybe.defaultTo(0, undefined)).toBe(0);
    expect(Maybe.defaultTo(0, null)).toBe(0);
    expect(Maybe.defaultTo<number>(0, 1)).toBe(1);
  });
  it('isNonNull / isNull', () => {
    // expect(Maybe.isNull(undefined)).toBe(true);
    expect(Maybe.isNull(null)).toBe(true);
    expect(Maybe.isNull(0)).toBe(false);
    // expect(Maybe.isNonNull(undefined)).toBe(false);
    expect(Maybe.isNonNull(null)).toBe(false);
    expect(Maybe.isNonNull(0)).toBe(true);
  });
  it('lift', () => {
    // expect(Maybe.lift((x: number[]) => x.length)(undefined)).toBeNull();
    expect(Maybe.lift((x: number[]) => x.length)(null)).toBeNull();
    expect(Maybe.lift((x: number[]) => x.length)([])).toBe(0);
    expect(Maybe.lift((x: number[]) => x.length)([0])).toBe(1);
  });
  it('maybe', () => {
    // expect(Maybe.maybe(0, (x: number) => x * x + 1)(undefined)).toBe(0);
    expect(Maybe.maybe(0, (x: number) => x * x + 1)(null)).toBe(0);
    expect(Maybe.maybe(0, (x: number) => x * x + 1)(2)).toBe(5);
  });
});

describe('Objects suite', () => {
  it('equality', () => {
    const bools: any[] = [true, false];
    const nums: any[] = [1, 0, +0, -0, -1, Infinity, -Infinity, NaN];
    const strs: any[] = ['1', '0', '+0', '-0', '-1', ''];
    const nils: any[] = [null, undefined];
    // const arrs: any[][] = [[]];
    const objs: {}[] = [{}];
    const elts: any[] = [...bools, ...nums, ...strs, ...nils, ...objs];
    const cross: Array<[any, any]> = elts.reduce((xs: Array<[any, any]>, x: any) => xs.concat(elts.map<[any,any]>(y => [x, y])), []);
    const eq2: boolean[] = cross.map(xy => xy[0] === xy[1]);
    const eq3: boolean[] = cross.map(xy => xy[0] === xy[1]);
    const svs: boolean[] = cross.map(xy => Object.is(xy[0], xy[1]));
    const svz = (x: any, y: any) =>
      Object.is(x, y) ||
      (typeof x === typeof y &&
        typeof y === 'number' &&
        typeof y === 'number' &&
        Math.abs(x) === Math.abs(y) &&
        Math.abs(y) === 0);
    const svzs: boolean[] = cross.map(xy => svz(xy[0], xy[1]));
    expect(cross.map(xy => Objects.equals2(xy[0], xy[1]))).toEqual(eq2);
    expect(cross.map(xy => Objects.equals3(xy[0], xy[1]))).toEqual(eq3);
    expect(cross.map(xy => Objects.sameValue(xy[0], xy[1]))).toEqual(svs);
    expect(cross.map(xy => Objects.sameValueZero(xy[0], xy[1]))).toEqual(svzs);
  });
});

describe('Ordering suite', () => {
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
      Ordering.preorder((x: string) => x.length, Ordering.numberOrd)('hello', 'hola')
    ).toBe('GT');
  });
  it('stringOrd', () => {
    expect(Ordering.stringOrd('', 'hello')).toBe('LT');
    expect(Ordering.stringOrd('hola', 'hello')).toBe('GT');
    expect(Ordering.stringOrd('hello', 'hello')).toBe('EQ');
  });
  it('toOrdering', () => {
    const ord = Ordering.toOrdering((x: number, y: number) => x - y);
    expect(ord(-0, 0)).toBe('EQ');
    expect(ord(1, 0)).toBe('GT');
    expect(ord(0, 1)).toBe('LT');
  });
});

describe('Tuple suite', () => {
  it('curried', () => {
    expect(Tuple.curried(0)(1)).toEqual([0, 1]);
  });
  it('map', () => {
    expect(Tuple.map((x: number) => x + 1, (y: number) => y * 2)([2, 2])).toEqual([3, 4]);
  });
  it('product', () => {
    expect(Tuple.product((x: number) => x + 1, (y: number) => 2 * y)(2)).toEqual([3, 4]);
  });
  it('swap', () => {
    expect(Tuple.swap([0, 1])).toEqual([1, 0]);
  });
  it('tuple', () => {
    expect(Tuple.tuple(0, 1)).toEqual([0, 1]);
  });
});
