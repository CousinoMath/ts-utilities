import { List, Maybe } from './internal';

export class ListWalker<T> {
  public static fromArray<A>(xs: A[]): ListWalker<A> {
    const result = new ListWalker<A>();
    result.ahead = new List(xs);
    return result;
  }

  public static fromList<A>(xs: List<A>): ListWalker<A> {
    const result = new ListWalker<A>();
    result.ahead = xs;
    return result;
  }

  public ahead: List<T> = new List<T>();
  public behind: List<T> = new List<T>();

  public get current(): Maybe<T> {
    return this.ahead.head;
  }

  public get length(): number {
    return this.ahead.length + this.behind.length;
  }

  public canMoveAhead(): boolean {
    return !this.ahead.isEmpty();
  }

  public canMoveBehind(): boolean {
    return !this.behind.isEmpty();
  }

  public hasMoreAhead(): boolean {
    return this.ahead.length > 1;
  }

  public hasMoreBehind(): boolean {
    return this.behind.length > 0;
  }

  public insertAhead(x: T): ListWalker<T> {
    const result = new ListWalker<T>();
    result.ahead = this.ahead.prepend(x);
    result.behind = this.behind;
    return result;
  }

  public isEmpty(): boolean {
    return this.ahead.isEmpty() && this.behind.isEmpty();
  }

  public moveAhead(): ListWalker<T> {
    if (this.canMoveAhead()) {
      const result = new ListWalker<T>();
      result.ahead = this.ahead.tail();
      result.behind = this.behind.prepend(this.ahead.head!);
      return result;
    } else {
      return this;
    }
  }

  public moveBehind(): ListWalker<T> {
    if (this.canMoveBehind()) {
      const result = new ListWalker<T>();
      result.ahead = this.ahead.prepend(this.behind.head!);
      result.behind = this.behind.tail();
      return result;
    } else {
      return this;
    }
  }

  public moveToBack(): ListWalker<T> {
    const result = new ListWalker<T>();
    result.ahead = new List();
    result.behind = List.concat(this.ahead.reverse(), this.behind);
    return result;
  }

  public moveToFirst(): ListWalker<T> {
    return this.moveToFront();
  }

  public moveToFront(): ListWalker<T> {
    const result = new ListWalker<T>();
    result.ahead = List.concat(this.behind.reverse(), this.ahead);
    result.behind = new List();
    return result;
  }

  public moveToLast(): ListWalker<T> {
    return this.moveToBack().moveBehind();
  }

  public removeAhead(): ListWalker<T> {
    const result = new ListWalker<T>();
    result.ahead = this.ahead.tail();
    result.behind = this.behind;
    return result;
  }

  public toList(): List<T> {
    return List.concat(this.behind.reverse(), this.ahead);
  }
}
