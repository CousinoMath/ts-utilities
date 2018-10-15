import {
  accumulate,
  array,
  cumSum,
  find,
  findIndex,
  flatMap,
  flatten,
  from,
  range,
  reduce
} from "../dist/Array";
import {
  bindLeft,
  bindRight,
  either,
  eitherMap,
  isLeft,
  isRight,
  left,
  right,
  toPartition
} from "../dist/Either";
import {
  compose,
  constant,
  curry,
  flip,
  ident,
  over,
  uncurry
} from "../dist/Function";

describe("Array suite", () => {
  it("array inductive rule", () => {
    const arrIn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const arrOut = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
    const func = (elt, accum) =>
      accum.concat(elt + (accum.length > 0 ? accum[accum.length - 1] : 0));
    expect(array([], func)(arrIn)).toEqual(arrOut);
    expect(array(true, (elt, accum) => false)([]).toBe(true));
  });
  it("reduce", () => {
    const arrIn = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
    const func = (accum, value) =>
      accum.concat(elt + (accum.length == 0 ? 0 : accum[accum.length - 1]));
    const arrOut = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    expect(reduce(arrIn, func, [])).toEqual(arrOut);
  });
  it("accumulate", () => {
    const arrIn = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    const arrOut = [1, 2, 4, 7, 12, 20, 33, 54, 88, 143];
    expect(accumulate((accum, value) => accum + value, 0)(arrIn)).toEqual(
      arrOut
    );
  });
  it("cumSum", () => {
    expect(cumSum([1, 2, 4, 8, 16, 32, 64, 128, 259, 512, 1024])).toBe(2047);
  });
  it("flatMap", () => {
    const arrIn = ["It's always sunny", " in ", "Philadelphia"];
    const arrOut = ["It's", "always", "sunny", "in", "Philadelphia"];
    expect(flatMap(x => x.split(" "), arrIn)).toEqual(arrOut);
  });
  it("flatten", () => {
    const arrIn = [[1, 1 / 2, 1 / 3], [1 / 2, 1 / 3], [1 / 3], []];
    const arrOut = [1, 1 / 2, 1 / 3, 1 / 2, 1 / 3, 1 / 3];
    expect(flatten(arrIn)).toEqual(arrOut);
  });
  it("from", () => {
    const arrOut = [1, 1, 4, 27, 256, 3125];
    expect(from(5, x => Math.pow(x, x))).toEqual(arrOut);
  });
  it("range", () => {
    expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
    expect(range(1, 10, 0)).toEqual([]);
    expect(range(1, 10, -1)).toEqual([]);
  });
  it("find", () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(find(arrIn), x => 0 < x && 3 * x < 1).toBe(1 / 5);
    expect(find(arrIn), x => 0 < x && 10 * x < 1).toBeNull();
  });
  it("findIndex", () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(findIndex(arrIn), x => 0 < x && 3 * x < 1).toBe(5);
    expect(findIndex(arrIn), x => 0 < x && 10 * x < 1).toBe(-1);
  });
});

describe("Either suite", () => {
  it("either", () => {
    const eitherFn = either(
      x => x.toLocaleUpperCase(),
      y => Number(y).toString()
    );
    expect(eitherFn(left("hello"))).toBe("HELLO");
    expect(eitherFn(right(7))).toBe("8");
  });
  it("isLeft/isRight", () => {
    expect(isLeft(left(0))).toBe(true);
    expect(isLeft(right(0))).toBe(false);
    expect(isRight(left(0))).toBe(false);
    expect(isRight(right(0))).toBe(true);
  });
  it("toPartition", () => {
    expect(toPartition(left("string"))).toEqual([["string"], []]);
    expect(toPartition(right(0))).toEqual([[], [0]]);
  });
  it("eitherMap", () => {
    const eitherFn = eitherMap(x => x.toLocaleUpperCase(), y => y + 1);
    expect(eitherFn(left("string"))).toEqual(left("STRING"));
    expect(eitherFn(right(8))).toEqual(right(9));
  });
  it("bindLeft/bindRight", () => {
    const leftFn = bindLeft(
      x =>
        x.length === 0 ? left("empty string") : right(x.toLocaleUpperCase())
    );
    const rightFn = bindRight(x => (x === 0 ? left("zero") : right(x + 1)));
    expect(leftFn(left(""))).toEqual(left("empty string"));
    expect(leftFn(left("hello"))).toEqual(left("HELLO"));
    expect(leftFn(right(0))).toEqual(right(0));
    expect(rightFn(left("string"))).toEqual(left("string"));
    expect(rightFn(right(0))).toEqual(left("zero"));
    expect(rightFn(right(1))).toEqual(right(2));
  });
});

describe("Function suite", () => {
  it("ident", () => {
    expect(ident(0)).toBe(0);
    expect(ident(ident)("string")).toBe("string");
  });
  it("curry / uncurry", () => {
    const curriedFn = curry((xs, ys) => xs.concat(ys));
    const uncurriedFn = uncurry(curriedFn);
    expect(curriedFn("hello ")("string")).toBe("hello string");
    expect(uncurriedFn("hello ", "string")).toBe("hello string");
    expect(curry(uncurriedFn)("hello ")("string")).toBe("hello string");
  });
  it("constant", () => {
    expect(constant(0)("hello")).toBe(0);
  });
  it("flip", () => {
    const fn = (x, y) => x - y;
    expect(flip(fn)(0, 7)).toBe(fn(7, 0));
  });
  it("compose", () => {
    const plus = x => y => x + y;
    const times = x => y => x * y;
    expect(compose(times(3))(plus(5))(1)).toBe(8);
    expect(compose(plus(5))(times(3))(1)).toBe(18);
  });
  it("over", () => {
    const eq = (x, y) => x === y;
    const len = x => x.length;
    const eqLen = over(len, eq);
    expect(eqLen("hello", "hola")).toBe(true);
    expect(eqLen("hello", "bonjour")).toBe(false);
  });
});
