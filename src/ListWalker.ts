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

  protected ahead: List<T> = new List<T>();
  protected behind: List<T> = new List<T>();

  public get current(): Maybe<T> {
    return this.ahead.head;
  }

  public get length(): number {
    return this.ahead.length + this.behind.length;
  }

  public hasMoreAhead(): boolean {
    return this.ahead.length > 1;
  }

  public hasMoreBehind(): boolean {
    return !this.behind.isEmpty();
  }

  public isEmpty(): boolean {
    return this.ahead.isEmpty() && this.behind.isEmpty();
  }

  public moveAhead(): ListWalker<T> {
    if (this.hasMoreAhead()) {
      const result = new ListWalker<T>();
      result.ahead = this.ahead.tail();
      result.behind = this.behind.prepend(this.ahead.head!);
      return result;
    } else {
      return this;
    }
  }

  public moveBehind(): ListWalker<T> {
    if (this.hasMoreBehind()) {
      const result = new ListWalker<T>();
      result.ahead = this.ahead.prepend(this.behind.head!);
      result.behind = this.behind.tail();
      return result;
    } else {
      return this;
    }
  }
}
