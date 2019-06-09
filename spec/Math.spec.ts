import {
  fractionPart,
  fromContinuedFraction,
  max,
  maxBy,
  min,
  minBy,
  numberOrd,
  product,
  sum,
  toContinuedFraction,
} from '../src';

describe('Math suite', () => {
  it('fractionPart', () => {
    expect(fractionPart(Math.SQRT2)).toBe(Math.SQRT2 - 1);
    expect(fractionPart(-Math.SQRT2)).toBe(-Math.SQRT2 + 1);
    expect(fractionPart(NaN)).toBeNaN();
    expect(fractionPart(Infinity)).toBeNaN();
    expect(fractionPart(-Infinity)).toBeNaN();
  });
  it('(from|to)ContinuedFraction', () => {
    const sqrt2Conv = (len: number) => fromContinuedFraction(toContinuedFraction(Math.SQRT2, len));
    expect(sqrt2Conv(0)).toBeNaN();
    expect(sqrt2Conv(1)).toBe(1);
    expect(sqrt2Conv(2)).toBe(3 / 2);
    expect(sqrt2Conv(3)).toBe(7 / 5);
    expect(sqrt2Conv(4)).toBe(17 / 12);
    expect(toContinuedFraction(NaN, 100)).toEqual([]);
    expect(toContinuedFraction(0, 1000)).toEqual([0]);
  });
  it('max', () => {
    expect(max(0, 1, -5, -1, 5, 2, -4, -2, 4, 3, -3)).toBe(5);
    expect(max(-Infinity, NaN, Infinity)).toBe(Infinity);
    expect(max()).toBe(-Infinity);
  });
  it('maxBy', () => {
    expect(maxBy(numberOrd, 0, 1, -5, -1, 5, 2, -4, -2, 4, 3, -3)).toBe(5);
    expect(maxBy(numberOrd, -Infinity, NaN, Infinity)).toBe(Infinity);
  });
  it('min', () => {
    expect(min(0, 1, -5, -1, 5, 2, -4, -2, 4, 3, -3)).toBe(-5);
    expect(min(-Infinity, NaN, Infinity)).toBe(-Infinity);
    expect(min()).toBe(+Infinity);
  });
  it('minBy', () => {
    expect(minBy(numberOrd, 0, 1, -5, -1, 5, 2, -4, -2, 4, 3, -3)).toBe(-5);
    // numberOrd always returns 'LT' or 'EQ' on NaNs
    expect(minBy(numberOrd, -Infinity, NaN, Infinity)).toBe(Infinity);
  });
  it('product', () => {
    expect(product(1, 2, 3, 4, 5)).toBe(120);
    expect(product(-0, 0, Infinity, -Infinity, NaN)).toBeNaN();
    expect(product()).toBe(1);
  });
  it('sum', () => {
    expect(sum(0, 1, 2, 3, 4, 5)).toBe(15);
    expect(sum(-0, 0, Infinity, -Infinity, NaN)).toBeNaN();
    expect(sum()).toBe(0);
  });
});
