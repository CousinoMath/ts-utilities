import { AbstractList } from './AbstractList';
import { curry, ident } from './Functions';
import { Maybe, maybe } from './Maybe';
import { NonEmptyList } from './NonEmptyList';
import { sameValueZero } from './Objects';
import { Ordering } from './Ordering';

export class List<T> extends AbstractList<T> {
  public static and(xs: List<boolean>): boolean {
    return xs.every(ident);
  }

  public static concat<A>(xss: Iterable<List<A>>): List<A> {
    const arr: A[] = [];
    for (const xs of xss) {
      arr.concat(...xs.arr);
    }
    return new List(arr);
  }

  public static itercalate<A>(sep: List<A>, items: List<List<A>>): List<A> {
    const len = items.length - 1;
    const arr: A[] = [];

    for (let i = 0; i < len; i++) {
      arr.concat(...items.arr[i].arr, ...sep.arr);
    }
    arr.concat(...maybe<List<A>, A[]>([], last => last.arr)(items.last));
    return new List(arr);
  }

  public static list<A, B>(
    nil: B,
    f: (accum: B, val: A) => B
  ): (xs: List<A>) => B {
    return xs => xs.reduce(f, nil);
  }

  public static or(xs: List<boolean>): boolean {
    return xs.some(ident);
  }

  public static range(start = 0, stop: number, step = 1): List<number> {
    const spread = stop - start;
    const len = step === 0 ? -1 : Math.floor(spread / step);
    if (!AbstractList.isSafeLength(len)) {
      throw new RangeError(
        'Invalid list length encountered in call to List.range'
      );
    }
    const arr: number[] = new Array(len);
    for (let i = 0; i <= len; i++) {
      arr.push(start + i * step);
    }
    return new List(arr);
  }

  public static repeat<A>(n: number, elt: A): List<A> {
    if (!AbstractList.isSafeLength(n)) {
      throw new RangeError(
        'Invalid list length encountered in a call to List.repeat'
      );
    }
    return new List(new Array(n).fill(elt));
  }

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

  public static zip<A, B>(xs: List<A>, ys: List<B>): List<[A, B]> {
    const arr: Array<[A, B]> = [];
    const len = Math.min(xs.length, ys.length);
    for (let i = 0; i < len; i++) {
      arr.push([xs.arr[i], ys.arr[i]]);
    }
    return new List(arr);
  }

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

  protected arr: T[] = [];

  constructor(arr: T[]) {
    super();
    this.arr = arr;
  }

  public get head(): Maybe<T> {
    return this.isEmpty ? null : this.arr[0];
  }

  public get isEmpty(): boolean {
    return this.arr.length === 0;
  }

  public get init(): List<T> {
    return new List(this.arr.slice(0, this.length - 1));
  }

  public get last(): Maybe<T> {
    return this.isEmpty ? null : this.arr[this.length - 1];
  }

  public get length(): number {
    return this.arr.length;
  }

  public get size(): number {
    return this.length;
  }

  public get tail(): List<T> {
    return new List(this.arr.slice(1));
  }

  public [Symbol.iterator](): Iterator<T> {
    const arr = this.arr.slice(0);
    return arr[Symbol.iterator]();
  }

  public [Symbol.toPrimitive](hint: string): T[] {
    return this.arr.slice(0);
  }

  public accumulate<U>(f: (acc: U, val: T) => U, init: U): List<U> {
    const arr = [init];
    let val = init;
    for (const x of this.arr) {
      val = f(val, x);
      arr.push(val);
    }
    return new List(arr);
  }

  public accumulateRight<U>(f: (acc: U, val: T) => U, init: U): List<U> {
    let val = init;
    const arr = [init];
    for (const x of this.reverse()) {
      val = f(val, x);
      arr.push(val);
    }
    return new List(arr);
  }

  public accumulateRightWith(f: (acc: T, val: T) => T): List<T> {
    return this.reverse().accumulateWith(f);
  }

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

  public append(elt: T): NonEmptyList<T> {
    const tl = this.arr.slice(0);
    tl.push(elt);
    const hd = tl[0];
    tl.shift();
    return new NonEmptyList(hd, tl);
  }

  public delete(n: number): List<T> {
    const arr = this.arr.slice(0);
    if (this.isSafeIndex(n)) {
      arr.splice(n, 1);
    }
    return new List(arr);
  }

  public difference(ys: AbstractList<T>): List<T> {
    return this.differenceBy(sameValueZero, ys);
  }

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

  public dropTailWhile(f: (x: T) => boolean): List<T> {
    const arr = this.arr.slice(0);
    let i = this.length - 1;
    while (i >= 0 && f(arr[i])) {
      arr.pop();
      i--;
    }
    return new List(arr);
  }

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

