import { AbstractList } from './AbstractList';
import { List } from './List';
import { Ordering } from './Ordering';

export class NonEmptyList<T> extends List<T> {
  private static make<A>(arr: A[]): NonEmptyList<A> {
    return new NonEmptyList(arr[0], arr.slice(1));
  }

  constructor(hd: T, tl: T[]) {
    super([hd, ...tl]);
  }

  public get isEmpty(): boolean {
    if (super.length === 0) {
      throw new Error('A non-empty list was found to be empty');
    }
    return false;
  }

  public get head(): T {
    return super.arr[0];
  }

  public get last(): T {
    return super.arr[super.length - 1];
  }

  public accumulate<U>(f: (acc: U, val: T) => U, init: U): NonEmptyList<U> {
    return NonEmptyList.make(super.accumulate(f, init).toArray());
  }

  public accumulateRight<U>(
    f: (acc: U, val: T) => U,
    init: U
  ): NonEmptyList<U> {
    return NonEmptyList.make(super.accumulateRight(f, init).toArray());
  }

  public accumulateRightWith(f: (acc: T, val: T) => T): NonEmptyList<T> {
    return NonEmptyList.make(super.accumulateRightWith(f).toArray());
  }

  public accumulateWith(f: (acc: T, val: T) => T): NonEmptyList<T> {
    return NonEmptyList.make(super.accumulateWith(f).toArray());
  }

  public group(): NonEmptyList<NonEmptyList<T>> {
    return NonEmptyList.make(super.group().toArray());
  }

  public groupBy(eq: (x: T, y: T) => boolean): NonEmptyList<NonEmptyList<T>> {
    return NonEmptyList.make(super.groupBy(eq).toArray());
  }

  public inits(): NonEmptyList<List<T>> {
    return NonEmptyList.make(super.inits().toArray());
  }

  public intersperse(x: T): NonEmptyList<T> {
    return NonEmptyList.make(super.intersperse(x).toArray());
  }

  public map<U>(f: (x: T) => U): NonEmptyList<U> {
    return NonEmptyList.make(super.map(f).toArray());
  }

  public mapAccum<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, NonEmptyList<S>] {
    const [val, xs] = super.mapAccum(f, init);
    return [val, NonEmptyList.make(xs.toArray())];
  }

  public mapAccumRight<R, S>(
    f: (accum: R, val: T) => [R, S],
    init: R
  ): [R, NonEmptyList<S>] {
    const [val, xs] = super.mapAccumRight(f, init);
    return [val, NonEmptyList.make(xs.toArray())];
  }

  public max(ord: Ordering<T>): T {
    const maxFn = (x: T, y: T) => (ord(x, y) === 'LT' ? y : x);
    return List.list(this.head, maxFn)(this.tail);
  }

  public min(ord: Ordering<T>): T {
    return this.max((x, y) => ord(y, x));
  }

  public permutations(): NonEmptyList<List<T>> {
    return NonEmptyList.make(super.permutations().toArray());
  }

  public reduceRightWith(f: (acc: T, elt: T) => T): T {
    return this.reverse().reduceWith(f);
  }

  public reduceWith(f: (acc: T, elt: T) => T): T {
    return super.arr.slice(1).reduce(f, this.head);
  }

  public replace(n: number, elt: T): NonEmptyList<T> {
    return NonEmptyList.make(super.replace(n, elt).toArray());
  }

  public reverse(): NonEmptyList<T> {
    return NonEmptyList.make(super.arr.slice(0).reverse());
  }

  public sortOn(ord: Ordering<T>): NonEmptyList<T> {
    return NonEmptyList.make(super.sortOn(ord).toArray());
  }

  public subsequences(): NonEmptyList<List<T>> {
    return NonEmptyList.make(super.subsequences().toArray());
  }

  public tails(): NonEmptyList<List<T>> {
    return NonEmptyList.make(super.tails().toArray());
  }

  public toList(): List<T> {
    return new List(super.arr);
  }

  public uniques(): NonEmptyList<T> {
    return NonEmptyList.make(super.uniques().toArray());
  }

  public uniquesBy(eq: (x: T, y: T) => boolean): NonEmptyList<T> {
    return NonEmptyList.make(super.uniquesBy(eq).toArray());
  }

  public union(ys: AbstractList<T>): NonEmptyList<T> {
    return NonEmptyList.make(super.union(ys).toArray());
  }

  public unionBy(
    eq: (x: T, y: T) => boolean,
    ys: AbstractList<T>
  ): NonEmptyList<T> {
    return NonEmptyList.make(super.unionBy(eq, ys).toArray());
  }
}
