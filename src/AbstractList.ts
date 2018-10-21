/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */

import { flip } from './Functions';
import { bind, Maybe, bottom } from './Maybe';
import { sameValueZero } from './Objects';
import { Ordering } from './Ordering';
import { isInteger, log2 } from './Polyfills';

/**
 * This is an abstract class which abstracts the basics of lists and
 * implements some of the more higher level operations.
 */
// export abstract class AbstractList<T> implements Iterable<T> {
export abstract class AbstractList<T> {
  /**
   * In Javascript, arrays cannot be length 2^32 or longer.
   * @summary Test whether a given length is valid for arrays.
   */
  protected static isSafeLength(n: number): boolean {
    return isInteger(n) && n >= -0 && log2(n) < 32;
  }

  /**
   * This is never used in the abstract class. It is included
   * so that the Typescript compiler allows easier conversion
   * between the various lists.
   */
  protected arr: T[] = [];

  /**
   * @summary Returns the first element of the list, if it exists, and ⊥ otherwise.
   * @see [[tail]]
   */
  public abstract get head(): Maybe<T>;

  /**
   * @summary Returns true if and only if the list is empty.
   */

  public abstract get isEmpty(): boolean;

  /**
   * @summary Returns a copy of the list with the last element removed.
   */

  public abstract get init(): AbstractList<T>;

  /**
   * @summary Returns the last element of the list, if it exists, and ⊥ otherwise.
   */
  public abstract get last(): Maybe<T>;

  /**
   * @summary Returns the number of elements in the list, its length or size.
   * @see [[size]]
   */
  public abstract get length(): number;

  /**
   * @summary Returns the number of elements in the list, its length or size.
   * @see [[length]]
   */
  public abstract get size(): number;

  /**
   * @summary Returns a copy of the list with the first element removed.
   * @see [[init]]
   */
  public abstract get tail(): AbstractList<T>;

  /**
   * Allows lists to be iterated over in `for of` loops and spread/rest
   * syntax.
   */
  // public abstract [Symbol.iterator](): Iterator<T>;

  /**
   * Always converts to an array.
   */
  // public abstract [Symbol.toPrimitive](hint: string): T[];

  /**
   * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_n]`
   * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
   * @summary Returns a collection of running "total" from a reduction.
   * @see [[reduce]]
   * @param f the function used to accumulate over the array
   * @param init the initial value for the accumulation
   */
  public abstract accumulate<U>(
    f: (acc: U, val: T) => U,
    init: U
  ): AbstractList<U>;

  /**
   * `[x_1, x_2, ..., x_n].accumulateRight(f, init) = [y_1, y_2, ..., y_n]`
   * where `y_n := init` and `y_{k - 1} := f(y_k, x_k)`
   * @summary Returns a collection of running "total" from a right reduction.
   * @see [[reduceRight]]
   * @param f the function used to accumulate over the array
   * @param init the initial value for the accumulation
   */
  public abstract accumulateRight<U>(
    f: (acc: U, val: T) => U,
    init: U
  ): AbstractList<U>;

  /**
   * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
   * where `y_1 := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
   * @summary Returns a collection of running "total" from a right reduction.
   * @see [[reduceRightWith]]
   * @param f the function used to accumulate over the array
   */
  public abstract accumulateRightWith(
    f: (acc: T, val: T) => T
  ): AbstractList<T>;

  /**
   * `[x_1, x_2, ..., x_n].accumulate(f, init) = [y_1, y_2, ..., y_{n}]`
   * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
   * @summary Returns a collection of running "total" from a reduction.
   * @see [[reduceWith]]
   * @param f the function used to accumulate over the array
   */
  public abstract accumulateWith(f: (acc: T, val: T) => T): AbstractList<T>;

  /**
   * @summary Returns a copy of the list with an the given element appended to the end.
   */
  public abstract append(elt: T): AbstractList<T>;

  /**
   * @summary Returns a copy of the list with the element at the given index removed.
   * @param n index of element to be removed
   */
  public abstract delete(n: number): AbstractList<T>;

