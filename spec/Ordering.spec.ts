import { dateOrd, numberOrd, preorder, stringOrd, toOrdering } from '../src';

describe('Ordering suite', () => {
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
    expect(numberOrd(0, NaN)).toBe('LT');
    expect(numberOrd(-0, 0)).toBe('EQ');
    expect(numberOrd(0, 1)).toBe('LT');
    expect(numberOrd(1, 0)).toBe('GT');
    expect(numberOrd(1, 1)).toBe('EQ');
    expect(numberOrd(0, Infinity)).toBe('LT');
    expect(numberOrd(Infinity, -Infinity)).toBe('GT');
    expect(numberOrd(-Infinity, Infinity)).toBe('LT');
    expect(numberOrd(Infinity, Infinity)).toBe('EQ');
    expect(numberOrd(-Infinity, -Infinity)).toBe('EQ');
  });
  it('preorder', () => {
    expect(
      preorder<string, number>(x => x.length, numberOrd)('hello', 'hola')
    ).toBe('GT');
  });
  it('stringOrd', () => {
    expect(stringOrd('', 'hello')).toBe('LT');
    expect(stringOrd('hola', 'hello')).toBe('GT');
    expect(stringOrd('hello', 'hello')).toBe('EQ');
  });
  it('toOrdering', () => {
    const ord = toOrdering<number>((x, y) => x - y);
    expect(ord(-0, 0)).toBe('EQ');
    expect(ord(1, 0)).toBe('GT');
    expect(ord(0, 1)).toBe('LT');
  });
});
