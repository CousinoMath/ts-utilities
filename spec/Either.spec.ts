import {
  bindLeft,
  bindRight,
  Either,
  either,
  isLeft,
  isRight,
  left,
  leftDefault,
  lefts,
  liftEither,
  partition,
  right,
  rightDefault,
  rights,
} from '../src';

describe('Either suite', () => {
  it('bind(Left|Right)', () => {
    const leftFn = bindLeft<string, string, string>((x) =>
      x.length === 0 ? left('empty string') : right(x.toLocaleUpperCase()),
    );
    const rightFn = bindRight<string, number, number>((x) =>
      x === 0 ? left('zero') : right(x + 1),
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
      (x) => x.toLocaleUpperCase(),
      (y) => Number(y).toString(),
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
      (x) => x.toLocaleUpperCase(),
      (y) => y + 1,
    );
    expect(eitherFn(left('string'))).toEqual(left<string, number>('STRING'));
    expect(eitherFn(right(8))).toEqual(right<string, number>(9));
  });
  it('partition|lefts|rights', () => {
    const strs = [
      'you\'ve',
      'got',
      'a',
      'fine',
      'army',
      'base',
      'here',
      'colonel',
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