  /**
   * `[x, ...xs].difference(ys)` returns
   * `xs.difference(ys_)` when `x` is "equal" to some element of `ys`
   * where `ys_` is `ys` with the first occurrance of `x` removed.
   * Otherwise, when `x` is "not equal" to any element of `ys`, the
   * call returns `[x, ...xs.difference(ys)]`.
   *
   * Here equality is determined by `eq`
   * @summary Returns the "set" difference between two lists.
   * @param eq test for equality
   * @param ys list of elements to remove from current list
   */
  public abstract differenceBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): AbstractList<T>;

  /**
   * @summary Returns a copy of the list with the first `n` elements dropped.
   * @param n a nonnegative number of elements to be dropped
   */
  public abstract drop(n: number): AbstractList<T>;

  /**
   * @summary Returns a copy of the list with the longest suffix on which `pred` is true.
   */
  public abstract dropTailWhile(pred: (x: T) => boolean): AbstractList<T>;

  /**
   * @summary Returns a copy of the list with the longest prefix on which `pred` is true.
   */
  public abstract dropWhile(pred: (x: T) => boolean): AbstractList<T>;

  /**
   * @summary Returns a new list of all elements of the current list for which `pred` is true.
   */
  public abstract filter(pred: (x: T) => boolean): AbstractList<T>;

  /**
   * `[x_1, x_2, ..., x_n].findIndex(pred) = i` means that
   * `pred(x_i)` is true and `pred(x_k)` is false for every
   * `k < i`.
   *
   * `xs.findIndex(pred) = ⊥` means that no element of
   * `xs` makes `pred` true.
   * @summary Returns the first index in the list whose corresponding element makes `pred` true.
   */
  public abstract findIndex(pred: (x: T) => boolean): Maybe<number>;

  /**
   * @summary Returns a list of all indices whose corresponding elements make `pred` true.
   */
  public abstract findIndices(pred: (x: T) => boolean): AbstractList<number>;

  /**
   * @summary Returns a list formed by mapping `f` through the current list and concatenates the results.
   */
  public abstract flatMap<U>(f: (x: T) => AbstractList<U>): AbstractList<U>;

  /**
   * `xs.groupBy(eq) = [ys_1, ys_2, ..., ys_n]` where each
   * ys_k is the largest sublist of `xs` whose elements are
   * "equal" by `eq`. This means, for example, that if `y_1`
   * is in `ys_1` and `y_2` is in `ys_2`, then `eq(y_1, y_2)`
   * is false.
   * @summary Returns a list formed partitions the current list according to `eq`.
   */
  public abstract groupBy(
    eq: (x: T, y: T) => boolean
  ): AbstractList<NonEmptyList<T>>;

  /**
   * @summary Returns a list of all prefixes of the current list.
   */
  public abstract inits(): AbstractList<AbstractList<T>>;

  /**
   * If `n := xs.length`, then `n + 1` equals the length of
   * `xs.insert(0, elt)`.
   * @summary Returns a copy of the current list with `elt` inserted at the index `n`.
   */
  public abstract insert(n: number, elt: T): AbstractList<T>;

  /**
   * @summary Returns true if and only if the current list is a "substring" of the given list `larger`.
   * @param eq test for equality between elements of the lists
   */
  public abstract isInfixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;

  /**
   * @summary Returns true if and only if the current list is a prefix of the given list `larger`.
   * @param eq test for equality between elements of the lists.
   */
  public abstract isPrefixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;

  /**
   * @summary Returns true if and only if the current list is a subsequence of the given list `larger`.
   * @param eq test for equality between elements of the lists.
   */
  public abstract isSubsequenceOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;

  /**
   * @summary Returns true if and only if the current list is a suffix of the given list `larger`.
   * @param eq test for equality between elements of the lists.
   */
  public abstract isSuffixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;

  /**
   * An element of `xs.intersectBy(eq, ys)` can repeat but
   * will only appear as many times it occurs in `xs` or
   * `ys`, whichever is smaller.
   * @summary Returns the "set" intersection between two lists.
   * @param eq test for equality between elements of the lists.
   */
  public abstract intersectBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): AbstractList<T>;

  /**
   * `[x_1, x_2, ..., x_n].intersperse(elt) = [x_1, elt, x_2, elt, ..., elt, x_n]`
   * `[x_1].intersperse(elt) = [x_1]`
   * `[].intersperse(elt) = []`
   * @summary Returns a copy of the current list with `x` interspersed between the element.
   */
  public abstract intersperse(x: T): AbstractList<T>;

  /**
   * @summary Returns a new list which is built by mapping `f` across the current list.
   */
  public abstract map<U>(f: (x: T) => U): AbstractList<U>;

  /**
   * `[x_1, x_2, ..., x_n].mapAccum(f, init) = [accum_n, [y_1, y_2, ..., y_n]]`
   * where `[accum_1, y_1] = f(init, x_1)` and
   * `[accum_{n + 1}, y_{n + 1}] = f(accum_n, x_n)`
   * @summary This function acts like a joint @see [[map]] and @see [[reduce]].
   * @param f function which accumulates across the current list while building another list
   * @param init seed value for the accumulation
   */
  public abstract mapAccum<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, AbstractList<S>];

  /**
   * @summary Returns the element of the current list at the given index.
   * @param n index of the element to return
   */
  public abstract nth(n: number): Maybe<T>;

  /**
   * `xs.partition(pred) = [ys, zs]` where `pred` is true on
   * every element of `ys` and is false on every element of
   * `zs`.
   * @summary Returns copies of two sublists of the current list as determined by `pred`
   * @param pred
   */
  public abstract partition(
    pred: (x: T) => boolean
  ): [AbstractList<T>, AbstractList<T>];

  /**
   * @summary Returns a collection of all permutations of the current list.
   */
  public abstract permutations(): AbstractList<AbstractList<T>>;

  /**
   * @summary Returns a copy of the current list with the given element prepended.
   */
  public abstract prepend(elt: T): AbstractList<T>;

  /**
   * @summary Returns a copy of the current list with the first element equal to `elt` removed.
   * @param eq test for equality between the elements of the list and `elt`
   */
  public abstract removeBy(
    eq: (x: T, y: T) => boolean,
    elt: T
  ): AbstractList<T>;

  /**
   * @summary Returns a copy of the current list with the element at the given index replaced.
   * @param n index of the element to replace
   * @param elt value used to replace the removed element
   */
  public abstract replace(n: number, elt: T): AbstractList<T>;

  /**
   * @summary Returns a copy of the current list with elements reverse.
   */
  public abstract reverse(): AbstractList<T>;

  /**
   * This should be a stable sort.
   * @summary Returns a sorted copy of the current list.
   * @param ord ordering to use for sorting
   */
  public abstract sortOn(ord: Ordering<T>): AbstractList<T>;

  /**
   * `[x_0, x_1, ..., x_n].splitAt(k) = [[x_0, ..., x_{k-1}], [x_k, ..., x_n]]`
   * @summary Splits the current list into two at the given index.
   */
  public abstract splitAt(n: number): [AbstractList<T>, AbstractList<T>];

  /**
   * @summary Returns a list of all subsequences of the current list.
   */
  public abstract subsequences(): AbstractList<AbstractList<T>>;

  /**
   * @summary Returns a list of all suffixes of the current list.
   */
  public abstract tails(): AbstractList<AbstractList<T>>;

  /**
   * @summary Returns a copy of the prefix of given length from the current list.
   */
  public abstract take(n: number): AbstractList<T>;

  /**
   * `[x_1, x_2, ..., x_n].takeDropWhile(pred) = [[x_1, ..., x_k], [x_{k+1}, x_{n}]]`
   * where `pred` is true on all the elements of the first
   * list and false on `x_{k+1}`.
   * @summary Splits the current array into two: largest prefix on which `pred` is true, and the rest.
   */
  public abstract takeDropWhile(
    pred: (x: T) => boolean
  ): [AbstractList<T>, AbstractList<T>];

  /**
   * @summary Returns the longest prefix on which `pred` is true.
   */
  public abstract takeWhile(pred: (x: T) => boolean): AbstractList<T>;

  /**
   * @summary Converts to a standard Array.
   */
  public abstract toArray(): T[];

  // /**
  //  * @summary Converts any subclass to the base implementation.
  //  */
  // public abstract toList(): List<T>;

  /**
   * @summary Returns a list of elements of the current list with duplicates removed.
   * @param eq test for equality between elements
   */
  public abstract uniquesBy(eq: (x: T, y: T) => boolean): AbstractList<T>;

  /**
   * This ignores duplicates in `ys` but will keep any
   * duplicates of the current list.
   * @summary Returns the "set" union between the current list and the given list.
   * @param eq test for equality between elements
   */
  public abstract unionBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): AbstractList<T>;

  /**
   * @summary Returns true if and only if all elements are [truthy].
   */
  public allTruthy(): boolean {
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
  public difference(ys: AbstractList<T>): AbstractList<T> {
    return this.differenceBy(sameValueZero, ys);
  }

  /**
   * This implementation short-circuits immediately upon seeing
   * the first false.
   * @summary Returns true if and only if `pred` is true on all elements.
   */
  public every(pred: (x: T) => boolean): boolean {
    for (const x of this.toArray()) {
      if (!pred(x)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @summary Returns the first value on which `pred` is true, and ⊥ otherwise.
   */
  public find(pred: (x: T) => boolean): Maybe<T> {
    for (const x of this.toArray()) {
      if (pred(x)) {
        return x;
      }
    }
    return bottom;
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns a list formed partitions the current list according to `eq`.
   * @see [[groupBy]]
   */
  public group(): AbstractList<NonEmptyList<T>> {
    return this.groupBy(sameValueZero);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns true if and only if the given value equals that of some element.
   * @see [[hasBy]] @see [[includes]] @see [[includesBy]]
   */
  public has(elt: T): boolean {
    return this.hasBy(sameValueZero, elt);
  }

  /**
   * @summary Returns true if and only if the given value equals that of some element.
   * @param eq test for equality
   */
  public hasBy(eq: (x: T, y: T) => boolean, elt: T): boolean {
    for (const x of this.toArray()) {
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
  public includes(elt: T): boolean {
    return this.has(elt);
  }

  /**
   * @summary Returns true if and only if the given value equals that of some element.
   * @param eq test for equality
   * @see [[hasBy]] @see [[has]] @see [[includes]]
   */
  public includesBy(eq: (x: T, y: T) => boolean, elt: T): boolean {
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
  public intersect(ys: AbstractList<T>): AbstractList<T> {
    return this.intersectBy(sameValueZero, ys);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns true if and only if the current list is a "substring" of the given list.
   * @see [[isInfixOfBy]]
   */
  public isInfixOf(larger: AbstractList<T>): boolean {
    return this.isInfixOfBy(sameValueZero, larger);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns true if and only if the current list is a prefix of the given list.
   * @see [[isPrefixOfBy]]
   */
  public isPrefixOf(larger: AbstractList<T>): boolean {
    return this.isPrefixOfBy(sameValueZero, larger);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns true if and only if the current list is a subsequence of the given list.
   * @see [[isSubsequenceOfBy]]
   */
  public isSubsequenceOf(larger: AbstractList<T>): boolean {
    return this.isSubsequenceOfBy(sameValueZero, larger);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns true if and only if the current list is a suffix of the given list.
   * @see [[isSuffixOfBy]]
   */
  public isSuffixOf(larger: AbstractList<T>): boolean {
    return this.isSuffixOfBy(sameValueZero, larger);
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
  public mapAccumRight<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, AbstractList<S>] {
    return this.reverse().mapAccum(f, init);
  }

  /**
   * @summary Returns the largest element of the current list, or ⊥ when empty.
   * @param ord ordering to use on the elements
   */
  public max(ord: Ordering<T>): Maybe<T> {
    const hd = this.head;
    const maxFn = (x: T, y: T) => (ord(x, y) === 'LT' ? y : x);
    const hdFn = (x: T) => this.tail.reduce(maxFn, x);
    return bind(hdFn)(hd);
  }

  /**
   * @summary Returns the smallest element of the current list, or ⊥ when empty.
   * @param ord ordering to use on the elements
   */
  public min(ord: Ordering<T>): Maybe<T> {
    return this.max(flip(ord));
  }

  /**
   * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
   * where `y_1 := init` and `y_{k + 1} := f(y_k, x_k)`
   * @summary Reduces the current list with `f` using the seed value `init`.
   * @param f the function used to accumulate over the array
   * @param init the initial value for the accumulation
   * @see [[accumulate]]
   */
  public reduce<U>(f: (acc: U, elt: T) => U, init: U): U {
    let val = init;
    for (const x of this.toArray()) {
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
  public reduceRight<U>(f: (acc: U, elt: T) => U, init: U): U {
    let val = init;
    for (const x of this.reverse().toArray()) {
      val = f(val, x);
    }
    return val;
  }

  /**
   * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_1`
   * where `y_n := x_n` and `y_{k - 1} := f(y_k, x_{k - 1})`
   * @summary Reduces the current list with `f`, or returns ⊥ when empty.
   * @param f the function used to accumulate over the array
   * @see [[accumulateRightWith]]
   */
  public reduceRightWith(f: (acc: T, elt: T) => T): Maybe<T> {
    return this.reverse().reduceWith(f);
  }

  /**
   * `[x_1, x_2, ..., x_n].accumulate(f, init) = y_n`
   * where `y_1 := x_1` and `y_{k + 1} := f(y_k, x_{k + 1})`
   * @summary Reduces the current list with `f`, or returns ⊥ when empty.
   * @param f the function used to accumulate over the array
   * @see [[accumulateWith]]
   */
  public reduceWith(f: (acc: T, elt: T) => T): Maybe<T> {
    return bind<T, Maybe<T>>(hd => this.tail.reduce(f, hd))(this.head);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns a copy of the current list with the first occurence of the given value removed.
   * @see [[removeBy]]
   */
  public remove(elt: T): AbstractList<T> {
    return this.removeBy(sameValueZero, elt);
  }

  /**
   * This implementation short-circuits upon encountering the first true.
   * @summary Returns true if and only if `pred` is true on some element of the current list.
   */
  public some(pred: (x: T) => boolean): boolean {
    for (const x of this.toArray()) {
      if (pred(x)) {
        return true;
      }
    }
    return false;
  }

  /**
   * @summary Returns true if and only if some element is [truthy].
   */
  public someTruthy(): boolean {
    return this.some(Boolean);
  }

  /**
   * @summary Converts to a non-empty list, if possible, and ⊥ otherwise.
   */
  public toNonEmptyList(): Maybe<NonEmptyList<T>> {
    const fn: (hd: T) => NonEmptyList<T> = hd =>
      new NonEmptyList(hd, this.tail.toArray());
    return bind<T, NonEmptyList<T>>(fn)(this.head);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns a copy with duplicates removed.
   * @see [[uniquesBy]]
   */
  public uniques(): AbstractList<T> {
    return this.uniquesBy(sameValueZero);
  }

  /**
   * This ignores duplicates in `ys` but will keep any
   * duplicates of the current list.
   *
   * Here equality is [[SameValueZero]]
   * @summary Returns the "set" union between lists.
   * @see [[unionBy]]
   */
  public union(ys: AbstractList<T>): AbstractList<T> {
    return this.unionBy(sameValueZero, ys);
  }

  protected isSafeIndex(n: number): boolean {
    return isInteger(n) && n >= -0 && n < this.length;
  }
}

// import { List } from './List';
import { NonEmptyList } from './NonEmptyList';

/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 * [truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
 */
