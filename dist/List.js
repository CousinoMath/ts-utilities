"use strict";
/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractList_1 = require("./AbstractList");
const Functions_1 = require("./Functions");
const Maybe_1 = require("./Maybe");
const NonEmptyList_1 = require("./NonEmptyList");
const Objects_1 = require("./Objects");
/**
 * Basic array-backed list class
 */
class List extends AbstractList_1.AbstractList {
    constructor(arr) {
        super();
        /**
         * The array behind this implementation.
         */
        this.arr = [];
        this.arr = arr;
    }
    /**
     * @summary Joins a list of booleans together with `&&`, respecting short-circuiting.
     * @see [[or]]
     */
    static and(xs) {
        return xs.every(Functions_1.ident);
    }
    /**
     * @summary Concatenates a collection of lists.
     */
    static concat(xss) {
        const arr = [];
        for (const xs of xss) {
            arr.concat(...xs.arr);
        }
        return new List(arr);
    }
    /**
     * @summary Concatenates elements of `items` interspersed with `sep`.
     * @see [[intersperse]]
     */
    static itercalate(sep, items) {
        const len = items.length - 1;
        const arr = [];
        for (let i = 0; i < len; i++) {
            arr.concat(...items.arr[i].arr, ...sep.arr);
        }
        arr.concat(...Maybe_1.maybe([], last => last.arr)(items.last));
        return new List(arr);
    }
    /**
     * The inductive rule for lists.
     * @summary Creates a recursive function over lists.
     * @see [[reduce]]
     */
    static list(nil, f) {
        return xs => xs.reduce(f, nil);
    }
    /**
     * @summary Joins together a list of booleans with `||`, respects short-circuiting
     * @see [[and]]
     */
    static or(xs) {
        return xs.some(Functions_1.ident);
    }
    /**
     * Returns `[start, start + step, ..., start + n * step]`
     * where `n = Math.floor((stop - start) / step)`. So
     * `start + n * step <= stop < start + (n + 1) * step`.
     * @summary Returns an arithmetic sequence of numbers
     * @param start starting value
     * @param stop value to not exceed
     */
    static range(start = 0, stop, step = 1) {
        const spread = stop - start;
        const len = step === 0 ? -1 : Math.floor(spread / step);
        if (!AbstractList_1.AbstractList.isSafeLength(len)) {
            throw new RangeError("Invalid list length encountered in call to List.range");
        }
        const arr = new Array(len);
        for (let i = 0; i <= len; i++) {
            arr.push(start + i * step);
        }
        return new List(arr);
    }
    /**
     * @summary Returns a list of given length populated with the given value.
     */
    static repeat(n, elt) {
        if (!AbstractList_1.AbstractList.isSafeLength(n)) {
            throw new RangeError("Invalid list length encountered in a call to List.repeat");
        }
        return new List(new Array(n).fill(elt));
    }
    /**
     * @summary Unzips a list of tuples into a tuple of lists.
     * @see [[zip]]
     */
    static unzip(xys) {
        const len = xys.length;
        const arrA = new Array(len);
        const arrB = new Array(len);
        for (let i = 0; i < len; i++) {
            const xy = xys.arr[i];
            arrA.push(xy[0]);
            arrB.push(xy[1]);
        }
        return [new List(arrA), new List(arrB)];
    }
    /**
     * The returned list is as long as the shortest list.
     * @summary Zips a pair of lists into a list of tuples.
     * @see [[unzip]]
     */
    static zip(xs, ys) {
        const arr = [];
        const len = Math.min(xs.length, ys.length);
        for (let i = 0; i < len; i++) {
            arr.push([xs.arr[i], ys.arr[i]]);
        }
        return new List(arr);
    }
    /**
     * `List.zipWith(f, xs, ys) = List.zip(xs, ys).map(xy => f(...xy))`
     * @summary Zips a pair of lists using a custom zipper.
     */
    static zipWith(f, xs, ys) {
        const arr = [];
        const len = Math.min(xs.length, ys.length);
        for (let i = 0; i < len; i++) {
            arr.push(f(xs.arr[i], ys.arr[i]));
        }
        return new List(arr);
    }
    /**
     * @summary Returns the first element of the list, if it exists, and null otherwise.
     * @see [[AbstractList.head]]
     * @see [[tail]]
     */
    get head() {
        return this.isEmpty ? null : this.arr[0];
    }
    /**
     * @summary Returns true if and only if the list is empty.
     * @see [[AbstractList.isEmpty]]
     */
    get isEmpty() {
        return this.arr.length === 0;
    }
    /**
     * @summary Returns a copy of the list with the last element removed.
     * @see [[AbstractList.init]]
     */
    get init() {
        return new List(this.arr.slice(0, this.length - 1));
    }
    /**
     * @summary Returns the last element of the list, if it exists, and null otherwise.
     * @see [[AbstractList.last]]
     */
    get last() {
        return this.isEmpty ? null : this.arr[this.length - 1];
    }
    /**
     * @summary Returns the number of elements in the list, its length or size.
     * @see [[size]]
     * @see [[AbstractList.length]]
     */
    get length() {
        return this.arr.length;
    }
    /**
     * @summary Returns the number of elements in the list, its length or size.
     * @see [[length]]
     * @see [[AbstractList.size]]
     */
    get size() {
        return this.length;
    }
    /**
     * @summary Returns a copy of the list with the first element removed.
     * @see [[init]]
     * @see [[AbstractList.tail]]
     */
    get tail() {
        return new List(this.arr.slice(1));
    }
    /**
     * Allows lists to be iterated over in `for of` loops and spread/rest
     * syntax.
     */
    [Symbol.iterator]() {
        const arr = this.arr.slice(0);
        return arr[Symbol.iterator]();
    }
    /**
     * Always converts to an array.
     */
    [Symbol.toPrimitive](hint) {
        return this.arr.slice(0);
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduce]]
     * @see [[AbstractList.accumulate]]
     */
    accumulate(f, init) {
        const arr = [init];
        let val = init;
        for (const x of this.arr) {
            val = f(val, x);
            arr.push(val);
        }
        return new List(arr);
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulateRight(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a right reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduceRight]]
     * @see [[AbstractList.accumulateRight]]
     */
    accumulateRight(f, init) {
        let val = init;
        const arr = [init];
        for (const x of this.reverse()) {
            val = f(val, x);
            arr.push(val);
        }
        return new List(arr);
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Returns a collection of running "total" from a right reduction.
     * @param f the function used to accumulate over the array
     * @see [[reduceRightWith]]
     * @see [[AbstractList.accumulateRightWith]]
     */
    accumulateRightWith(f) {
        return this.reverse().accumulateWith(f);
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Returns a collection of running "total" from a reduction.
     * @param f the function used to accumulate over the array
     * @see [[reduceWith]]
     * @see [[AbstractList.accumulateWith]]
     */
    accumulateWith(f) {
        const arr = [];
        if (this.arr.length > 0) {
            let val = this.arr[0];
            arr.push(val);
            for (const x of this.arr.slice(1)) {
                val = f(val, x);
                arr.push(val);
            }
        }
        return new List(arr);
    }
    /**
     * @summary Returns a copy of the list with an the given element appended to the end.
     * @see [[AbstractList.append]]
     */
    append(elt) {
        const tl = this.arr.slice(0);
        tl.push(elt);
        const hd = tl[0];
        tl.shift();
        return new NonEmptyList_1.NonEmptyList(hd, tl);
    }
    /**
     * @summary Returns a copy of the list with the element at the given index removed.
     * @param n index of element to be removed
     * @see [[AbstractList.delete]]
     */
    delete(n) {
        const arr = this.arr.slice(0);
        if (this.isSafeIndex(n)) {
            arr.splice(n, 1);
        }
        return new List(arr);
    }
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
    difference(ys) {
        return this.differenceBy(Objects_1.sameValueZero, ys);
    }
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
    differenceBy(eq, ys) {
        const arr = this.arr.slice(0);
        const len = this.length;
        for (let i = 0; i < len; i++) {
            const idxm = ys.findIndex(y => eq(arr[i], y));
            if (idxm != null) {
                arr.splice(i, 1);
                ys.delete(idxm);
            }
        }
        return new List(arr);
    }
    /**
     * @summary Returns a copy of the list with the first `n` elements dropped.
     * @param n a nonnegative number of elements to be dropped
     * @see [[take]]
     * @see [[Abstract.drop]]
     */
    drop(n) {
        if (Number.isInteger(n)) {
            const lastIdx = this.length - 1;
            if (n >= 0) {
                if (n > lastIdx) {
                    return new List([]);
                }
                return new List(this.arr.slice(n, lastIdx));
            }
            else {
                const endIdx = lastIdx - n;
                if (endIdx < 0) {
                    return new List([]);
                }
                return new List(this.arr.slice(0, endIdx));
            }
        }
        return new List(this.arr.slice(0));
    }
    /**
     * @summary Returns a copy of the list with the longest suffix on which `pred` is true.
     * @see [[AbstractList.dropTailWhile]]
     */
    dropTailWhile(f) {
        const arr = this.arr.slice(0);
        let i = this.length - 1;
        while (i >= 0 && f(arr[i])) {
            arr.pop();
            i--;
        }
        return new List(arr);
    }
    /**
     * @summary Returns a copy of the list with the longest prefix on which `pred` is true.
     * @see [[takeWhile]]
     * @see [[AbstractList.dropWhile]]
     */
    dropWhile(f) {
        const arr = this.arr.slice(0);
        const len = this.length;
        let i = 0;
        while (i < len && f(arr[0])) {
            arr.shift();
            i++;
        }
        return new List(arr);
    }
    /**
     * @summary Returns a new list of all elements of the current list for which `pred` is true.
     * @see [[partition]]
     * @see [[AbstractList.filter]]
     */
    filter(f) {
        return new List(this.arr.filter(f));
    }
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
    findIndex(f) {
        const len = this.length;
        for (let i = 0; i < len; i++) {
            if (f(this.arr[i])) {
                return i;
            }
        }
        return null;
    }
    /**
     * @summary Returns a list of all indices whose corresponding elements make `pred` true.
     * @see [[AbstractList.findIndices]]
     */
    findIndices(f) {
        const arr = [];
        const len = this.length;
        for (let i = 0; i < len; i++) {
            if (f(this.arr[i])) {
                arr.push(i);
            }
        }
        return new List(arr);
    }
    /**
     * @summary Returns a list formed by mapping `f` through the current list and concatenates the results.
     * @see [[AbstractList.flatMap]]
     */
    flatMap(f) {
        const arr = [];
        for (const x of this.arr) {
            arr.concat(...f(x).toArray());
        }
        return new List(arr);
    }
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[groupBy]]
     * @see [[AbstractList.group]]
     */
    group() {
        return this.groupBy(Objects_1.sameValueZero);
    }
    /**
     * `xs.groupBy(eq) = [ys_1, ys_2, ..., ys_n]` where each
     * ys_k is the largest sublist of `xs` whose elements are
     * "equal" by `eq`. This means, for example, that if `y_1`
     * is in `ys_1` and `y_2` is in `ys_2`, then `eq(y_1, y_2)`
     * is false.
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[AbstractList.groupBy]]
     */
    groupBy(eq) {
        const groups = [];
        for (const elt of this.arr) {
            let grouped = false;
            for (const group of groups) {
                const groupElt = group.arr[0];
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
    }
    /**
     * @summary Returns a list of all prefixes of the current list.
     * @see [[tails]]
     * @see [[AbstractList.inits]]
     */
    inits() {
        const initArr = [new List([])];
        const len = this.length;
        for (let i = 1; i < len; i++) {
            initArr.push(new List(this.arr.slice(0, i)));
        }
        return new List(initArr);
    }
    /**
     * If `n := xs.length`, then `n + 1` equals the length of
     * `xs.insert(0, elt)`.
     * @summary Returns a copy of the current list with `elt` inserted at the index `n`.
     * @see [[AbstractList.insert]]
     */
    insert(n, elt) {
        const arr = this.arr.slice(0);
        const len = this.length;
        if (this.isSafeIndex(n)) {
            arr.splice(n, 0, elt);
        }
        return new NonEmptyList_1.NonEmptyList(arr[0], arr.slice(1));
    }
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
    intersect(ys) {
        return this.intersectBy(Objects_1.sameValueZero, ys);
    }
    /**
     * An element of `xs.intersectBy(eq, ys)` can repeat but
     * will only appear as many times it occurs in `xs` or
     * `ys`, whichever is smaller.
     * @summary Returns the "set" intersection between two lists.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.intersectBy]]
     */
    intersectBy(eq, ys) {
        const arr = [];
        if (this.length < ys.length) {
            for (const x of this.arr) {
                if (ys.hasBy(eq, x)) {
                    arr.push(x);
                }
            }
        }
        else {
            for (const y of ys) {
                if (this.hasBy(eq, y)) {
                    arr.push(y);
                }
            }
        }
        return new List(arr);
    }
    /**
     * `[x_1, x_2, ..., x_n].intersperse(elt) = [x_1, elt, x_2, elt, ..., elt, x_n]`
     * `[x_1].intersperse(elt) = [x_1]`
     * `[].intersperse(elt) = []`
     * @summary Returns a copy of the current list with `x` interspersed between the element.
     * @see [[AbstractList.intersperse]]
     */
    intersperse(x) {
        const xs = [];
        for (const y of this.arr) {
            xs.push(y, x);
        }
        xs.pop();
        return new List(xs);
    }
    /**
     * @summary Returns true if and only if the current list is a "substring" of the given list `larger`.
     * @param eq test for equality between elements of the lists
     * @see [[AbstractList.isInfixOfBy]]
     */
    isInfixOfBy(eq, larger) {
        const len = this.length;
        const largerLen = larger.length;
        if (len > largerLen) {
            return false;
        }
        for (let i = 0; i <= largerLen - len; i++) {
            const largerElt1 = larger.nth(i);
            if (largerElt1 != null && eq(largerElt1, this.arr[0])) {
                let j = 0;
                let largerElt2 = larger.nth(i + j);
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
    }
    /**
     * @summary Returns true if and only if the current list is a prefix of the given list `larger`.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.isPrefixOfBy]]
     */
    isPrefixOfBy(eq, larger) {
        const len = this.length;
        if (len > larger.length) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            const largerElt = larger.nth(i);
            if (largerElt != null && !eq(this.arr[i], largerElt)) {
                return false;
            }
        }
        return true;
    }
    /**
     * @summary Returns true if and only if the current list is a subsequence of the given list `larger`.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.isSubsequenceOfBy]]
     */
    isSubsequenceOfBy(eq, larger) {
        const len = this.length;
        const largerLen = larger.length;
        if (len > largerLen) {
            return false;
        }
        for (let largerIdx = 0; len + largerIdx <= largerLen; largerIdx++) {
            let thisIdx = 0;
            for (let largerOffset = 0; thisIdx < len && largerIdx + largerOffset < largerLen; largerOffset++) {
                const largerElt = larger.nth(largerIdx + largerOffset);
                if (largerElt != null && eq(largerElt, this.arr[thisIdx])) {
                    thisIdx++;
                }
            }
            if (thisIdx === len) {
                return true;
            }
        }
        return false;
    }
    /**
     * @summary Returns true if and only if the current list is a suffix of the given list `larger`.
     * @param eq test for equality between elements of the lists.
     * @see [[AbstractList.isSuffixOfBy]]
     */
    isSuffixOfBy(eq, larger) {
        const len = this.length;
        const largerLen = larger.length;
        if (len > largerLen) {
            return false;
        }
        const largerElt = larger.last;
        for (let i = 0; i < len; i++) {
            if (largerElt != null && !eq(this.arr[len - i], largerElt)) {
                return false;
            }
        }
        return true;
    }
    /**
     * @summary Returns a new list which is built by mapping `f` across the current list.
     * @see [[AbstractList.map]]
     */
    map(f) {
        return new List(this.arr.map(f));
    }
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_n, [y_1, y_2, ..., y_n]]`
     * where `[accum_1, y_1] = f(init, x_1)` and
     * `[accum_{n + 1}, y_{n + 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[AbstractList.mapAccum]]
     */
    mapAccum(f, init) {
        let val = init;
        const arr = [];
        for (const x of this.arr) {
            const result = f(val, x);
            val = result[0];
            arr.push(result[1]);
        }
        return [val, new List(arr)];
    }
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
    mapAccumRight(f, init) {
        return this.reverse().mapAccum(f, init);
    }
    /**
     * @summary Returns the element of the current list at the given index.
     * @param n index of the element to return
     * @see [[AbstractList.nth]]
     */
    nth(n) {
        if (this.isSafeIndex(n)) {
            return this.arr[n];
        }
        return null;
    }
    /**
     * `xs.partition(pred) = [ys, zs]` where `pred` is true on
     * every element of `ys` and is false on every element of
     * `zs`.
     * @summary Returns copies of two sublists of the current list as determined by `pred`
     * @param pred
     * @see [[filter]]
     * @see [[AbstractList.partition]]
     */
    partition(f) {
        const trues = [];
        const falses = [];
        for (const x of this.arr) {
            if (f(x)) {
                trues.push(x);
            }
            else {
                falses.push(x);
            }
        }
        return [new List(trues), new List(falses)];
    }
    /**
     * @summary Returns a collection of all permutations of the current list.
     * @see [[AbstractList.permutations]]
     */
    permutations() {
        let perms = [new List([])];
        const stack = this.arr.slice(0);
        while (stack.length > 0) {
            const elt = stack[stack.length - 1];
            stack.pop();
            const results = [];
            for (const xs of perms) {
                const len = xs.length;
                for (let i = 0; i < len; i++) {
                    results.push(new List(xs.insert(i, elt).toArray()));
                }
            }
            perms = results;
        }
        return new List(perms);
    }
    /**
     * @summary Returns a copy of the current list with the given element prepended.
     * @see [[AbstractList.prepend]]
     */
    prepend(elt) {
        return new NonEmptyList_1.NonEmptyList(elt, this.arr);
    }
    /**
     * Here equality is [[SameValueZero]]
     * @summary Returns a copy of the current list with the first occurence of the given value removed.
     * @see [[removeBy]]
     * @see [[AbstractList.remove]]
     */
    remove(elt) {
        return this.removeBy(Objects_1.sameValueZero, elt);
    }
    /**
     * @summary Returns a copy of the current list with the first element equal to `elt` removed.
     * @param eq test for equality between the elements of the list and `elt`
     * @see [[AbstractList.removeBy]]
     */
    removeBy(eq, elt) {
        const arr = this.arr.slice(0);
        const len = this.length;
        for (let i = 0; i < len; i++) {
            if (eq(arr[i], elt)) {
                arr.splice(i, 1);
                return new List(arr);
            }
        }
        return new List(arr);
    }
    /**
     * @summary Returns a copy of the current list with the element at the given index replaced.
     * @param n index of the element to replace
     * @param elt value used to replace the removed element
     * @see [[AbstractList.replace]]
     */
    replace(n, elt) {
        const arr = this.arr.slice(0);
        if (this.isSafeIndex(n)) {
            arr[n] = elt;
        }
        return new List(arr);
    }
    /**
     * @summary Returns a copy of the current list with elements reverse.
     * @see [[AbstractList.reverse]]
     */
    reverse() {
        return new List(this.arr.slice(0).reverse());
    }
    /**
     * This should be a stable sort.
     * @summary Returns a sorted copy of the current list.
     * @param ord ordering to use for sorting
     * @see [[AbstractList.sortOn]]
     */
    sortOn(ord) {
        const unsorted = [this.arr.slice(0)];
        const sorted = [];
        while (unsorted.length > 0) {
            const arr = unsorted[0];
            const len = arr.length;
            unsorted.shift();
            if (len > 1) {
                const midIdx = Math.floor(len / 2);
                unsorted.push(arr.slice(0, midIdx));
                unsorted.push(arr.slice(midIdx));
            }
            else {
                sorted.push(arr);
            }
        }
        while (sorted.length > 1) {
            const arr1 = sorted[0];
            const arr2 = sorted[1];
            const arr = [];
            sorted.shift();
            sorted.shift();
            const len1 = arr1.length;
            const len2 = arr2.length;
            let i1 = 0;
            let i2 = 0;
            while (i1 < len1 && i2 < len2) {
                if (ord(arr1[i1], arr2[i2]) === "GT") {
                    arr.push(arr2[i2]);
                    i2++;
                }
                else {
                    arr.push(arr1[i1]);
                    i1++;
                }
            }
            if (i1 === len1) {
                arr.push(...arr2.slice(i2));
            }
            else {
                arr.push(...arr1.slice(i1));
            }
            sorted.push(arr);
        }
        return new List(sorted[0]);
    }
    /**
     * `[x_0, x_1, ..., x_n].splitAt(k) = [[x_0, ..., x_{k-1}], [x_k, ..., x_n]]`
     * @summary Splits the current list into two at the given index.
     * @see [[AbstractList.splitAt]]
     */
    splitAt(n) {
        if (!this.isSafeIndex(n)) {
            return [new List(this.arr.slice(0)), new List([])];
        }
        const arr1 = this.arr.slice(0, n);
        const arr2 = this.arr.slice(n);
        return [new List(arr1), new List(arr2)];
    }
    /**
     * @summary Returns a list of all subsequences of the current list.
     * @throws RangeError if the number of subsequences exceeds the limit on array lengths.
     * @see [[AbstractList.subsequences]]
     */
    subsequences() {
        let subseqs = [new List([])];
        const len = this.length;
        if (!AbstractList_1.AbstractList.isSafeLength(Math.pow(2, len))) {
            throw new RangeError("Invalid list length encountered in call to List.prototype.subsequences");
        }
        for (let i = 0; i < len; i--) {
            const elt = this.arr[i];
            const results = new Array(2 * subseqs.length);
            while (subseqs.length > 0) {
                const subseq = subseqs[0];
                subseqs.shift();
                results.push(subseq);
                results.push(subseq.append(elt).toList());
            }
            subseqs = results;
        }
        return new List(subseqs);
    }
    /**
     * @summary Returns a list of all suffixes of the current list.
     * @see [[AbstractList.tails]]
     */
    tails() {
        const tailArr = [new List([])];
        const len = this.arr.length;
        for (let i = len - 1; i >= 0; i--) {
            tailArr.unshift(new List(this.arr.slice(i, len)));
        }
        return new List(tailArr);
    }
    /**
     * @summary Returns a copy of the prefix of given length from the current list.
     * @see [[AbstractList.take]]
     */
    take(n) {
        return new List(this.arr.slice(n));
    }
    /**
     * `[x_1, x_2, ..., x_n].takeDropWhile(pred) = [[x_1, ..., x_k], [x_{k+1}, x_{n}]]`
     * where `pred` is true on all the elements of the first
     * list and false on `x_{k+1}`.
     * @summary Splits the current array into two: largest prefix on which `pred` is true, and the rest.
     * @see [[AbstractList.takeDropWhile]]
     */
    takeDropWhile(f) {
        const prefix = [];
        const suffix = this.arr.slice(0);
        const len = this.length;
        let i = 0;
        while (i < len && f(suffix[0])) {
            prefix.push(suffix[0]);
            suffix.shift();
            i++;
        }
        return [new List(prefix), new List(suffix)];
    }
    /**
     * @summary Returns the longest prefix on which `pred` is true.
     * @see [[AbstractList.takeWhile]]
     */
    takeWhile(f) {
        const arr = [];
        const len = this.length;
        let i = 0;
        while (i < len && f(this.arr[i])) {
            arr.push(this.arr[i]);
            i++;
        }
        return new List(arr);
    }
    /**
     * @summary Converts to a standard Array.
     * @see [[AbstractList.toArray]]
     */
    toArray() {
        return this.arr.slice(0);
    }
    /**
     * @summary Converts any subclass to the base implementation.
     * @see [[AbstractList.toList]]
     */
    toList() {
        return new List(this.toArray());
    }
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a copy with duplicates removed.
     * @see [[uniquesBy]]
     * @see [[AbstractList.uniques]]
     */
    uniques() {
        return this.uniquesBy(Objects_1.sameValueZero);
    }
    /**
     * @summary Returns a list of elements of the current list with duplicates removed.
     * @param eq test for equality between elements
     * @see [[AbstractList.uniquesBy]]
     */
    uniquesBy(eq) {
        const len = this.length;
        const eqCurried = Functions_1.curry(eq);
        const arr = [];
        for (const x of this.arr) {
            if (!arr.some(eqCurried(x))) {
                arr.push(x);
            }
        }
        return new List(arr);
    }
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     *
     * Here equality is [SameValueZero]
     * @summary Returns the "set" union between lists.
     * @see [[unionBy]]
     * @see [[AbstractList.union]]
     */
    union(ys) {
        return this.unionBy(Objects_1.sameValueZero, ys);
    }
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     * @summary Returns the "set" union between the current list and the given list.
     * @param eq test for equality between elements
     * @see [[AbstractList.unionBy]]
     */
    unionBy(eq, ys) {
        const arr = this.arr.slice(0);
        const len = this.length;
        for (let j = 0; j < len; j++) {
            const elt = this.arr[j];
            if (ys.findIndex(x => eq(x, elt)) == null) {
                arr.push(elt);
            }
        }
        return new List(arr);
    }
}
exports.List = List;
/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 */ 
//# sourceMappingURL=List.js.map