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
var AbstractList_1 = require("./AbstractList");
var Functions_1 = require("./Functions");
var Maybe_1 = require("./Maybe");
var NonEmptyList_1 = require("./NonEmptyList");
var Objects_1 = require("./Objects");
/**
 * Basic array-backed list class
 */
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(arr) {
        var _this = _super.call(this) || this;
        /**
         * The array behind this implementation.
         */
        _this.arr = [];
        _this.arr = arr;
        return _this;
    }
    /**
     * @summary Joins a list of booleans together with `&&`, respecting short-circuiting.
     * @see [[or]]
     */
    List.and = function (xs) {
        return xs.every(Functions_1.ident);
    };
    /**
     * @summary Concatenates a collection of lists.
     */
    List.concat = function (xss) {
        var arr = [];
        for (var _i = 0, xss_1 = xss; _i < xss_1.length; _i++) {
            var xs = xss_1[_i];
            arr.concat.apply(arr, xs.arr);
        }
        return new List(arr);
    };
    /**
     * @summary Concatenates elements of `items` interspersed with `sep`.
     * @see [[intersperse]]
     */
    List.itercalate = function (sep, items) {
        var len = items.length - 1;
        var arr = [];
        for (var i = 0; i < len; i++) {
            arr.concat.apply(arr, items.arr[i].arr.concat(sep.arr));
        }
        arr.concat.apply(arr, Maybe_1.maybe([], function (last) { return last.arr; })(items.last));
        return new List(arr);
    };
    /**
     * @summary Convenient list factory
     */
    List.make = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
        }
        return new List(arr);
    };
    /**
     * @summary Joins together a list of booleans with `||`, respects short-circuiting
     * @see [[and]]
     */
    List.or = function (xs) {
        return xs.some(Functions_1.ident);
    };
    /**
     * Returns `[start, start + step, ..., start + n * step]`
     * where `n = Math.floor((stop - start) / step)`. So
     * `start + n * step <= stop < start + (n + 1) * step`.
     * @summary Returns an arithmetic sequence of numbers
     * @param start starting value
     * @param stop value to not exceed
     * @param step change between elements, cannot be 0
     * @throws RangeError if creating an array of invalid length (e.g. step = 0)
     */
    List.range = function (start, stop, step) {
        if (start === void 0) { start = 0; }
        if (step === void 0) { step = 1; }
        if (typeof stop === 'undefined') {
            stop = start - 1;
            start = 0;
        }
        var spread = stop - start;
        var len = Math.abs(step) === 0
            ? -1
            : Math.floor((spread + Math.sign(spread)) / step);
        if (!AbstractList_1.AbstractList.isSafeLength(len)) {
            throw new RangeError('Invalid list length encountered in call to List.range');
        }
        // Array constructor is -0 safe
        var arr = new Array(len);
        for (var i = 0; i < len; i++) {
            arr.push(start + i * step);
        }
        return new List(arr);
    };
    /**
     * @summary Returns a list of given length populated with the given value.
     */
    List.repeat = function (n, elt) {
        if (!AbstractList_1.AbstractList.isSafeLength(n)) {
            throw new RangeError('Invalid list length encountered in a call to List.repeat');
        }
        // Array constructor is -0 safe
        return new List(new Array(n).fill(elt));
    };
    /**
     * @summary Unzips a list of tuples into a tuple of lists.
     * @see [[zip]]
     */
    List.unzip = function (xys) {
        var len = xys.length;
        var arrA = new Array(len);
        var arrB = new Array(len);
        for (var i = 0; i < len; i++) {
            var xy = xys.arr[i];
            arrA.push(xy[0]);
            arrB.push(xy[1]);
        }
        return [new List(arrA), new List(arrB)];
    };
    /**
     * The returned list is as long as the shortest list.
     * @summary Zips a pair of lists into a list of tuples.
     * @see [[unzip]]
     */
    List.zip = function (xs, ys) {
        var arr = [];
        var len = Math.min(xs.length, ys.length);
        for (var i = 0; i < len; i++) {
            arr.push([xs.arr[i], ys.arr[i]]);
        }
        return new List(arr);
    };
    /**
     * `List.zipWith(f, xs, ys) = List.zip(xs, ys).map(xy => f(...xy))`
     * @summary Zips a pair of lists using a custom zipper.
     */
    List.zipWith = function (f, xs, ys) {
        var arr = [];
        var len = Math.min(xs.length, ys.length);
        for (var i = 0; i < len; i++) {
            arr.push(f(xs.arr[i], ys.arr[i]));
        }
        return new List(arr);
    };
    Object.defineProperty(List.prototype, "head", {
        /**
         * @summary Returns the first element of the list, if it exists, and null otherwise.
         * @see [[AbstractList.head]]
         * @see [[tail]]
         */
        get: function () {
            return this.isEmpty ? null : this.arr[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "isEmpty", {
        /**
         * @summary Returns true if and only if the list is empty.
         * @see [[AbstractList.isEmpty]]
         */
        get: function () {
            return this.arr.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "init", {
        /**
         * @summary Returns a copy of the list with the last element removed.
         * @see [[AbstractList.init]]
         */
        get: function () {
            return new List(this.arr.slice(0, this.length - 1));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "last", {
        /**
         * @summary Returns the last element of the list, if it exists, and null otherwise.
         * @see [[AbstractList.last]]
         */
        get: function () {
            return this.isEmpty ? null : this.arr[this.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "length", {
        /**
         * @summary Returns the number of elements in the list, its length or size.
         * @see [[size]]
         * @see [[AbstractList.length]]
         */
        get: function () {
            return this.arr.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "size", {
        /**
         * @summary Returns the number of elements in the list, its length or size.
         * @see [[length]]
         * @see [[AbstractList.size]]
         */
        get: function () {
            return this.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "tail", {
        /**
         * @summary Returns a copy of the list with the first element removed.
         * @see [[init]]
         * @see [[AbstractList.tail]]
         */
        get: function () {
            return new List(this.arr.slice(1));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Allows lists to be iterated over in `for of` loops and spread/rest
     * syntax.
     */
    List.prototype[Symbol.iterator] = function () {
        var arr = this.arr.slice(0);
        return arr[Symbol.iterator]();
    };
    /**
     * Always converts to an array.
     */
    List.prototype[Symbol.toPrimitive] = function (hint) {
        return this.arr.slice(0);
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduce]]
     * @see [[AbstractList.accumulate]]
     */
    List.prototype.accumulate = function (f, init) {
        var arr = [init];
        var val = init;
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var x = _a[_i];
            val = f(val, x);
            arr.push(val);
        }
        return new List(arr);
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulateRight(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a right reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduceRight]]
     * @see [[AbstractList.accumulateRight]]
     */
    List.prototype.accumulateRight = function (f, init) {
        var val = init;
        var arr = [init];
        for (var _i = 0, _a = this.reverse(); _i < _a.length; _i++) {
            var x = _a[_i];
            val = f(val, x);
            arr.push(val);
        }
        return new List(arr);
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Returns a collection of running "total" from a right reduction.
     * @param f the function used to accumulate over the array
     * @see [[reduceRightWith]]
     * @see [[AbstractList.accumulateRightWith]]
     */
    List.prototype.accumulateRightWith = function (f) {
        return this.reverse().accumulateWith(f);
    };
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Returns a collection of running "total" from a reduction.
     * @param f the function used to accumulate over the array
     * @see [[reduceWith]]
     * @see [[AbstractList.accumulateWith]]
     */
    List.prototype.accumulateWith = function (f) {
        var arr = [];
        if (this.arr.length > 0) {
            var val = this.arr[0];
            arr.push(val);
            for (var _i = 0, _a = this.arr.slice(1); _i < _a.length; _i++) {
                var x = _a[_i];
                val = f(val, x);
                arr.push(val);
            }
        }
        return new List(arr);
    };
    /**
     * @summary Returns a copy of the list with an the given element appended to the end.
     * @see [[AbstractList.append]]
     */
    List.prototype.append = function (elt) {
        var tl = this.arr.slice(0);
        tl.push(elt);
        var hd = tl[0];
        tl.shift();
        return new NonEmptyList_1.NonEmptyList(hd, tl);
    };
    /**
     * @summary Returns a copy of the list with the element at the given index removed.
     * @param n index of element to be removed
     * @see [[AbstractList.delete]]
     */
    List.prototype.delete = function (n) {
        var arr = this.arr.slice(0);
        if (this.isSafeIndex(n)) {
            // splice is -0 safe
            arr.splice(n, 1);
        }
        return new List(arr);
    };
    /**
     * `[x, ...xs].difference(ys)` returns
     * `xs.difference(ys_)` when `x` is "equal" to some element of `ys`
     * where `ys_` is `ys` with the first occurrance of `x` removed.
     * Otherwise, when `x` is "not equal" to any element of `ys`, the
     * call returns `[x, ...xs.difference(ys)]`.
     *
     * Here equality is [SameValueZero].
     * @summary Returns the "set" difference between two lists.
     * @param ys list of elements to remove from current list
     * @see [[differenceBy]]
     * @see [[AbstractList.difference]]
     */
    List.prototype.difference = function (ys) {
        return this.differenceBy(Objects_1.sameValueZero, ys);
    };
    /**
     * `[x, ...xs].difference(ys)` returns
     * `xs.difference(ys_)` when `x` is "equal" to some element of `ys`
     * where `ys_` is `ys` with the first occurrance of `x` removed.
     * Otherwise, when `x` is "not equal" to any element of `ys`, the
     * call returns `[x, ...xs.difference(ys)]`.
     *
     * Here equality is determined by [SameValueZero].
     * @summary Returns the "set" difference between two lists.
     * @param eq test for equality
     * @param ys list of elements to remove from current list
     * @see [[difference]]
     * @see [[AbstractList.differenceBy]]
     */
    List.prototype.differenceBy = function (eq, ys) {
        var arr = this.arr.slice(0);
        var len = this.length;
        var _loop_1 = function (i) {
            var idxm = ys.findIndex(function (y) { return eq(arr[i], y); });
            Maybe_1.bind(function (idx) {
                arr.splice(i, 1);
                ys.delete(idx);
            })(idxm);
        };
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
        return new List(arr);
    };
    /**
     * @summary Returns a copy of the list with the first `n` elements dropped.
     * @param n a nonnegative number of elements to be dropped
     * @see [[take]]
     * @see [[Abstract.drop]]
     */
    List.prototype.drop = function (n) {
        if (Number.isInteger(n)) {
            var lastIdx = this.length - 1;
            if (n >= -0) {
                // Handle -0 case
                n = Math.abs(n);
                if (n > lastIdx) {
                    return new List([]);
                }
                return new List(this.arr.slice(n, lastIdx));
            }
            else {
                var endIdx = lastIdx - n;
                if (endIdx < 0) {
                    return new List([]);
                }
                return new List(this.arr.slice(0, endIdx));
            }
        }
        return new List(this.arr.slice(0));
    };
    /**
     * @summary Returns a copy of the list with the longest suffix on which `pred` is true.
     * @see [[AbstractList.dropTailWhile]]
     */
    List.prototype.dropTailWhile = function (f) {
        var arr = this.arr.slice(0);
        var i = this.length - 1;
        while (i >= 0 && f(arr[i])) {
            arr.pop();
            i--;
        }
        return new List(arr);
    };
    /**
     * @summary Returns a copy of the list with the longest prefix on which `pred` is true.
     * @see [[takeWhile]]
     * @see [[AbstractList.dropWhile]]
     */
    List.prototype.dropWhile = function (f) {
        var arr = this.arr.slice(0);
        var len = this.length;
        var i = 0;
        while (i < len && f(arr[0])) {
            arr.shift();
            i++;
        }
        return new List(arr);
    };
    /**
     * @summary Returns a new list of all elements of the current list for which `pred` is true.
     * @see [[partition]]
     * @see [[AbstractList.filter]]
     */
    List.prototype.filter = function (f) {
        return new List(this.arr.filter(f));
    };
    /**
     * `[x_1, x_2, ..., x_n].findIndex(pred) = i` means that
     * `pred(x_i)` is true and `pred(x_k)` is false for every
     * `k < i`.
     *
     * `xs.findIndex(pred) = null` means that no element of
     * `xs` makes `pred` true.
     * @summary Returns the first index in the list whose corresponding element makes `pred` true.
     * @see [[AbstractList.findIndex]]
     */
    List.prototype.findIndex = function (f) {
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (f(this.arr[i])) {
                return i;
            }
        }
        return null;
    };
    /**
     * @summary Returns a list of all indices whose corresponding elements make `pred` true.
     * @see [[AbstractList.findIndices]]
     */
    List.prototype.findIndices = function (f) {
        var arr = [];
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (f(this.arr[i])) {
                arr.push(i);
            }
        }
        return new List(arr);
    };
    /**
     * @summary Returns a list formed by mapping `f` through the current list and concatenates the results.
     * @see [[AbstractList.flatMap]]
     */
    List.prototype.flatMap = function (f) {
        var arr = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var x = _a[_i];
            arr.concat.apply(arr, f(x).toArray());
        }
        return new List(arr);
    };
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[groupBy]]
     * @see [[AbstractList.group]]
     */
    List.prototype.group = function () {
        return this.groupBy(Objects_1.sameValueZero);
    };
    /**
     * `xs.groupBy(eq) = [ys_1, ys_2, ..., ys_n]` where each
     * ys_k is the largest sublist of `xs` whose elements are
     * "equal" by `eq`. This means, for example, that if `y_1`
     * is in `ys_1` and `y_2` is in `ys_2`, then `eq(y_1, y_2)`
     * is false.
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[AbstractList.groupBy]]
     */
    List.prototype.groupBy = function (eq) {
        var groups = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var elt = _a[_i];
            var grouped = false;
            for (var _b = 0, groups_1 = groups; _b < groups_1.length; _b++) {
                var group = groups_1[_b];
                var groupElt = group.arr[0];
                if (eq(groupElt, elt)) {
                    grouped = true;
                    group.append(elt);
                    break;
                }
            }
            if (!grouped) {
                groups.push(new NonEmptyList_1.NonEmptyList(elt, []));
            }
        }
        return new List(groups);
    };
    /**
     * @summary Returns a list of all prefixes of the current list.
     * @see [[tails]]
     * @see [[AbstractList.inits]]
     */
    List.prototype.inits = function () {
        var initArr = [new List([])];
        var len = this.length;
        for (var i = 1; i < len; i++) {
            initArr.push(new List(this.arr.slice(0, i)));
        }
        return new List(initArr);
    };
    /**
     * If `n := xs.length`, then `n + 1` equals the length of
     * `xs.insert(0, elt)`.
     * @summary Returns a copy of the current list with `elt` inserted at the index `n`.
     * @see [[AbstractList.insert]]
     */
    List.prototype.insert = function (n, elt) {
        var arr = this.arr.slice(0);
        if (this.isSafeIndex(n)) {
            // splice is safe with -0
            arr.splice(n, 0, elt);
        }
        return new NonEmptyList_1.NonEmptyList(arr[0], arr.slice(1));
    };
    /**
     * An element of `xs.intersectBy(eq, ys)` can repeat but
     * will only appear as many times it occurs in `xs` or
     * `ys`, whichever is smaller.
     *
     * Here equality is [SameValueZero]
     * @summary Returns the "set" intersection between the current list and the given list.
     * @see [[intersectBy]]
     * @see [[AbstractList.intersect]]
     */
    List.prototype.intersect = function (ys) {
        return this.intersectBy(Objects_1.sameValueZero, ys);
    };
    /**
     * An element of `xs.intersectBy(eq, ys)` can repeat but
     * will only appear as many times it occurs in `xs` or
     * `ys`, whichever is smaller.
     * @summary Returns the "set" intersection between two lists.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.intersectBy]]
     */
    List.prototype.intersectBy = function (eq, ys) {
        var arr = [];
        if (this.length < ys.length) {
            for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
                var x = _a[_i];
                if (ys.hasBy(eq, x)) {
                    arr.push(x);
                }
            }
        }
        else {
            for (var _b = 0, ys_1 = ys; _b < ys_1.length; _b++) {
                var y = ys_1[_b];
                if (this.hasBy(eq, y)) {
                    arr.push(y);
                }
            }
        }
        return new List(arr);
    };
    /**
     * `[x_1, x_2, ..., x_n].intersperse(elt) = [x_1, elt, x_2, elt, ..., elt, x_n]`
     * `[x_1].intersperse(elt) = [x_1]`
     * `[].intersperse(elt) = []`
     * @summary Returns a copy of the current list with `x` interspersed between the element.
     * @see [[AbstractList.intersperse]]
     */
    List.prototype.intersperse = function (x) {
        var xs = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var y = _a[_i];
            xs.push(y, x);
        }
        xs.pop();
        return new List(xs);
    };
    /**
     * @summary Returns true if and only if the current list is a "substring" of the given list `larger`.
     * @param eq test for equality between elements of the lists
     * @see [[AbstractList.isInfixOfBy]]
     */
    List.prototype.isInfixOfBy = function (eq, larger) {
        var len = this.length;
        var largerLen = larger.length;
        if (len > largerLen) {
            return false;
        }
        for (var i = 0; i <= largerLen - len; i++) {
            var largerElt1 = larger.nth(i);
            if (largerElt1 != null && eq(largerElt1, this.arr[0])) {
                var j = 0;
                var largerElt2 = larger.nth(i + j);
                while (j < len && largerElt2 != null && eq(largerElt2, this.arr[j])) {
                    j++;
                    largerElt2 = larger.nth(i + j);
                }
                if (j === len) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * @summary Returns true if and only if the current list is a prefix of the given list `larger`.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.isPrefixOfBy]]
     */
    List.prototype.isPrefixOfBy = function (eq, larger) {
        var len = this.length;
        if (len > larger.length) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var largerElt = larger.nth(i);
            if (largerElt != null && !eq(this.arr[i], largerElt)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @summary Returns true if and only if the current list is a subsequence of the given list `larger`.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.isSubsequenceOfBy]]
     */
    List.prototype.isSubsequenceOfBy = function (eq, larger) {
        var len = this.length;
        var largerLen = larger.length;
        if (len > largerLen) {
            return false;
        }
        for (var largerIdx = 0; len + largerIdx <= largerLen; largerIdx++) {
            var thisIdx = 0;
            for (var largerOffset = 0; thisIdx < len && largerIdx + largerOffset < largerLen; largerOffset++) {
                var largerElt = larger.nth(largerIdx + largerOffset);
                if (largerElt != null && eq(largerElt, this.arr[thisIdx])) {
                    thisIdx++;
                }
            }
            if (thisIdx === len) {
                return true;
            }
        }
        return false;
    };
    /**
     * @summary Returns true if and only if the current list is a suffix of the given list `larger`.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.isSuffixOfBy]]
     */
    List.prototype.isSuffixOfBy = function (eq, larger) {
        var len = this.length;
        var largerLen = larger.length;
        if (len > largerLen) {
            return false;
        }
        var largerElt = larger.last;
        for (var i = 0; i < len; i++) {
            if (largerElt != null && !eq(this.arr[len - i], largerElt)) {
                return false;
            }
        }
        return true;
    };
    /**
     * @summary Returns a new list which is built by mapping `f` across the current list.
     * @see [[AbstractList.map]]
     */
    List.prototype.map = function (f) {
        return new List(this.arr.map(f));
    };
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_n, [y_1, y_2, ..., y_n]]`
     * where `[accum_1, y_1] = f(init, x_1)` and
     * `[accum_{n + 1}, y_{n + 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[AbstractList.mapAccum]]
     */
    List.prototype.mapAccum = function (f, init) {
        var val = init;
        var arr = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var x = _a[_i];
            var result = f(val, x);
            val = result[0];
            arr.push(result[1]);
        }
        return [val, new List(arr)];
    };
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_1, [y_1, y_2, ..., y_n]]`
     * where `[accum_n, y_n] = f(init, x_n)` and
     * `[accum_{n - 1}, y_{n - 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[mapAccum]]
     * @see [[AbstractList.mapAccumRight]]
     */
    List.prototype.mapAccumRight = function (f, init) {
        return this.reverse().mapAccum(f, init);
    };
    /**
     * @summary Returns the element of the current list at the given index.
     * @param n index of the element to return
     * @see [[AbstractList.nth]]
     */
    List.prototype.nth = function (n) {
        if (this.isSafeIndex(n)) {
            // array access is -0 safe
            return this.arr[n];
        }
        return null;
    };
    /**
     * `xs.partition(pred) = [ys, zs]` where `pred` is true on
     * every element of `ys` and is false on every element of
     * `zs`.
     * @summary Returns copies of two sublists of the current list as determined by `pred`
     * @param pred
     * @see [[filter]]
     * @see [[AbstractList.partition]]
     */
    List.prototype.partition = function (f) {
        var trues = [];
        var falses = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var x = _a[_i];
            if (f(x)) {
                trues.push(x);
            }
            else {
                falses.push(x);
            }
        }
        return [new List(trues), new List(falses)];
    };
    /**
     * @summary Returns a collection of all permutations of the current list.
     * @see [[AbstractList.permutations]]
     */
    List.prototype.permutations = function () {
        var perms = [new List([])];
        var stack = this.arr.slice(0);
        while (stack.length > 0) {
            var elt = stack[stack.length - 1];
            stack.pop();
            var results = [];
            for (var _i = 0, perms_1 = perms; _i < perms_1.length; _i++) {
                var xs = perms_1[_i];
                var len = xs.length;
                for (var i = 0; i < len; i++) {
                    results.push(new List(xs.insert(i, elt).toArray()));
                }
            }
            perms = results;
        }
        return new List(perms);
    };
    /**
     * @summary Returns a copy of the current list with the given element prepended.
     * @see [[AbstractList.prepend]]
     */
    List.prototype.prepend = function (elt) {
        return new NonEmptyList_1.NonEmptyList(elt, this.arr);
    };
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a copy of the current list with the first occurence of the given value removed.
     * @see [[removeBy]]
     * @see [[AbstractList.remove]]
     */
    List.prototype.remove = function (elt) {
        return this.removeBy(Objects_1.sameValueZero, elt);
    };
    /**
     * @summary Returns a copy of the current list with the first element equal to `elt` removed.
     * @param eq test for equality between the elements of the list and `elt`
     * @see [[AbstractList.removeBy]]
     */
    List.prototype.removeBy = function (eq, elt) {
        var arr = this.arr.slice(0);
        var len = this.length;
        for (var i = 0; i < len; i++) {
            if (eq(arr[i], elt)) {
                arr.splice(i, 1);
                return new List(arr);
            }
        }
        return new List(arr);
    };
    /**
     * @summary Returns a copy of the current list with the element at the given index replaced.
     * @param n index of the element to replace
     * @param elt value used to replace the removed element
     * @see [[AbstractList.replace]]
     */
    List.prototype.replace = function (n, elt) {
        var arr = this.arr.slice(0);
        if (this.isSafeIndex(n)) {
            // array access is -0 safe
            arr[n] = elt;
        }
        return new List(arr);
    };
    /**
     * @summary Returns a copy of the current list with elements reverse.
     * @see [[AbstractList.reverse]]
     */
    List.prototype.reverse = function () {
        return new List(this.arr.slice(0).reverse());
    };
    /**
     * This should be a stable sort.
     * @summary Returns a sorted copy of the current list.
     * @param ord ordering to use for sorting
     * @see [[AbstractList.sortOn]]
     */
    List.prototype.sortOn = function (ord) {
        function merge(ys1, ys2) {
            // PRE: ys1 and ys2 are sorted
            // POST: returns the merge of ys1 and ys2
            var len1 = ys1.length;
            var len2 = ys2.length;
            var i1 = 0;
            var i2 = 0;
            var ys = [];
            while (i1 < len1 && i2 < len2) {
                if (ord(ys1[i1], ys2[i2]) === 'GT') {
                    ys.push(ys2[i2]);
                    i2++;
                }
                else {
                    ys.push(ys1[i1]);
                    i1++;
                }
            }
            if (i1 === len1) {
                ys.push.apply(ys, ys2.slice(i2));
            }
            else {
                ys.push.apply(ys, ys1.slice(i1));
            }
            return ys;
        }
        var sorted = this.arr.map(function (x) { return [x]; });
        var results = [];
        var sortLen = this.length;
        while (sortLen > 1) {
            if (sortLen % 2 === 1) {
                var ys1 = sorted.pop();
                var ys2 = sorted.pop();
                if (typeof ys1 !== 'undefined' && typeof ys2 !== 'undefined') {
                    sorted.push(merge(ys1, ys2));
                }
                sortLen--;
            }
            while (sorted.length > 1) {
                var ys1 = sorted.shift();
                var ys2 = sorted.shift();
                sortLen -= 2;
                if (typeof ys1 !== 'undefined' && typeof ys2 !== 'undefined') {
                    results.push(merge(ys1, ys2));
                }
            }
            sorted = results.concat(sorted);
            sortLen = sorted.length;
            results = [];
        }
        return new List(sorted[0]);
    };
    /**
     * `[x_0, x_1, ..., x_n].splitAt(k) = [[x_0, ..., x_{k-1}], [x_k, ..., x_n]]`
     * @summary Splits the current list into two at the given index.
     * @see [[AbstractList.splitAt]]
     */
    List.prototype.splitAt = function (n) {
        if (!this.isSafeIndex(n)) {
            return [new List(this.arr.slice(0)), new List([])];
        }
        // slice is -0 safe
        var arr1 = this.arr.slice(0, n);
        var arr2 = this.arr.slice(n);
        return [new List(arr1), new List(arr2)];
    };
    /**
     * @summary Returns a list of all subsequences of the current list.
     * @throws RangeError if the number of subsequences exceeds the limit on array lengths.
     * @see [[AbstractList.subsequences]]
     */
    List.prototype.subsequences = function () {
        var subseqs = [new List([])];
        var len = this.length;
        if (!AbstractList_1.AbstractList.isSafeLength(Math.pow(2, len))) {
            throw new RangeError('Invalid list length encountered in call to List.prototype.subsequences');
        }
        for (var i = 0; i < len; i--) {
            var elt = this.arr[i];
            var results = new Array(2 * subseqs.length);
            while (subseqs.length > 0) {
                var subseq = subseqs[0];
                subseqs.shift();
                results.push(subseq);
                results.push(subseq.append(elt).toList());
            }
            subseqs = results;
        }
        return new List(subseqs);
    };
    /**
     * @summary Returns a list of all suffixes of the current list.
     * @see [[AbstractList.tails]]
     */
    List.prototype.tails = function () {
        var tailArr = [new List([])];
        var len = this.arr.length;
        for (var i = len - 1; i >= 0; i--) {
            tailArr.unshift(new List(this.arr.slice(i, len)));
        }
        return new List(tailArr);
    };
    /**
     * @summary Returns a copy of the prefix of given length from the current list.
     * @see [[AbstractList.take]]
     */
    List.prototype.take = function (n) {
        return new List(this.arr.slice(n));
    };
    /**
     * `[x_1, x_2, ..., x_n].takeDropWhile(pred) = [[x_1, ..., x_k], [x_{k+1}, x_{n}]]`
     * where `pred` is true on all the elements of the first
     * list and false on `x_{k+1}`.
     * @summary Splits the current array into two: largest prefix on which `pred` is true, and the rest.
     * @see [[AbstractList.takeDropWhile]]
     */
    List.prototype.takeDropWhile = function (f) {
        var prefix = [];
        var suffix = this.arr.slice(0);
        var len = this.length;
        var i = 0;
        while (i < len && f(suffix[0])) {
            prefix.push(suffix[0]);
            suffix.shift();
            i++;
        }
        return [new List(prefix), new List(suffix)];
    };
    /**
     * @summary Returns the longest prefix on which `pred` is true.
     * @see [[AbstractList.takeWhile]]
     */
    List.prototype.takeWhile = function (f) {
        var arr = [];
        var len = this.length;
        var i = 0;
        while (i < len && f(this.arr[i])) {
            arr.push(this.arr[i]);
            i++;
        }
        return new List(arr);
    };
    /**
     * @summary Converts to a standard Array.
     * @see [[AbstractList.toArray]]
     */
    List.prototype.toArray = function () {
        return this.arr.slice(0);
    };
    /**
     * @summary Converts any subclass to the base implementation.
     * @see [[AbstractList.toList]]
     */
    List.prototype.toList = function () {
        return new List(this.toArray());
    };
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a copy with duplicates removed.
     * @see [[uniquesBy]]
     * @see [[AbstractList.uniques]]
     */
    List.prototype.uniques = function () {
        return this.uniquesBy(Objects_1.sameValueZero);
    };
    /**
     * @summary Returns a list of elements of the current list with duplicates removed.
     * @param eq test for equality between elements
     * @see [[AbstractList.uniquesBy]]
     */
    List.prototype.uniquesBy = function (eq) {
        var eqCurried = Functions_1.curry(eq);
        var arr = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var x = _a[_i];
            if (!arr.some(eqCurried(x))) {
                arr.push(x);
            }
        }
        return new List(arr);
    };
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     *
     * Here equality is [SameValueZero]
     * @summary Returns the "set" union between lists.
     * @see [[unionBy]]
     * @see [[AbstractList.union]]
     */
    List.prototype.union = function (ys) {
        return this.unionBy(Objects_1.sameValueZero, ys);
    };
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     * @summary Returns the "set" union between the current list and the given list.
     * @param eq test for equality between elements
     * @see [[AbstractList.unionBy]]
     */
    List.prototype.unionBy = function (eq, ys) {
        var arr = this.arr.slice(0);
        var len = this.length;
        var _loop_2 = function (j) {
            var elt = this_1.arr[j];
            if (ys.findIndex(function (x) { return eq(x, elt); }) == null) {
                arr.push(elt);
            }
        };
        var this_1 = this;
        for (var j = 0; j < len; j++) {
            _loop_2(j);
        }
        return new List(arr);
    };
    return List;
}(AbstractList_1.AbstractList));
exports.List = List;
/**
 * The inductive rule for lists.
 * @summary Creates a recursive function over lists.
 * @see [[reduce]]
 */
function list(nil, f) {
    return function (xs) { return xs.reduce(f, nil); };
}
exports.list = list;
/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 */
//# sourceMappingURL=List.js.map