  public filter(f: (x: T) => boolean): List<T> {
    return new List(this.arr.filter(f));
  }

  public findIndex(f: (x: T) => boolean): Maybe<number> {
    const len = this.length;
    for (let i = 0; i < len; i++) {
      if (f(this.arr[i])) {
        return i;
      }
    }
    return null;
  }

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

  public flatMap<S>(f: (x: T) => AbstractList<S>): List<S> {
    const arr: S[] = [];
    for (const x of this.arr) {
      arr.concat(...f(x).toArray());
    }
    return new List(arr);
  }

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

  public inits(): List<List<T>> {
    const initArr: Array<List<T>> = [new List([])];
    const len = this.length;
    for (let i = 1; i < len; i++) {
      initArr.push(new List(this.arr.slice(0, i)));
    }
    return new List(initArr);
  }

  public insert(n: number, elt: T): NonEmptyList<T> {
    const arr = this.arr.slice(0);
    const len = this.length;
    if (this.isSafeIndex(n)) {
      arr.splice(n, 0, elt);
    }
    return new NonEmptyList(arr[0], arr.slice(1));
  }

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

  public intersperse(x: T): List<T> {
    const xs: T[] = [];
    for (const y of this.arr) {
      xs.push(y, x);
    }
    xs.pop();
    return new List(xs);
  }

  public map<U>(f: (x: T) => U): List<U> {
    return new List(this.arr.map(f));
  }

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

  public mapAccumRight<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, List<S>] {
    return this.reverse().mapAccum(f, init);
  }

  public nth(n: number): Maybe<T> {
    if (this.isSafeIndex(n)) {
      return this.arr[n];
    }
    return null;
  }

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

  public prepend(elt: T): NonEmptyList<T> {
    return new NonEmptyList(elt, this.arr);
  }

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

  public replace(n: number, elt: T): List<T> {
    const arr = this.arr.slice(0);
    if (this.isSafeIndex(n)) {
      arr[n] = elt;
    }
    return new List(arr);
  }

  public reverse(): List<T> {
    return new List(this.arr.slice(0).reverse());
  }

  public sortOn(ord: Ordering<T>): List<T> {
    const unsorted = [this.arr.slice(0)];
    const sorted: T[][] = [];

    while (unsorted.length > 0) {
      const arr = unsorted[0];
      const len = arr.length;
      unsorted.shift();
      if (len > 1) {
        const midIdx = Math.floor(len / 2);
        unsorted.push(arr.slice(0, midIdx));
        unsorted.push(arr.slice(midIdx));
      } else {
        sorted.push(arr);
      }
    }
    while (sorted.length > 1) {
      const arr1 = sorted[0];
      const arr2 = sorted[1];
      const arr: T[] = [];
      sorted.shift();
      sorted.shift();
      const len1 = arr1.length;
      const len2 = arr2.length;
      let i1 = 0;
      let i2 = 0;
      while (i1 < len1 && i2 < len2) {
        if (ord(arr1[i1], arr2[i2]) === 'GT') {
          arr.push(arr2[i2]);
          i2++;
        } else {
          arr.push(arr1[i1]);
          i1++;
        }
      }
      if (i1 === len1) {
        arr.push(...arr2.slice(i2));
      } else {
        arr.push(...arr1.slice(i1));
      }
      sorted.push(arr);
    }
    return new List(sorted[0]);
  }

  public splitAt(n: number): [List<T>, List<T>] {
    if (!this.isSafeIndex(n)) {
      return [new List(this.arr.slice(0)), new List([])];
    }
    const arr1 = this.arr.slice(0, n);
    const arr2 = this.arr.slice(n);
    return [new List(arr1), new List(arr2)];
  }

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

  public tails(): List<List<T>> {
    const tailArr: Array<List<T>> = [new List([])];
    const len = this.arr.length;
    for (let i = len - 1; i >= 0; i--) {
      tailArr.unshift(new List(this.arr.slice(i, len)));
    }
    return new List(tailArr);
  }

  public take(n: number): List<T> {
    return new List(this.arr.slice(n));
  }

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

  public toArray(): T[] {
    return this.arr.slice(0);
  }

  public toList(): List<T> {
    return new List(this.toArray());
  }

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

  public unionBy(eq: (x: T, y: T) => boolean, ys: AbstractList<T>): List<T> {
    const arr = this.arr.slice(0);
    const len = ys.length;
    for (let j = 0; j < len; j++) {
      const elt = ys.nth(j);
      if (elt != null && arr.findIndex(x => eq(x, elt)) < 0) {
        arr.push(elt);
      }
    }
    return new List(arr);
  }
}
