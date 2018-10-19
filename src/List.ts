/**
 * Dissatisifed with Javascripts Arrays, Sets, and Maps, I decided to create
 * my own, and more typesafe, collections. This started with
 * the creation of the hierarchy AbstractList > List > NonEmptyList. These
 * lists are lightweight wrappers of arrays which are carefully crafted to be
 * used interchangable with arrays, and with each other.
 */

import { AbstractList } from './AbstractList';
import { curry, ident } from './Functions';
import { Maybe, maybe } from './Maybe';
import { NonEmptyList } from './NonEmptyList';
import { sameValueZero } from './Objects';
import { Ordering } from './Ordering';

/**
 * Basic array-backed list class
 */
export class List<T> extends AbstractList<T> {
  /**
   * @summary Joins a list of booleans together with `&&`, respecting short-circuiting.
   * @see [[or]]
   */
  public static and(xs: List<boolean>): boolean {
    return xs.every(ident);
  }

  /**
   * @summary Concatenates a collection of lists.
   */
  public static concat<A>(xss: Iterable<List<A>>): List<A> {
    const arr: A[] = [];
    for (const xs of xss) {
      arr.concat(...xs.arr);
    }
    return new List(arr);
  }

  /**
   * @summary Concatenates elements of `items` interspersed with `sep`.
   * @see [[intersperse]]
   */
  public static itercalate<A>(sep: List<A>, items: List<List<A>>): List<A> {
    const len = items.length - 1;
    const arr: A[] = [];

    for (let i = 0; i < len; i++) {
      arr.concat(...items.arr[i].arr, ...sep.arr);
    }
    arr.concat(...maybe<List<A>, A[]>([], last => last.arr)(items.last));
    return new List(arr);
  }

  /**
   * The inductive rule for lists.
   * @summary Creates a recursive function over lists.
   * @see [[reduce]]
   */
  public static list<A, B>(
    nil: B,
    f: (accum: B, val: A) => B
  ): (xs: List<A>) => B {
    return xs => xs.reduce(f, nil);
  }

  /**
   * @summary Joins together a list of booleans with `||`, respects short-circuiting
   * @see [[and]]
   */
  public static or(xs: List<boolean>): boolean {
    return xs.some(ident);
  }

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
  public static range(start = 0, stop: number, step = 1): List<number> {
    if (typeof stop === 'undefined') {
      stop = start - 1;
      start = 0;
    }
    const spread = stop - start + 1;
    const len = Math.abs(step) === 0 ? -1 : Math.floor(spread / step);
    if (!AbstractList.isSafeLength(len)) {
      throw new RangeError(
        'Invalid list length encountered in call to List.range'
      );
    }
    const arr: number[] = new Array(len);
    for (let i = 0; i < len; i++) {
      arr.push(start + i * step);
    }
    return new List(arr);
  }

  /**
   * @summary Returns a list of given length populated with the given value.
   */
  public static repeat<A>(n: number, elt: A): List<A> {
    if (!AbstractList.isSafeLength(n)) {
      throw new RangeError(
        'Invalid list length encountered in a call to List.repeat'
      );
    }
    return new List(new Array(n).fill(elt));
  }

