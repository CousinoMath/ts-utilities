"use strict";
/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("./List");
/**
 * A specialized list subclass that encodes "non-emptiness" into
 * the type system. This has been designed to interoperate
 * simply with the List superclass.
 */
class NonEmptyList extends List_1.List {
    constructor(hd, tl) {
        super([hd, ...tl]);
    }
    /**
     * A convenience to build instances from arrays, which
     * should obviously be non-empty.
     */
    static make(arr) {
        return new NonEmptyList(arr[0], arr.slice(1));
    }
    /**
     * @summary Returns the first element of the list.
     * @see [[tail]]
     * @see [[List.head]]
     */
    get head() {
        return super.arr[0];
    }
    /**
     * @summary Returns false.
     * @throws Error just in case this is not empty.
     * @see [[List.isEmpty]]
     */
    get isEmpty() {
        if (super.length === 0) {
            throw new Error('A non-empty list was found to be empty');
        }
        return false;
    }
    /**
     * @summary Returns the last element of the list.
     * @see [[List.last]]
     */
    get last() {
        return super.arr[super.length - 1];
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduce]]
     * @see [[List.accumulate]]
     */
    accumulate(f, init) {
        return NonEmptyList.make(super.accumulate(f, init).toArray());
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulateRight(f, init) = [y_1, y_2, ..., y_n]`
     * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
     * @summary Returns a collection of running "total" from a right reduction.
     * @param f the function used to accumulate over the array
     * @param init the initial value for the accumulation
     * @see [[reduceRight]]
     * @see [[List.accumulateRight]]
     */
    accumulateRight(f, init) {
        return NonEmptyList.make(super.accumulateRight(f, init).toArray());
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Returns a collection of running "total" from a right reduction.
     * @see [[reduceRightWith]]
     * @see [[List.accumulateRightWith]]
     * @param f the function used to accumulate over the array
     */
    accumulateRightWith(f) {
        return NonEmptyList.make(super.accumulateRightWith(f).toArray());
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Returns a collection of running "total" from a reduction.
     * @see [[reduceWith]]
     * @see [[List.accumulateWith]]
     * @param f the function used to accumulate over the array
     */
    accumulateWith(f) {
        return NonEmptyList.make(super.accumulateWith(f).toArray());
    }
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[groupBy]]
     * @see [[List.group]]
     */
    group() {
        return NonEmptyList.make(super.group().toArray());
    }
    /**
     * `xs.groupBy(eq) = [ys_1, ys_2, ..., ys_n]` where each
     * ys_k is the largest sublist of `xs` whose elements are
     * "equal" by `eq`. This means, for example, that if `y_1`
     * is in `ys_1` and `y_2` is in `ys_2`, then `eq(y_1, y_2)`
     * is false.
     * @summary Returns a list formed partitions the current list according to `eq`.
     * @see [[List.groupBy]]
     */
    groupBy(eq) {
        return NonEmptyList.make(super.groupBy(eq).toArray());
    }
    /**
     * @summary Returns a list of all prefixes of the current list.
     * @see [[List.inits]]
     */
    inits() {
        return NonEmptyList.make(super.inits().toArray());
    }
    /**
     * `[x_1, x_2, ..., x_n].intersperse(elt) = [x_1, elt, x_2, elt, ..., elt, x_n]`
     * `[x_1].intersperse(elt) = [x_1]`
     * @summary Returns a copy of the current list with `x` interspersed between the element.
     * @see [[List.intersperse]]
     */
    intersperse(x) {
        return NonEmptyList.make(super.intersperse(x).toArray());
    }
    /**
     * @summary Returns a new list which is built by mapping `f` across the current list.
     * @see [[List.map]]
     */
    map(f) {
        return NonEmptyList.make(super.map(f).toArray());
    }
    /**
     * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_n, [y_1, y_2, ..., y_n]]`
     * where `[accum_1, y_1] = f(init, x_1)` and
     * `[accum_{n + 1}, y_{n + 1}] = f(accum_n, x_n)`
     * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
     * @param f function which accumulates across the current list while building another list
     * @param init seed value for the accumulation
     * @see [[List.mapAccum]]
     */
    mapAccum(f, init) {
        const [val, xs] = super.mapAccum(f, init);
        return [val, NonEmptyList.make(xs.toArray())];
    }
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
    mapAccumRight(f, init) {
        const [val, xs] = super.mapAccumRight(f, init);
        return [val, NonEmptyList.make(xs.toArray())];
    }
    /**
     * @summary Returns the largest element of the current list.
     * @param ord ordering to use on the elements
     * @see [[AbstractList.max]]
     */
    max(ord) {
        const maxFn = (x, y) => (ord(x, y) === 'LT' ? y : x);
        return List_1.List.list(this.head, maxFn)(this.tail);
    }
    /**
     * @summary Returns the smallest element of the current list.
     * @param ord ordering to use on the elements
     * @see [[AbstractList.min]]
     */
    min(ord) {
        return this.max((x, y) => ord(y, x));
    }
    /**
     * @summary Returns a collection of all permutations of the current list.
     * @see [[List.permutations]]
     */
    permutations() {
        return NonEmptyList.make(super.permutations().toArray());
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
     * where `y_n := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
     * @summary Reduces the current list with `f`
     * @param f the function used to accumulate over the array
     * @see [[accumulateRightWith]]
     * @see [[AbstractList.reduceRightWith]]
     */
    reduceRightWith(f) {
        return this.reverse().reduceWith(f);
    }
    /**
     * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
     * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
     * @summary Reduces the current list with `f`
     * @param f the function used to accumulate over the array
     * @see [[accumulateWith]]
     * @see [[AbstractList.reduceWith]]
     */
    reduceWith(f) {
        return super.arr.slice(1).reduce(f, this.head);
    }
    /**
     * @summary Returns a copy of the current list with the element at the given index replaced.
     * @param n index of the element to replace
     * @param elt value used to replace the removed element
     * @see [[List.replace]]
     */
    replace(n, elt) {
        return NonEmptyList.make(super.replace(n, elt).toArray());
    }
    /**
     * @summary Returns a copy of the current list with elements reverse.
     * @see [[List.reverse]]
     */
    reverse() {
        return NonEmptyList.make(super.arr.slice(0).reverse());
    }
    /**
     * This should be a stable sort.
     * @summary Returns a sorted copy of the current list.
     * @param ord ordering to use for sorting
     * @see [[List.sortOn]]
     */
    sortOn(ord) {
        return NonEmptyList.make(super.sortOn(ord).toArray());
    }
    /**
     * @summary Returns a list of all subsequences of the current list.
     * @throws RangeError if the number of subsequences exceeds the limit on array lengths.
     * @see [[List.subsequences]]
     */
    subsequences() {
        return NonEmptyList.make(super.subsequences().toArray());
    }
    /**
     * @summary Returns a list of all suffixes of the current list.
     * @see [[List.tails]]
     */
    tails() {
        return NonEmptyList.make(super.tails().toArray());
    }
    /**
     * @summary Converts any subclass to the base implementation.
     * @see [[List.toList]]
     */
    toList() {
        return new List_1.List(super.arr);
    }
    /**
     * @summary Returns a copy of itself.
     * @see [[AbstractList.toNonEmptyList]]
     */
    toNonEmptyList() {
        return NonEmptyList.make(super.arr);
    }
    /**
     * Here equality is [SameValueZero]
     * @summary Returns a copy with duplicates removed.
     * @see [[uniquesBy]]
     * @see [[List.uniques]]
     */
    uniques() {
        return NonEmptyList.make(super.uniques().toArray());
    }
    /**
     * @summary Returns a list of elements of the current list with duplicates removed.
     * @param eq test for equality between elements
     * @see [[List.uniquesBy]]
     */
    uniquesBy(eq) {
        return NonEmptyList.make(super.uniquesBy(eq).toArray());
    }
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     *
     * Here equality is [SameValueZero]
     * @summary Returns the "set" union between lists.
     * @see [[unionBy]]
     * @see [[List.union]]
     */
    union(ys) {
        return NonEmptyList.make(super.union(ys).toArray());
    }
    /**
     * This ignores duplicates in `ys` but will keep any
     * duplicates of the current list.
     * @summary Returns the "set" union between the current list and the given list.
     * @param eq test for equality between elements
     * @see [[List.unionBy]]
     */
    unionBy(eq, ys) {
        return NonEmptyList.make(super.unionBy(eq, ys).toArray());
    }
}
exports.NonEmptyList = NonEmptyList;
/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 */ 
//# sourceMappingURL=NonEmptyList.js.map