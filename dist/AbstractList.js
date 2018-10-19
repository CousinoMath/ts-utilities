"use strict";
/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = require("./Maybe");
const NonEmptyList_1 = require("./NonEmptyList");
const Objects_1 = require("./Objects");
/**
 * This is an abstract class which abstracts the basics of lists and
 * implements some of the more higher level operations.
 */
class AbstractList {
    constructor() {
        /**
         * This is never used in the abstract class. It is included
         * so that the Typescript compiler allows easier conversion
         * between the various lists.
         */
        this.arr = [];
    }
    /**
     * In Javascript, arrays cannot be length 2^32 or longer.
     * @summary Test whether a given length is valid for arrays.
     */
    static isSafeLength(n) {
        return Number.isInteger(n) && n >= 0 && Math.log2(n) < 32;
    }
    /**
     * @summary Returns true if and only if all elements are [truthy].
     */
    allTruthy() {
        return this.every(Boolean);
    }
    /**
     * `[x, ...xs].difference(ys)` returns
     * `xs.difference(ys_)` when `x` is "equal" to some element of `ys`
     * where `ys_` is `ys` with the first occurrance of `x` removed.
     * Otherwise, when `x` is "not equal" to any element of `ys`, the
     * call returns `[x, ...xs.difference(ys)]`.
     *
     * Here equality is [[SameValueZero]].
     * @summary Returns the "set" difference between two lists.
     * @param ys list of elements to remove from current list
     */
    difference(ys) {
        return this.differenceBy(Objects_1.sameValueZero, ys);
    }
    /**
     * This implementation short-circuits immediately upon seeing
     * the first false.
     * @summary Returns true if and only if `pred` is true on all elements.
     */
    every(pred) {
        for (const x of this) {
            if (!pred(x)) {
                return false;
            }
        }
        return true;
    }
    /**
     * @summary Returns the first value on which `pred` is true, and null otherwise.
     */
    find(pred) {
        for (const x of this) {
            if (pred(x)) {
                return x;
            }
        }
        return null;
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[groupBy]]
     */
    group() {
        return this.groupBy(Objects_1.sameValueZero);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the given value equals that of some element.
     * @see [[hasBy]] @see [[includes]] @see [[includesBy]]
     */
    has(elt) {
        return this.hasBy(Objects_1.sameValueZero, elt);
    }
    /**
     * @summary Returns true if and only if the given value equals that of some element.
     * @param eq test for equality
     */
    hasBy(eq, elt) {
        for (const x of this) {
            if (eq(x, elt)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the given value equals that of some element.
     * @see [[hasBy]] @see [[has]] @see [[includesBy]]
     */
    includes(elt) {
        return this.has(elt);
    }
    /**
     * @summary Returns true if and only if the given value equals that of some element.
     * @param eq test for equality
     * @see [[hasBy]] @see [[has]] @see [[includes]]
     */
    includesBy(eq, elt) {
        return this.hasBy(eq, elt);
    }
    /**
     * An element of `xs.intersectBy(eq, ys)` can repeat but
     * will only appear as many times it occurs in `xs` or
     * `ys`, whichever is smaller.
     *
     * Here equality is [[SameValueZero]]
     * @summary Returns the "set" intersection between the current list and the given list.
     * @see [[intersectBy]]
     */
    intersect(ys) {
        return this.intersectBy(Objects_1.sameValueZero, ys);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a "substring" of the given list.
     * @see [[isInfixOfBy]]
     */
    isInfixOf(larger) {
        return this.isInfixOfBy(Objects_1.sameValueZero, larger);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a prefix of the given list.
     * @see [[isPrefixOfBy]]
     */
    isPrefixOf(larger) {
        return this.isPrefixOfBy(Objects_1.sameValueZero, larger);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a subsequence of the given list.
     * @see [[isSubsequenceOfBy]]
     */
    isSubsequenceOf(larger) {
        return this.isSubsequenceOfBy(Objects_1.sameValueZero, larger);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a suffix of the given list.
     * @see [[isSuffixOfBy]]
     */
    isSuffixOf(larger) {
        return this.isSuffixOfBy(Objects_1.sameValueZero, larger);
    }
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_1, [y_1, y_2, ..., y_n]]`
     * where `[accum_n, y_n] = f(init, x_n)` and
     * `[accum_{n - 1}, y_{n - 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[mapAccum]]
     */
    mapAccumRight(f, init) {
        return this.reverse().mapAccum(f, init);
    }
    /**
     * @summary Returns the largest element of the current list, or null when empty.
     * @param ord ordering to use on the elements
     */
    max(ord) {
        const hd = this.head;
        const maxFn = (x, y) => (ord(x, y) === 'LT' ? y : x);
        const hdFn = (x) => this.tail.reduce(maxFn, x);
        return Maybe_1.bind(hdFn)(hd);
    }
    /**
     * @summary Returns the smallest element of the current list, or null when empty.
     * @param ord ordering to use on the elements
     */
    min(ord) {
        return this.max((y, x) => ord(x, y));
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
     * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
     * @summary Reduces the current list with `f` using the seed value `init`.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[accumulate]]
     */
    reduce(f, init) {
        let val = init;
        for (const x of this) {
            val = f(val, x);
        }
        return val;
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
     * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
     * @summary Reduces the current list with `f` using the seed value `init`.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[accumulateRight]]
     */
    reduceRight(f, init) {
        let val = init;
        for (const x of this.reverse()) {
            val = f(val, x);
        }
        return val;
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
     * where `y_n := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Reduces the current list with `f`, or returns null when empty.
     * @param f the function used to accumulate over the array
     * @see [[accumulateRightWith]]
     */
    reduceRightWith(f) {
        return this.reverse().reduceWith(f);
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Reduces the current list with `f`, or returns null when empty.
     * @param f the function used to accumulate over the array
     * @see [[accumulateWith]]
     */
    reduceWith(f) {
        return Maybe_1.bind(hd => this.tail.reduce(f, hd))(this.head);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a copy of the current list with the first occurence of the given value removed.
     * @see [[removeBy]]
     */
    remove(elt) {
        return this.removeBy(Objects_1.sameValueZero, elt);
    }
    /**
     * This implementation short-circuits upon encountering the first true.
     * @summary Returns true if and only if `pred` is true on some element of the current list.
     */
    some(pred) {
        for (const x of this) {
            if (pred(x)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @summary Returns true if and only if some element is [truthy].
     */
    someTruthy() {
        return this.some(Boolean);
    }
    /**
     * @summary Converts to a standard Array.
     */
    toArray() {
        return [...this];
    }
    /**
     * @summary Converts to a non-empty list, if possible, and null otherwise.
     */
    toNonEmptyList() {
        const fn = (hd) => new NonEmptyList_1.NonEmptyList(hd, this.tail.toArray());
        return Maybe_1.bind(fn)(this.head);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a copy with duplicates removed.
     * @see [[uniquesBy]]
     */
    uniques() {
        return this.uniquesBy(Objects_1.sameValueZero);
    }
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     *
     * Here equality is [[SameValueZero]]
     * @summary Returns the "set" union between lists.
     * @see [[unionBy]]
     */
    union(ys) {
        return this.unionBy(Objects_1.sameValueZero, ys);
    }
    isSafeIndex(n) {
        return Number.isInteger(n) && n >= 0 && n < this.length;
    }
}
exports.AbstractList = AbstractList;
/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 * [truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
 */ 
//# sourceMappingURL=AbstractList.js.map