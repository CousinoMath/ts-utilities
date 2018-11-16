import { curried, mapTuple, swap, tuple, uniProduct } from '../src';

describe('Tuple suite', () => {
  it('curried', () => {
    expect(curried(0)(1)).toEqual([0, 1]);
  });
  it('map', () => {
    expect(
      mapTuple<number, number, number, number>(x => x + 1, y => y * 2)([2, 2])
    ).toEqual([3, 4]);
  });
  it('uniProduct', () => {
    expect(
      uniProduct<number, number, number>(x => x + 1, y => 2 * y)(2)
    ).toEqual([3, 4]);
  });
  it('swap', () => {
    expect(swap([0, 1])).toEqual([1, 0]);
  });
  it('tuple', () => {
    expect(tuple(0, 1)).toEqual([0, 1]);
  });
});
