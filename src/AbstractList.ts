import { List } from './List';
import { Maybe, maybe } from './Maybe';
import { NonEmptyList } from './NonEmptyList';
import { sameValueZero } from './Objects';
import { Ordering } from './Ordering';

export abstract class AbstractList<T> implements Iterable<T> {
  protected static isSafeLength(n: number): boolean {
    return Number.isInteger(n) && n >= 0 && Math.log2(n) < 32;
  }

  protected arr: T[] = [];

  public abstract get isEmpty(): boolean;
  public abstract get init(): AbstractList<T>;
  public abstract get head(): Maybe<T>;
  public abstract get last(): Maybe<T>;
  public abstract get length(): number;
  public abstract get size(): number;
  public abstract get tail(): AbstractList<T>;
  public abstract [Symbol.iterator](): Iterator<T>;
  public abstract [Symbol.toPrimitive](hint: string): T[];
  public abstract accumulate<U>(
    f: (acc: U, val: T) => U,
    init: U
  ): AbstractList<U>;
  public abstract accumulateRight<U>(
    f: (acc: U, val: T) => U,
    init: U
  ): AbstractList<U>;
  public abstract accumulateRightWith(
    f: (acc: T, val: T) => T
  ): AbstractList<T>;
  public abstract accumulateWith(f: (acc: T, val: T) => T): AbstractList<T>;
  public abstract append(elt: T): AbstractList<T>;
  public abstract delete(n: number): AbstractList<T>;
  public abstract difference(ys: AbstractList<T>): AbstractList<T>;
  public abstract differenceBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): AbstractList<T>;
  public abstract drop(n: number): AbstractList<T>;
  public abstract dropTailWhile(f: (x: T) => boolean): AbstractList<T>;
  public abstract dropWhile(f: (x: T) => boolean): AbstractList<T>;
  public abstract filter(f: (x: T) => boolean): AbstractList<T>;
  public abstract findIndex(f: (x: T) => boolean): Maybe<number>;
  public abstract findIndices(f: (x: T) => boolean): List<number>;
  public abstract flatMap<U>(f: (x: T) => AbstractList<U>): AbstractList<U>;
  public abstract groupBy(
    eq: (x: T, y: T) => boolean
  ): AbstractList<NonEmptyList<T>>;
  public abstract inits(): AbstractList<AbstractList<T>>;
  public abstract insert(n: number, elt: T): AbstractList<T>;
  public abstract isInfixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;
  public abstract isPrefixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;
  public abstract isSubsequenceOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;
  public abstract isSuffixOfBy(
    eq: (x: T, y: T) => boolean,
    larger: AbstractList<T>
  ): boolean;
  public abstract intersectBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): AbstractList<T>;
  public abstract intersperse(x: T): AbstractList<T>;
  public abstract map<U>(f: (x: T) => U): AbstractList<U>;
  public abstract mapAccum<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, AbstractList<S>];
  public abstract nth(n: number): Maybe<T>;
  public abstract partition(
    f: (x: T) => boolean
  ): [AbstractList<T>, AbstractList<T>];
  public abstract permutations(): AbstractList<AbstractList<T>>;
  public abstract prepend(elt: T): AbstractList<T>;
  public abstract removeBy(
    eq: (x: T, y: T) => boolean,
    elt: T
  ): AbstractList<T>;
  public abstract replace(n: number, elt: T): AbstractList<T>;
  public abstract reverse(): List<T>;
  public abstract sortOn(ord: Ordering<T>): AbstractList<T>;
  public abstract splitAt(n: number): [AbstractList<T>, AbstractList<T>];
  public abstract subsequences(): AbstractList<AbstractList<T>>;
  public abstract tails(): AbstractList<AbstractList<T>>;
  public abstract take(n: number): AbstractList<T>;
  public abstract takeDropWhile(
    f: (x: T) => boolean
  ): [AbstractList<T>, AbstractList<T>];
  public abstract takeWhile(f: (x: T) => boolean): AbstractList<T>;
  public abstract toList(): List<T>;
  public abstract uniquesBy(eq: (x: T, y: T) => boolean): AbstractList<T>;
  public abstract unionBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): AbstractList<T>;

  public allTruthy(): boolean {
    return this.every(Boolean);
  }

  public every(pred: (x: T) => boolean): boolean {
    for (const x of this) {
      if (!pred(x)) {
        return false;
      }
    }
    return true;
  }

  public find(f: (x: T) => boolean): Maybe<T> {
    for (const x of this) {
      if (f(x)) {
        return x;
      }
    }
    return null;
  }

  public group(): AbstractList<NonEmptyList<T>> {
    return this.groupBy(sameValueZero);
  }
  public has(elt: T): boolean {
    return this.hasBy(sameValueZero, elt);
  }

  public hasBy(eq: (x: T, y: T) => boolean, elt: T): boolean {
    for (const x of this) {
      if (eq(x, elt)) {
        return true;
      }
    }
    return false;
  }

  public includes(elt: T): boolean {
    return this.has(elt);
  }

  public includesBy(eq: (x: T, y: T) => boolean, elt: T): boolean {
    return this.hasBy(eq, elt);
  }

  public isInfixOf(larger: AbstractList<T>): boolean {
    return this.isInfixOfBy(sameValueZero, larger);
  }

  public isPrefixOf(larger: AbstractList<T>): boolean {
    return this.isPrefixOfBy(sameValueZero, larger);
  }

  public isSubsequenceOf(larger: AbstractList<T>): boolean {
    return this.isSubsequenceOfBy(sameValueZero, larger);
  }

  public isSuffixOf(larger: AbstractList<T>): boolean {
    return this.isSuffixOfBy(sameValueZero, larger);
  }

  public intersect(ys: AbstractList<T>): AbstractList<T> {
    return this.intersectBy(sameValueZero, ys);
  }
  public mapAccumRight<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, AbstractList<S>] {
    return this.reverse().mapAccum(f, init);
  }

  public max(ord: Ordering<T>): Maybe<T> {
    const hd = this.head;
    const maxFn = (x: T, y: T) => (ord(x, y) === 'LT' ? y : x);
    const hdFn = (x: T) => this.tail.reduce(maxFn, x);
    return maybe(null, hdFn)(hd);
  }

  public min(ord: Ordering<T>): Maybe<T> {
    return this.max((y, x) => ord(x, y));
  }

  public reduce<U>(f: (acc: U, elt: T) => U, init: U): U {
    let val = init;
    for (const x of this) {
      val = f(val, x);
    }
    return val;
  }

  public reduceRight<U>(f: (acc: U, elt: T) => U, init: U): U {
    let val = init;
    for (const x of this.reverse()) {
      val = f(val, x);
    }
    return val;
  }

  public reduceRightWith(f: (acc: T, elt: T) => T): Maybe<T> {
    return this.reverse().reduceWith(f);
  }

  public reduceWith(f: (acc: T, elt: T) => T): Maybe<T> {
    return maybe<T, Maybe<T>>(null, hd => this.tail.reduce(f, hd))(this.head);
  }

  public remove(elt: T): AbstractList<T> {
    return this.removeBy(sameValueZero, elt);
  }

  public some(pred: (x: T) => boolean): boolean {
    for (const x of this) {
      if (pred(x)) {
        return true;
      }
    }
    return false;
  }

  public someTruthy(): boolean {
    return this.some(Boolean);
  }

  public toArray(): T[] {
    return [...this];
  }

  public uniques(): AbstractList<T> {
    return this.uniquesBy(sameValueZero);
  }

  public union(ys: AbstractList<T>): AbstractList<T> {
    return this.unionBy(sameValueZero, ys);
  }

  protected isSafeIndex(n: number): boolean {
    return Number.isInteger(n) && n >= 0 && n < this.length;
  }
}
