import { max, maxBy, min, minBy, numberOrd, product, sum } from '../src';

describe('Math suite', () => {
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
