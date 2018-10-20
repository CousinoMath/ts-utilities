"use strict";
/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Functions_1 = require("./Functions");
var List_1 = require("./List");
/**
 * A specialized list subclass that encodes "non-emptiness" into
 * the type system. This has been designed to interoperate
 * simply with the List superclass.
 */
var NonEmptyList = /** @class */ (function (_super) {
    __extends(NonEmptyList, _super);
    function NonEmptyList(hd, tl) {
        return _super.call(this, [hd].concat(tl)) || this;
    }
    /**
     * A convenience to build instances from arrays, which
     * should obviously be non-empty.
     */
    NonEmptyList._make = function (arr) {
        return new NonEmptyList(arr[0], arr.slice(1));
    };
    Object.defineProperty(NonEmptyList.prototype, "head", {
        /**
         * @summary Returns the first element of the list.
         * @see [[tail]]
         * @see [[List.head]]
         */
        get: function () {
            return _super.prototype.arr[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NonEmptyList.prototype, "isEmpty", {
        /**
         * @summary Returns false.
         * @throws Error just in case this is not empty.
         * @see [[List.isEmpty]]
         */
        get: function () {
            if (_super.prototype.length === 0) {
                throw new Error('A non-empty list was found to be empty');
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NonEmptyList.prototype, "last", {
        /**
         * @summary Returns the last element of the list.
         * @see [[List.last]]
         */
        get: function () {
            return _super.prototype.arr[_super.prototype.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduce]]
     * @see [[List.accumulate]]
     */
    NonEmptyList.prototype.accumulate = function (f, init) {
        return NonEmptyList._make(_super.prototype.accumulate.call(this, f, init).toArray());
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulateRight(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a right reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduceRight]]
     * @see [[List.accumulateRight]]
     */
    NonEmptyList.prototype.accumulateRight = function (f, init) {
        return NonEmptyList._make(_super.prototype.accumulateRight.call(this, f, init).toArray());
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Returns a collection of running "total" from a right reduction.
     * @see [[reduceRightWith]]
     * @see [[List.accumulateRightWith]]
     * @param f the function used to accumulate over the array
     */
    NonEmptyList.prototype.accumulateRightWith = function (f) {
        return NonEmptyList._make(_super.prototype.accumulateRightWith.call(this, f).toArray());
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Returns a collection of running "total" from a reduction.
     * @see [[reduceWith]]
     * @see [[List.accumulateWith]]
     * @param f the function used to accumulate over the array
     */
    NonEmptyList.prototype.accumulateWith = function (f) {
        return NonEmptyList._make(_super.prototype.accumulateWith.call(this, f).toArray());
    };
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[groupBy]]
     * @see [[List.group]]
     */
    NonEmptyList.prototype.group = function () {
        return NonEmptyList._make(_super.prototype.group.call(this).toArray());
    };
    /**
     * `xs.groupBy(eq) = [ys_1, ys_2, ..., ys_n]` where each
     * ys_k is the largest sublist of `xs` whose elements are
     * "equal" by `eq`. This means, for example, that if `y_1`
     * is in `ys_1` and `y_2` is in `ys_2`, then `eq(y_1, y_2)`
     * is false.
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[List.groupBy]]
     */
    NonEmptyList.prototype.groupBy = function (eq) {
        return NonEmptyList._make(_super.prototype.groupBy.call(this, eq).toArray());
    };
    /**
     * @summary Returns a list of all prefixes of the current list.
     * @see [[List.inits]]
     */
    NonEmptyList.prototype.inits = function () {
        return NonEmptyList._make(_super.prototype.inits.call(this).toArray());
    };
    /**
     * `[x_1, x_2, ..., x_n].intersperse(elt) = [x_1, elt, x_2, elt, ..., elt, x_n]`
     * `[x_1].intersperse(elt) = [x_1]`
     * @summary Returns a copy of the current list with `x` interspersed between the element.
     * @see [[List.intersperse]]
     */
    NonEmptyList.prototype.intersperse = function (x) {
        return NonEmptyList._make(_super.prototype.intersperse.call(this, x).toArray());
    };
    /**
     * @summary Returns a new list which is built by mapping `f` across the current list.
     * @see [[List.map]]
     */
    NonEmptyList.prototype.map = function (f) {
        return NonEmptyList._make(_super.prototype.map.call(this, f).toArray());
    };
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_n, [y_1, y_2, ..., y_n]]`
     * where `[accum_1, y_1] = f(init, x_1)` and
     * `[accum_{n + 1}, y_{n + 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[List.mapAccum]]
     */
    NonEmptyList.prototype.mapAccum = function (f, init) {
        var _a = _super.prototype.mapAccum.call(this, f, init), val = _a[0], xs = _a[1];
        return [val, NonEmptyList._make(xs.toArray())];
    };
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_1, [y_1, y_2, ..., y_n]]`
     * where `[accum_n, y_n] = f(init, x_n)` and
     * `[accum_{n - 1}, y_{n - 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[mapAccum]]
     * @see [[List.mapAccumRight]]
     */
    NonEmptyList.prototype.mapAccumRight = function (f, init) {
        var _a = _super.prototype.mapAccumRight.call(this, f, init), val = _a[0], xs = _a[1];
        return [val, NonEmptyList._make(xs.toArray())];
    };
    /**
     * @summary Returns the largest element of the current list.
     * @param ord ordering to use on the elements
     * @see [[AbstractList.max]]
     */
    NonEmptyList.prototype.max = function (ord) {
        var maxFn = function (x, y) { return (ord(x, y) === 'LT' ? y : x); };
        return this.tail.reduce(maxFn, this.head);
    };
    /**
     * @summary Returns the smallest element of the current list.
     * @param ord ordering to use on the elements
     * @see [[AbstractList.min]]
     */
    NonEmptyList.prototype.min = function (ord) {
        return this.max(Functions_1.flip(ord));
    };
    /**
     * @summary Returns a collection of all permutations of the current list.
     * @see [[List.permutations]]
     */
    NonEmptyList.prototype.permutations = function () {
        return NonEmptyList._make(_super.prototype.permutations.call(this).toArray());
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
     * where `y_n := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Reduces the current list with `f`
     * @param f the function used to accumulate over the array
     * @see [[accumulateRightWith]]
     * @see [[AbstractList.reduceRightWith]]
     */
    NonEmptyList.prototype.reduceRightWith = function (f) {
        return this.reverse().reduceWith(f);
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Reduces the current list with `f`
     * @param f the function used to accumulate over the array
     * @see [[accumulateWith]]
     * @see [[AbstractList.reduceWith]]
     */
    NonEmptyList.prototype.reduceWith = function (f) {
        return _super.prototype.arr.slice(1).reduce(f, this.head);
    };
    /**
     * @summary Returns a copy of the current list with the element at the given index replaced.
     * @param n index of the element to replace
     * @param elt value used to replace the removed element
     * @see [[List.replace]]
     */
    NonEmptyList.prototype.replace = function (n, elt) {
        return NonEmptyList._make(_super.prototype.replace.call(this, n, elt).toArray());
    };
    /**
     * @summary Returns a copy of the current list with elements reverse.
     * @see [[List.reverse]]
     */
    NonEmptyList.prototype.reverse = function () {
        return NonEmptyList._make(_super.prototype.arr.slice(0).reverse());
    };
    /**
     * This should be a stable sort.
     * @summary Returns a sorted copy of the current list.
     * @param ord ordering to use for sorting
     * @see [[List.sortOn]]
     */
    NonEmptyList.prototype.sortOn = function (ord) {
        return NonEmptyList._make(_super.prototype.sortOn.call(this, ord).toArray());
    };
    /**
     * @summary Returns a list of all subsequences of the current list.
     * @throws RangeError if the number of subsequences exceeds the limit on array lengths.
     * @see [[List.subsequences]]
     */
    NonEmptyList.prototype.subsequences = function () {
        return NonEmptyList._make(_super.prototype.subsequences.call(this).toArray());
    };
    /**
     * @summary Returns a list of all suffixes of the current list.
     * @see [[List.tails]]
     */
    NonEmptyList.prototype.tails = function () {
        return NonEmptyList._make(_super.prototype.tails.call(this).toArray());
    };
    /**
     * @summary Converts any subclass to the base implementation.
     * @see [[List.toList]]
     */
    NonEmptyList.prototype.toList = function () {
        return new List_1.List(_super.prototype.arr);
    };
    /**
     * @summary Returns a copy of itself.
     * @see [[AbstractList.toNonEmptyList]]
     */
    NonEmptyList.prototype.toNonEmptyList = function () {
        return NonEmptyList._make(_super.prototype.arr);
    };
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a copy with duplicates removed.
     * @see [[uniquesBy]]
     * @see [[List.uniques]]
     */
    NonEmptyList.prototype.uniques = function () {
        return NonEmptyList._make(_super.prototype.uniques.call(this).toArray());
    };
    /**
     * @summary Returns a list of elements of the current list with duplicates removed.
     * @param eq test for equality between elements
     * @see [[List.uniquesBy]]
     */
    NonEmptyList.prototype.uniquesBy = function (eq) {
        return NonEmptyList._make(_super.prototype.uniquesBy.call(this, eq).toArray());
    };
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     *
     * Here equality is [SameValueZero]
     * @summary Returns the "set" union between lists.
     * @see [[unionBy]]
     * @see [[List.union]]
     */
    NonEmptyList.prototype.union = function (ys) {
        return NonEmptyList._make(_super.prototype.union.call(this, ys).toArray());
    };
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     * @summary Returns the "set" union between the current list and the given list.
     * @param eq test for equality between elements
     * @see [[List.unionBy]]
     */
    NonEmptyList.prototype.unionBy = function (eq, ys) {
        return NonEmptyList._make(_super.prototype.unionBy.call(this, eq, ys).toArray());
    };
    return NonEmptyList;
}(List_1.List));
exports.NonEmptyList = NonEmptyList;
/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 */
//# sourceMappingURL=NonEmptyList.js.map