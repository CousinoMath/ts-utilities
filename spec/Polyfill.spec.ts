import { is, isInteger, log2, sign } from '../src';

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