  /**
   * @summary Unzips a list of tuples into a tuple of lists.
   * @see [[zip]]
   */
  public static unzip<A, B>(xys: List<[A, B]>): [List<A>, List<B>] {
    const len = xys.length;
    const arrA = new Array<A>(len);
    const arrB = new Array<B>(len);
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
  public static zip<A, B>(xs: List<A>, ys: List<B>): List<[A, B]> {
    const arr: Array<[A, B]> = [];
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
  public static zipWith<A, B, C>(
    f: (x: A, y: B) => C,
    xs: List<A>,
    ys: List<B>
  ): List<C> {
    const arr: C[] = [];
    const len = Math.min(xs.length, ys.length);
    for (let i = 0; i < len; i++) {
      arr.push(f(xs.arr[i], ys.arr[i]));
    }
    return new List(arr);
  }

  /**
   * The array behind this implementation.
   */
  protected arr: T[] = [];

  constructor(arr: T[]) {
    super();
    this.arr = arr;
  }

  /**
   * @summary Returns the first element of the list, if it exists, and null otherwise.
   * @see [[AbstractList.head]]
   * @see [[tail]]
   */
  public get head(): Maybe<T> {
    return this.isEmpty ? null : this.arr[0];
  }

  /**
   * @summary Returns true if and only if the list is empty.
   * @see [[AbstractList.isEmpty]]
   */
  public get isEmpty(): boolean {
    return this.arr.length === 0;
  }

  /**
   * @summary Returns a copy of the list with the last element removed.
   * @see [[AbstractList.init]]
   */
  public get init(): List<T> {
    return new List(this.arr.slice(0, this.length - 1));
  }

  /**
   * @summary Returns the last element of the list, if it exists, and null otherwise.
   * @see [[AbstractList.last]]
   */
  public get last(): Maybe<T> {
    return this.isEmpty ? null : this.arr[this.length - 1];
  }

  /**
   * @summary Returns the number of elements in the list, its length or size.
   * @see [[size]]
   * @see [[AbstractList.length]]
   */
  public get length(): number {
    return this.arr.length;
  }

  /**
   * @summary Returns the number of elements in the list, its length or size.
   * @see [[length]]
   * @see [[AbstractList.size]]
   */
  public get size(): number {
    return this.length;
  }

  /**
   * @summary Returns a copy of the list with the first element removed.
   * @see [[init]]
   * @see [[AbstractList.tail]]
   */
  public get tail(): List<T> {
    return new List(this.arr.slice(1));
  }

  /**
   * Allows lists to be iterated over in `for of` loops and spread/rest
   * syntax.
   */
  public [Symbol.iterator](): Iterator<T> {
    const arr = this.arr.slice(0);
    return arr[Symbol.iterator]();
  }

  /**
   * Always converts to an array.
   */
  public [Symbol.toPrimitive](hint: string): T[] {
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
  public accumulate<U>(f: (acc: U, val: T) => U, init: U): List<U> {
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
  public accumulateRight<U>(f: (acc: U, val: T) => U, init: U): List<U> {
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
  public accumulateRightWith(f: (acc: T, val: T) => T): List<T> {
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
  public accumulateWith(f: (acc: T, val: T) => T): List<T> {
    const arr: T[] = [];
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
  public append(elt: T): NonEmptyList<T> {
    const tl = this.arr.slice(0);
    tl.push(elt);
    const hd = tl[0];
    tl.shift();
    return new NonEmptyList(hd, tl);
  }

  /**
   * @summary Returns a copy of the list with the element at the given index removed.
   * @param n index of element to be removed
   * @see [[AbstractList.delete]]
   */
  public delete(n: number): List<T> {
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
  public difference(ys: AbstractList<T>): List<T> {
    return this.differenceBy(sameValueZero, ys);
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
  public differenceBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): List<T> {
    const arr: T[] = this.arr.slice(0);
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
  public drop(n: number): List<T> {
    if (Number.isInteger(n)) {
      const lastIdx = this.length - 1;
      if (n >= 0) {
        if (n > lastIdx) {
          return new List([]);
        }
        return new List(this.arr.slice(n, lastIdx));
      } else {
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
  public dropTailWhile(f: (x: T) => boolean): List<T> {
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
  public dropWhile(f: (x: T) => boolean): List<T> {
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
  public filter(f: (x: T) => boolean): List<T> {
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
  public findIndex(f: (x: T) => boolean): Maybe<number> {
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
  public findIndices(f: (x: T) => boolean): List<number> {
    const arr: number[] = [];
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
  public flatMap<S>(f: (x: T) => AbstractList<S>): List<S> {
    const arr: S[] = [];
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
  public group(): List<NonEmptyList<T>> {
    return this.groupBy(sameValueZero);
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
  public groupBy(eq: (x: T, y: T) => boolean): List<NonEmptyList<T>> {
    const groups: Array<NonEmptyList<T>> = [];
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
        groups.push(new NonEmptyList(elt, []));
      }
    }
    return new List(groups);
  }

  /**
   * @summary Returns a list of all prefixes of the current list.
   * @see [[tails]]
   * @see [[AbstractList.inits]]
   */
  public inits(): List<List<T>> {
    const initArr: Array<List<T>> = [new List([])];
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
  public insert(n: number, elt: T): NonEmptyList<T> {
    const arr = this.arr.slice(0);
    const len = this.length;
    if (this.isSafeIndex(n)) {
      arr.splice(n, 0, elt);
    }
    return new NonEmptyList(arr[0], arr.slice(1));
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
  public intersect(ys: AbstractList<T>): List<T> {
    return this.intersectBy(sameValueZero, ys);
  }

  /**
   * An element of `xs.intersectBy(eq, ys)` can repeat but
   * will only appear as many times it occurs in `xs` or
   * `ys`, whichever is smaller.
   * @summary Returns the "set" intersection between two lists.
   * @param eq test for equality between elements of the lists.
   * @see [[AbstractList.intersectBy]]
   */
  public intersectBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): List<T> {
    const arr: T[] = [];
    if (this.length < ys.length) {
      for (const x of this.arr) {
        if (ys.hasBy(eq, x)) {
          arr.push(x);
        }
      }
    } else {
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
  public intersperse(x: T): List<T> {
    const xs: T[] = [];
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
  public isInfixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean {
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
  public isPrefixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean {
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
  public isSubsequenceOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean {
    const len = this.length;
    const largerLen = larger.length;
    if (len > largerLen) {
      return false;
    }
    for (let largerIdx = 0; len + largerIdx <= largerLen; largerIdx++) {
      let thisIdx = 0;
      for (
        let largerOffset = 0;
        thisIdx < len && largerIdx + largerOffset < largerLen;
        largerOffset++
      ) {
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
  public isSuffixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean {
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
  public map<U>(f: (x: T) => U): List<U> {
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
  public mapAccum<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, List<S>] {
    let val = init;
    const arr: S[] = [];
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
  public mapAccumRight<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, List<S>] {
    return this.reverse().mapAccum(f, init);
  }

  /**
   * @summary Returns the element of the current list at the given index.
   * @param n index of the element to return
   * @see [[AbstractList.nth]]
   */
  public nth(n: number): Maybe<T> {
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
  public partition(f: (x: T) => boolean): [List<T>, List<T>] {
    const trues: T[] = [];
    const falses: T[] = [];
    for (const x of this.arr) {
      if (f(x)) {
        trues.push(x);
      } else {
        falses.push(x);
      }
    }
    return [new List(trues), new List(falses)];
  }

  /**
   * @summary Returns a collection of all permutations of the current list.
   * @see [[AbstractList.permutations]]
   */
  public permutations(): List<List<T>> {
    let perms: Array<List<T>> = [new List([])];
    const stack = this.arr.slice(0);

    while (stack.length > 0) {
      const elt = stack[stack.length - 1];
      stack.pop();
      const results: Array<List<T>> = [];
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
  public prepend(elt: T): NonEmptyList<T> {
    return new NonEmptyList(elt, this.arr);
  }

  /**
   * Here equality is [[SameValueZero]]
   * @summary Returns a copy of the current list with the first occurence of the given value removed.
   * @see [[removeBy]]
   * @see [[AbstractList.remove]]
   */
  public remove(elt: T): List<T> {
    return this.removeBy(sameValueZero, elt);
  }
  /**
   * @summary Returns a copy of the current list with the first element equal to `elt` removed.
   * @param eq test for equality between the elements of the list and `elt`
   * @see [[AbstractList.removeBy]]
   */
  public removeBy(eq: (x: T, y: T) => boolean, elt: T): List<T> {
    const arr: T[] = this.arr.slice(0);
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
  public replace(n: number, elt: T): List<T> {
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
  public reverse(): List<T> {
    return new List(this.arr.slice(0).reverse());
  }

  /**
   * This should be a stable sort.
   * @summary Returns a sorted copy of the current list.
   * @param ord ordering to use for sorting
   * @see [[AbstractList.sortOn]]
   */
  public sortOn(ord: Ordering<T>): List<T> {
    function merge(ys1: T[], ys2: T[]): T[] {
      // PRE: ys1 and ys2 are sorted
      // POST: returns the merge of ys1 and ys2
      const len1 = ys1.length;
      const len2 = ys2.length;
      let i1 = 0;
      let i2 = 0;
      const ys: T[] = [];

      while (i1 < len1 && i2 < len2) {
        if (ord(ys1[i1], ys2[i2]) === 'GT') {
          ys.push(ys2[i2]);
          i2++;
        } else {
          ys.push(ys1[i1]);
          i1++;
        }
      }
      if (i1 === len1) {
        ys.push(...ys2.slice(i2));
      } else {
        ys.push(...ys1.slice(i1));
      }
      return ys;
    }

    let sorted: T[][] = this.arr.map(x => [x]);
    let results = [];
    let sortLen = this.length;
    while (sortLen > 1) {
      if (sortLen % 2 === 1) {
        const ys1 = sorted.pop();
        const ys2 = sorted.pop();
        if (typeof ys1 !== 'undefined' && typeof ys2 !== 'undefined') {
          sorted.push(merge(ys1, ys2));
        }
        sortLen--;
      }
      while (sorted.length > 1) {
        const ys1 = sorted.shift();
        const ys2 = sorted.shift();
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
  }

  /**
   * `[x_0, x_1, ..., x_n].splitAt(k) = [[x_0, ..., x_{k-1}], [x_k, ..., x_n]]`
   * @summary Splits the current list into two at the given index.
   * @see [[AbstractList.splitAt]]
   */
  public splitAt(n: number): [List<T>, List<T>] {
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
  public subsequences(): List<List<T>> {
    let subseqs: Array<List<T>> = [new List([])];
    const len = this.length;
    if (!AbstractList.isSafeLength(Math.pow(2, len))) {
      throw new RangeError(
        'Invalid list length encountered in call to List.prototype.subsequences'
      );
    }
    for (let i = 0; i < len; i--) {
      const elt = this.arr[i];
      const results: Array<List<T>> = new Array(2 * subseqs.length);
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
  public tails(): List<List<T>> {
    const tailArr: Array<List<T>> = [new List([])];
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
  public take(n: number): List<T> {
    return new List(this.arr.slice(n));
  }

  /**
   * `[x_1, x_2, ..., x_n].takeDropWhile(pred) = [[x_1, ..., x_k], [x_{k+1}, x_{n}]]`
   * where `pred` is true on all the elements of the first
   * list and false on `x_{k+1}`.
   * @summary Splits the current array into two: largest prefix on which `pred` is true, and the rest.
   * @see [[AbstractList.takeDropWhile]]
   */
  public takeDropWhile(f: (x: T) => boolean): [List<T>, List<T>] {
    const prefix: T[] = [];
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
  public takeWhile(f: (x: T) => boolean): List<T> {
    const arr: T[] = [];
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
  public toArray(): T[] {
    return this.arr.slice(0);
  }

  /**
   * @summary Converts any subclass to the base implementation.
   * @see [[AbstractList.toList]]
   */
  public toList(): List<T> {
    return new List(this.toArray());
  }

  /**
   * Here equality is [SameValueZero]
   * @summary Returns a copy with duplicates removed.
   * @see [[uniquesBy]]
   * @see [[AbstractList.uniques]]
   */
  public uniques(): List<T> {
    return this.uniquesBy(sameValueZero);
  }

  /**
   * @summary Returns a list of elements of the current list with duplicates removed.
   * @param eq test for equality between elements
   * @see [[AbstractList.uniquesBy]]
   */
  public uniquesBy(eq: (x: T, y: T) => boolean): List<T> {
    const len = this.length;
    const eqCurried = curry(eq);
    const arr: T[] = [];
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
  public union(ys: AbstractList<T>): List<T> {
    return this.unionBy(sameValueZero, ys);
  }

  /**
   * This ignores duplicates in `ys` but will keep any
   * duplicates of the current list.
   * @summary Returns the "set" union between the current list and the given list.
   * @param eq test for equality between elements
   * @see [[AbstractList.unionBy]]
   */
  public unionBy(eq: (x: T, y: T) => boolean, ys: AbstractList<T>): List<T> {
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

/**
 * [SameValueZero]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality).
 */
