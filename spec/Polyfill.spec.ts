import {
  acosh,
  asinh,
  atanh,
  cosh,
  hypot,
  is,
  isInteger,
  log2,
  sign,
  sinh,
  tanh
} from '../src';

// tslint:disable no-null-keyword
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
  it('Math a?cosh', () => {
    expect(acosh(0.999999999)).toBeNaN();
    expect(acosh(1)).toBe(0);
    expect(cosh(0)).toBe(1);
    expect(cosh(acosh(2))).toBeCloseTo(2);
    expect(cosh(acosh(2.5))).toBeCloseTo(2.5);
  });
  it('Math a?sinh', () => {
    expect(asinh(0)).toBe(0);
    expect(sinh(0)).toBe(0);
    expect(sinh(asinh(2))).toBeCloseTo(2);
    expect(sinh(asinh(-2))).toBeCloseTo(-2);
  });
  it('Math a?tanh', () => {
    expect(atanh(0)).toBe(0);
    expect(tanh(0)).toBe(0);
    expect(tanh(atanh(0.5))).toBeCloseTo(0.5);
    expect(tanh(atanh(-0.5))).toBeCloseTo(-0.5);
    expect(atanh(1)).toBe(Infinity);
    expect(atanh(-1)).toBe(-Infinity);
    expect(atanh(1.1)).toBeNaN();
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
  it('Math hypot', () => {
    expect(hypot(3, 4)).toBe(5);
    expect(hypot(3, 4, 5)).toBe(5 * Math.SQRT2);
    expect(hypot()).toBe(0);
    expect(hypot(NaN)).toBeNaN();
    expect(hypot(-3)).toBe(3);
  });
});
