"use strict";
/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Functions_1 = require("./Functions");
var Maybe_1 = require("./Maybe");
var NonEmptyList_1 = require("./NonEmptyList");
var Objects_1 = require("./Objects");
/**
 * This is an abstract class which abstracts the basics of lists and
 * implements some of the more higher level operations.
 */
var AbstractList = /** @class */ (function () {
    function AbstractList() {
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
    AbstractList.isSafeLength = function (n) {
        return Number.isInteger(n) && n >= -0 && Math.log2(n) < 32;
    };
    /**
     * @summary Returns true if and only if all elements are [truthy].
     */
    AbstractList.prototype.allTruthy = function () {
        return this.every(Boolean);
    };
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
    AbstractList.prototype.difference = function (ys) {
        return this.differenceBy(Objects_1.sameValueZero, ys);
    };
    /**
     * This implementation short-circuits immediately upon seeing
     * the first false.
     * @summary Returns true if and only if `pred` is true on all elements.
     */
    AbstractList.prototype.every = function (pred) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (!pred(x)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @summary Returns the first value on which `pred` is true, and null otherwise.
     */
    AbstractList.prototype.find = function (pred) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (pred(x)) {
                return x;
            }
        }
        return null;
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[groupBy]]
     */
    AbstractList.prototype.group = function () {
        return this.groupBy(Objects_1.sameValueZero);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the given value equals that of some element.
     * @see [[hasBy]] @see [[includes]] @see [[includesBy]]
     */
    AbstractList.prototype.has = function (elt) {
        return this.hasBy(Objects_1.sameValueZero, elt);
    };
    /**
     * @summary Returns true if and only if the given value equals that of some element.
     * @param eq test for equality
     */
    AbstractList.prototype.hasBy = function (eq, elt) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (eq(x, elt)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the given value equals that of some element.
     * @see [[hasBy]] @see [[has]] @see [[includesBy]]
     */
    AbstractList.prototype.includes = function (elt) {
        return this.has(elt);
    };
    /**
     * @summary Returns true if and only if the given value equals that of some element.
     * @param eq test for equality
     * @see [[hasBy]] @see [[has]] @see [[includes]]
     */
    AbstractList.prototype.includesBy = function (eq, elt) {
        return this.hasBy(eq, elt);
    };
    /**
     * An element of `xs.intersectBy(eq, ys)` can repeat but
     * will only appear as many times it occurs in `xs` or
     * `ys`, whichever is smaller.
     *
     * Here equality is [[SameValueZero]]
     * @summary Returns the "set" intersection between the current list and the given list.
     * @see [[intersectBy]]
     */
    AbstractList.prototype.intersect = function (ys) {
        return this.intersectBy(Objects_1.sameValueZero, ys);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a "substring" of the given list.
     * @see [[isInfixOfBy]]
     */
    AbstractList.prototype.isInfixOf = function (larger) {
        return this.isInfixOfBy(Objects_1.sameValueZero, larger);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a prefix of the given list.
     * @see [[isPrefixOfBy]]
     */
    AbstractList.prototype.isPrefixOf = function (larger) {
        return this.isPrefixOfBy(Objects_1.sameValueZero, larger);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a subsequence of the given list.
     * @see [[isSubsequenceOfBy]]
     */
    AbstractList.prototype.isSubsequenceOf = function (larger) {
        return this.isSubsequenceOfBy(Objects_1.sameValueZero, larger);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns true if and only if the current list is a suffix of the given list.
     * @see [[isSuffixOfBy]]
     */
    AbstractList.prototype.isSuffixOf = function (larger) {
        return this.isSuffixOfBy(Objects_1.sameValueZero, larger);
    };
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_1, [y_1, y_2, ..., y_n]]`
     * where `[accum_n, y_n] = f(init, x_n)` and
     * `[accum_{n - 1}, y_{n - 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[mapAccum]]
     */
    AbstractList.prototype.mapAccumRight = function (f, init) {
        return this.reverse().mapAccum(f, init);
    };
    /**
     * @summary Returns the largest element of the current list, or null when empty.
     * @param ord ordering to use on the elements
     */
    AbstractList.prototype.max = function (ord) {
        var _this = this;
        var hd = this.head;
        var maxFn = function (x, y) { return (ord(x, y) === 'LT' ? y : x); };
        var hdFn = function (x) { return _this.tail.reduce(maxFn, x); };
        return Maybe_1.bind(hdFn)(hd);
    };
    /**
     * @summary Returns the smallest element of the current list, or null when empty.
     * @param ord ordering to use on the elements
     */
    AbstractList.prototype.min = function (ord) {
        return this.max(Functions_1.flip(ord));
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
     * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
     * @summary Reduces the current list with `f` using the seed value `init`.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[accumulate]]
     */
    AbstractList.prototype.reduce = function (f, init) {
        var val = init;
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            val = f(val, x);
        }
        return val;
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
     * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
     * @summary Reduces the current list with `f` using the seed value `init`.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[accumulateRight]]
     */
    AbstractList.prototype.reduceRight = function (f, init) {
        var val = init;
        for (var _i = 0, _a = this.reverse(); _i < _a.length; _i++) {
            var x = _a[_i];
            val = f(val, x);
        }
        return val;
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
     * where `y_n := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Reduces the current list with `f`, or returns null when empty.
     * @param f the function used to accumulate over the array
     * @see [[accumulateRightWith]]
     */
    AbstractList.prototype.reduceRightWith = function (f) {
        return this.reverse().reduceWith(f);
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Reduces the current list with `f`, or returns null when empty.
     * @param f the function used to accumulate over the array
     * @see [[accumulateWith]]
     */
    AbstractList.prototype.reduceWith = function (f) {
        var _this = this;
        return Maybe_1.bind(function (hd) { return _this.tail.reduce(f, hd); })(this.head);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a copy of the current list with the first occurence of the given value removed.
     * @see [[removeBy]]
     */
    AbstractList.prototype.remove = function (elt) {
        return this.removeBy(Objects_1.sameValueZero, elt);
    };
    /**
     * This implementation short-circuits upon encountering the first true.
     * @summary Returns true if and only if `pred` is true on some element of the current list.
     */
    AbstractList.prototype.some = function (pred) {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var x = _a[_i];
            if (pred(x)) {
                return true;
            }
        }
        return false;
    };
    /**
     * @summary Returns true if and only if some element is [truthy].
     */
    AbstractList.prototype.someTruthy = function () {
        return this.some(Boolean);
    };
    /**
     * @summary Converts to a standard Array.
     */
    AbstractList.prototype.toArray = function () {
        return this.slice();
    };
    /**
     * @summary Converts to a non-empty list, if possible, and null otherwise.
     */
    AbstractList.prototype.toNonEmptyList = function () {
        var _this = this;
        var fn = function (hd) {
            return new NonEmptyList_1.NonEmptyList(hd, _this.tail.toArray());
        };
        return Maybe_1.bind(fn)(this.head);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a copy with duplicates removed.
     * @see [[uniquesBy]]
     */
    AbstractList.prototype.uniques = function () {
        return this.uniquesBy(Objects_1.sameValueZero);
    };
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     *
     * Here equality is [[SameValueZero]]
     * @summary Returns the "set" union between lists.
     * @see [[unionBy]]
     */
    AbstractList.prototype.union = function (ys) {
        return this.unionBy(Objects_1.sameValueZero, ys);
    };
    AbstractList.prototype.isSafeIndex = function (n) {
        return Number.isInteger(n) && n >= -0 && n < this.length;
    };
    return AbstractList;
}());
exports.AbstractList = AbstractList;
/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 * [truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
 */
//# sourceMappingURL=AbstractList.js.map