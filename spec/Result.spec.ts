import { err, isErr, isOk, map, mapOr, mapOrElse, ok, unwrapErr, unwrapOk, unwrapOr } from '../src/Result';

describe("Result suite", () => {
  it("is(Ok|Err)", () => {
    expect(isOk(ok(1))).toEqual(true);
    expect(isOk(err("error"))).toEqual(false);
    expect(isErr(ok(1))).toEqual(false);
    expect(isErr(err("error"))).toEqual(true);
  });
  it("map*", () => {
    expect(map(ok(1), (x: number) => x + 1)).toEqual(ok(2));
    expect(map(err<number, string>("error"), (x: number) => x + 1)).toEqual(err("error"));
    expect(mapOr(ok<number, string>(1), (y: string) => y.length)).toEqual(1);
    expect(mapOr(err("error"), (y: string) => y.length)).toEqual(5);
    expect(mapOrElse(ok<number, string>(1), (x: number) => x + 1, (y: string) => y.length)).toEqual(2);
    expect(mapOrElse(err<number, string>("error"), (x: number) => x + 1, (y) => y.length)).toEqual(5);
  });
  it("unwrap*", () => {
    expect(unwrapOk(ok(1))).toEqual(1);
    expect(unwrapOk(err("error"))).toThrow();
    expect(unwrapErr(ok(1))).toThrow();
    expect(unwrapErr(err("error"))).toEqual("error");
    expect(unwrapOr(ok(1), 2)).toEqual(1);
    expect(unwrapOr(err("error"), 2)).toEqual(2);
  });
})