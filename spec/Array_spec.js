import * as ArrayUtil from "../dist/Array";

describe("Array suite", () => {
    it("array inductive rule", () => {
        expect(ArrayUtil.array([], (elt, accum) => accum.concat(elt + (accum.length > 0 ? accum[accum.length - 1] : 0)))([1,2,3,4,5,6,7,8,9,10])).toEqual([1,3,6,10,15,21,28,36,45,55]);
        expect(ArrayUtil.array(true, (elt, accum) => false)([]).toBe(true));
    });
    it("reduce", () => {

    });
    it("accumulate", () => {

    });
    it("cumSum", () => {

    });
    it("flatMap", () => {

    });
    it("flatten", () => {

    });
    it("from", () => {

    });
    it("range", () => {

    });
    it("find", () => {

    });
    it("findIndex", () => {

    });
});
