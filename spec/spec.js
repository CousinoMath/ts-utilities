describe("Array suite", () => {
  var Arrays = require("../dist/Arrays");
  it("accumulate", () => {
    const arrIn = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    const arrOut = [1, 2, 4, 7, 12, 20, 33, 54, 88, 143];
    expect(
      Arrays.accumulate((accum, value) => accum + value, arrIn)
    ).toEqual(arrOut);
  });
  it("array inductive rule", () => {
    const arrIn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const arrOut = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
    const func = (elt, accum) =>
      accum.concat(elt + (accum.length > 0 ? accum[accum.length - 1] : 0));
    expect(Arrays.array([], func)(arrIn)).toEqual(arrOut);
    expect(Arrays.array(true, (elt, accum) => false)([])).toBe(true);
  });
  it("cumSum", () => {
    const arr = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    const csArr = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047];
    expect(Arrays.cumSum(arr)).toEqual(csArr);
  });
  it("find", () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(Arrays.find(arrIn, x => 0 < x && 3 * x < 1)).toBe(1 / 5);
    expect(Arrays.find(arrIn, x => 0 < x && 10 * x < 1)).toBeNull();
  });
  it("findIndex", () => {
    const arrIn = [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7];
    expect(Arrays.findIndex(arrIn, x => 0 < x && 3 * x < 1)).toBe(4);
    expect(Arrays.findIndex(arrIn, x => 0 < x && 10 * x < 1)).toBe(-1);
  });
  it("flatMap", () => {
    const arrIn = ["It's always sunny", "in Philadelphia"];
    const arrOut = ["It's", "always", "sunny", "in", "Philadelphia"];
    expect(Arrays.flatMap(x => x.split(" "), arrIn)).toEqual(arrOut);
  });
  it("flatten", () => {
    const arrIn = [[1, 1 / 2, 1 / 3], [1 / 2, 1 / 3], [1 / 3], []];
    const arrOut = [1, 1 / 2, 1 / 3, 1 / 2, 1 / 3, 1 / 3];
    expect(Arrays.flatten(arrIn)).toEqual(arrOut);
  });
  it("from", () => {
    const arrOut = [1, 1, 4, 27, 256];
    expect(Arrays.from(5, x => Math.pow(x, x))).toEqual(arrOut);
  });
  it("range", () => {
    expect(Arrays.range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(Arrays.range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(Arrays.range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
    expect(Arrays.range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
    expect(Arrays.range(1, 10, 0)).toEqual([]);
    expect(Arrays.range(1, 10, -1)).toEqual([]);
  });
  it("reduce", () => {
    const arrIn = [1, -2, 3, -4, 5, -6, 7, -8, 9, -10];
    const func = (accum, value) =>
      accum.concat(value + (accum.length == 0 ? 0 : accum[accum.length - 1]));
    const arrOut = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    expect(Arrays.reduce(arrIn, func, [])).toEqual(arrOut);
  });
  it("sortOn", () => {
    const arr = [-5, 4, -3, 2, -1, 1, -2, 3, -4, 5];
    const numOrd = (x, y) => x < y ? 'LT' : x > y ? 'GT' : 'EQ';
    const cmp1 = (x, y) => numOrd(x * x, y * y);
    const cmp2 = (x, y) => cmp1(y, x);
    expect(Arrays.sortBy(numOrd, arr)).toEqual([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    expect(Arrays.sortBy(cmp1, arr)).toEqual([-1, 1, 2, -2, -3, 3, 4, -4, -5, 5]);
    expect(Arrays.sortBy(cmp2, arr)).toEqual([-5, 5, 4, -4, -3, 3, 2, -2, -1, 1]);
  });
  it("uniqueBy", () => {
    const arr = ["1", "1", "21", "12", "123", "132", "213", "231", "312", "321"];
    const cmp1 = (x, y) => x === y;
    const strReverse = x => x.split('').reverse().join('');
    const cmp2 = (x, y) => x === y || x === strReverse(y);
    const cmp3 = (x, y) => y.startsWith(x);
    expect(Arrays.uniqueBy(cmp1, arr)).toEqual(["1", "21", "12", "123", "132", "213", "231", "312", "321"]);
    expect(Arrays.uniqueBy(cmp2, arr)).toEqual(["1", "21", "123", "132", "213"]);
    expect(Arrays.uniqueBy(cmp3, arr)).toEqual(["1", "21", "231", "312", "321"]);

  })
});

describe("Either suite", () => {
  var Either = require("../dist/Either");
  it("either", () => {
    const eitherFn = Either.either(
      x => x.toLocaleUpperCase(),
      y => Number(y).toString()
    );
    expect(eitherFn(Either.left("hello"))).toBe("HELLO");
    expect(eitherFn(Either.right(7))).toBe("7");
  });
  it("isLeft/isRight", () => {
    expect(Either.isLeft(Either.left(0))).toBe(true);
    expect(Either.isLeft(Either.right(0))).toBe(false);
    expect(Either.isRight(Either.left(0))).toBe(false);
    expect(Either.isRight(Either.right(0))).toBe(true);
  });
  it("toPartition", () => {
    expect(Either.partition([Either.left("string")])).toEqual([["string"], []]);
    expect(Either.partition([Either.right(0)])).toEqual([[], [0]]);
  });
  it("lift", () => {
    const eitherFn = Either.lift(x => x.toLocaleUpperCase(), y => y + 1);
    expect(eitherFn(Either.left("string"))).toEqual(Either.left("STRING"));
    expect(eitherFn(Either.right(8))).toEqual(Either.right(9));
  });
  it("bindLeft/bindRight", () => {
    const leftFn = Either.bindLeft(
      x =>
        x.length === 0
          ? Either.left("empty string")
          : Either.right(x.toLocaleUpperCase())
    );
    const rightFn = Either.bindRight(
      x => (x === 0 ? Either.left("zero") : Either.right(x + 1))
    );
    expect(leftFn(Either.left(""))).toEqual(Either.left("empty string"));
    expect(leftFn(Either.left("hello"))).toEqual(Either.right("HELLO"));
    expect(leftFn(Either.right(0))).toEqual(Either.right(0));
    expect(rightFn(Either.left("string"))).toEqual(Either.left("string"));
    expect(rightFn(Either.right(0))).toEqual(Either.left("zero"));
    expect(rightFn(Either.right(1))).toEqual(Either.right(2));
  });
});

describe("Functions suite", () => {
  var Functions = require("../dist/Functions");
  it("ident", () => {
    expect(Functions.ident(0)).toBe(0);
    expect(Functions.ident(Functions.ident)("string")).toBe("string");
  });
  it("curry / uncurry", () => {
    const curriedFn = Functions.curry((xs, ys) => xs.concat(ys));
    const uncurriedFn = Functions.uncurry(curriedFn);
    expect(curriedFn("hello ")("string")).toBe("hello string");
    expect(uncurriedFn("hello ", "string")).toBe("hello string");
    expect(Functions.curry(uncurriedFn)("hello ")("string")).toBe(
      "hello string"
    );
  });
  it("constant", () => {
    expect(Functions.constant(0)("hello")).toBe(0);
  });
  it("flip", () => {
    const fn = x => y => x - y;
    expect(Functions.flip(fn)(0)(7)).toBe(fn(7)(0));
  });
  it("compose", () => {
    const plus5 = y => 5 + y;
    const times3 = y => 3 * y;
    expect(Functions.compose(times3, plus5)(1)).toBe(18);
    expect(Functions.compose(plus5, times3)(1)).toBe(8);
  });
  it("on", () => {
    const eq = (x, y) => x === y;
    const len = x => x.length;
    const eqLen = Functions.on(len, eq);
    expect(eqLen("hello", "holla")).toBe(true);
    expect(eqLen("hello", "bonjour")).toBe(false);
  });
});
