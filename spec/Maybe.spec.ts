import {
  bindMaybe,
  bindToArray,
  bottom,
  concatMaybes,
  defaultTo,
  isNonNull,
  isNull,
  liftMaybe,
  makeMaybe,
  Maybe,
  maybe
} from '../src';

describe('Maybe suite', () => {
  it('bind', () => {
    const head: (xs: number[]) => Maybe<number> = xs =>
      xs.length === 0 ? bottom : xs[0];
    expect(bindMaybe(head)(bottom)).toBeUndefined();
    expect(bindMaybe(head)([])).toBeUndefined();
    expect(bindMaybe(head)([1, 2, 3, 4])).toBe(1);
  });
  it('bindTo(Array|Set|Map)', () => {
    const head: (x: string) => Maybe<string> = x =>
      x.length === 0 ? bottom : x[0];
    expect(bindToArray(head)([])).toEqual([]);
    expect(bindToArray(head)(['One', '', 'day'])).toEqual(['O', 'd']);
  });
  it('concatMaybes', () => {
    expect(concatMaybes([bottom, 1, bottom, 2, /* undefined, */ 3, bottom])).toEqual([
      1,
      2,
      3
    ]);
    expect(concatMaybes([])).toEqual([]);
    expect(concatMaybes([bottom, bottom, /* undefined, */ bottom])).toEqual([]);
  });
  it('defaultTo', () => {
    // expect(defaultTo(0, undefined)).toBe(0);
    expect(defaultTo<number>(0, bottom)).toBe(0);
    expect(defaultTo<number>(0, 1)).toBe(1);
  });
  it('is(Non)?Null', () => {
    // expect(isNull(undefined)).toBe(true);
    expect(isNull(bottom)).toBe(true);
    expect(isNull(0)).toBe(false);
    expect(isNonNull(undefined)).toBe(false);
    expect(isNonNull(bottom)).toBe(false);
    expect(isNonNull(0)).toBe(true);
  });
  it('lift', () => {
    // expect(liftMaybe<number[], number>(x => x.length)(undefined)).toBeUndefined();
    expect(liftMaybe<number[], number>(x => x.length)(bottom)).toBeUndefined();
    expect(liftMaybe<number[], number>(x => x.length)([])).toBe(0);
    expect(liftMaybe<number[], number>(x => x.length)([0])).toBe(1);
  });
  it('make', () => {
    expect(makeMaybe(true, () => 1)).toBe(1);
    expect(makeMaybe(false, () => 1)).toBeUndefined();
  });
  it('maybe', () => {
    // expect(maybe<number, number>(0, x => x * x + 1)(undefined)).toBe(0);
    expect(maybe<number, number>(0, x => x * x + 1)(bottom)).toBe(0);
    expect(maybe<number, number>(0, x => x * x + 1)(2)).toBe(5);
  });
});
