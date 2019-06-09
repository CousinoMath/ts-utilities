import { compose, constant, curry, flip, identity, on, uncurry } from '../src';

describe('Functions suite', () => {
  it('identity', () => {
    expect(identity(0)).toBe(0);
    expect(identity(identity)('string')).toBe('string');
  });
  it('curry|uncurry', () => {
    const curriedFn = curry<string, string, string>((xs, ys) => xs.concat(ys));
    const uncurriedFn = uncurry(curriedFn);
    expect(curriedFn('hello ')('string')).toBe('hello string');
    expect(uncurriedFn('hello ', 'string')).toBe('hello string');
    expect(curry(uncurriedFn)('hello ')('string')).toBe('hello string');
  });
  it('constant', () => {
    expect(constant(0)('hello')).toBe(0);
  });
  it('flip', () => {
    const fn = (x: number, y: number) => x - y;
    expect(flip(fn)(0, 7)).toBe(fn(7, 0));
  });
  it('compose', () => {
    const plus5 = (y: number) => 5 + y;
    const times3 = (y: number) => 3 * y;
    expect(
      compose(
        times3,
        plus5,
      )(1),
    ).toBe(18);
    expect(
      compose(
        plus5,
        times3,
      )(1),
    ).toBe(8);
  });
  it('on', () => {
    const eq = (x: number, y: number) => x === y;
    const len = (x: string) => x.length;
    const eqLen = on(len, eq);
    expect(eqLen('hello', 'holla')).toBe(true);
    expect(eqLen('hello', 'bonjour')).toBe(false);
  });
});
