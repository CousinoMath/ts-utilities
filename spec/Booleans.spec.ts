import { bool, ifThenElse } from '../src';

describe('Booleans suite', () => {
  it('bool inductive rule', () => {
    expect(bool(0, 1)(true)).toBe(0);
    expect(bool(0, 1)(false)).toBe(1);
  });
  it('if-then-else', () => {
    expect(ifThenElse(true, 0, 1)).toBe(0);
    expect(ifThenElse(false, 0, 1)).toBe(1);
  });
});
