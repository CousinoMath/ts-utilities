import { equals2, equals3, sameValueZero } from '../src';

// tslint:disable no-null-keyword
// tslint:disable triple-equals
// tslint:disable object-literal-key-quotes
describe('Objects suite', () => {
  it('equality', () => {
    const bools: boolean[] = [true, false];
    const nums: number[] = [1, 0, +0, -0, -1, Infinity, -Infinity, NaN];
    const strs: string[] = ['1', '0', '+0', '-0', '-1', ''];
    const nils: any[] = [null /* , undefined */];
    const arrs: any[] = [[], [[]], [0], [1]];
    const objs: any[] = [{}, { property: 0 }, { '0': 0 }];
    const elts: any[] = (bools as any[]).concat(nums, strs, nils, arrs, objs);
    const cross = elts.reduce<Array<[any, any]>>(
      (xs, x) => xs.concat(elts.map<[any, any]>((y) => [x, y])),
      [],
    );
    const eq2 = (x: any, y: any) => x == y;
    const eq2s = cross.map((xy) => eq2(...xy));
    const eq3 = (x: any, y: any) => x === y;
    const eq3s = cross.map((xy) => eq3(...xy));
    // const sv = (x: any, y: any) => Object.is(x, y);
    // const svs = cross.map(xy => sv(...xy));
    const svz = (x: any, y: any) =>
      Object.is(x, y) ||
      (typeof x === 'number' &&
        typeof y === 'number' &&
        Math.abs(x) === 0 &&
        Math.abs(y) === 0);
    const svzs = cross.map((xy) => svz(...xy));
    expect(cross.map((xy) => equals2(xy[0], xy[1]))).toEqual(eq2s);
    expect(equals2(undefined, null)).toBe(true);
    expect(equals2(false, undefined)).toBe(false);
    expect(equals2(undefined, undefined)).toBe(true);
    expect(cross.map((xy) => equals3(xy[0], xy[1]))).toEqual(eq3s);
    expect(equals3(undefined, null)).toBe(false);
    expect(equals3(undefined, undefined)).toBe(true);
    expect(cross.map((xy) => sameValueZero(xy[0], xy[1]))).toEqual(svzs);
    expect(sameValueZero(0, -0)).toBe(true);
    expect(sameValueZero(undefined, undefined)).toBe(true);
    expect(sameValueZero(undefined, null)).toBe(false);
  });
});
