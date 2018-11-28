import { List, Maybe } from './internal';

export class ListWalker<T> {
  public static fromArray<A>(xs: A[]): ListWalker<A> {
    const result = new ListWalker<A>(new List(xs), new List());
    return result;
  }

  public static fromList<A>(xs: List<A>): ListWalker<A> {
    const result = new ListWalker<A>(xs, new List());
    return result;
  }

  public readonly ahead: List<T> = new List<T>();
  public readonly behind: List<T> = new List<T>();

  constructor(x1: List<T>, x2: List<T>) {
    this.ahead = x1;
    this.behind = x2;
  }

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
    return new ListWalker<T>(this.ahead.prepend(x), this.behind);
  }

  public isEmpty(): boolean {
    return this.ahead.isEmpty() && this.behind.isEmpty();
  }

  public moveAhead(): ListWalker<T> {
    if (this.canMoveAhead()) {
      return new ListWalker<T>(
        this.ahead.tail(),
        this.behind.prepend(this.ahead.head!)
      );
    } else {
      return this;
    }
  }

  public moveBehind(): ListWalker<T> {
    if (this.canMoveBehind()) {
      return new ListWalker<T>(
        this.ahead.prepend(this.behind.head!),
        this.behind.tail()
      );
    } else {
      return this;
    }
  }

  public moveToBack(): ListWalker<T> {
    return new ListWalker<T>(
      new List(),
      List.concat(this.ahead.reverse(), this.behind)
    );
  }

  public moveToFirst(): ListWalker<T> {
    return this.moveToFront();
  }

  public moveToFront(): ListWalker<T> {
    return new ListWalker<T>(
      List.concat(this.behind.reverse(), this.ahead),
      new List()
    );
  }

  public moveToLast(): ListWalker<T> {
    return this.moveToBack().moveBehind();
  }

  public removeAhead(): ListWalker<T> {
    return  new ListWalker<T>(this.ahead.tail(), this.behind);
  }

  public toList(): List<T> {
    return List.concat(this.behind.reverse(), this.ahead);
  }
}
