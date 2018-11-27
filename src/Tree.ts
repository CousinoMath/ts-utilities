import { List, Maybe } from './internal';

export class Tree<T> {
  protected node: T;
  protected children: List<Tree<T>> = new List();

  constructor(val: T) {
    this.node = val;
  }

  public get value(): T {
    return this.node;
  }

  public setValue(val: T): Tree<T> {
      const result = new Tree(val);
      result.children = this.children;
      return result;
  }

  public numberChildren(): number {
      return this.children.length;
  }

  public getChild(n: number): Maybe<Tree<T>> {
      return this.children.nth(n);
  }

  public appendChild(c: Tree<T>): Tree<T> {
      const result = new Tree(this.node);
      result.children = this.children.append(c);
      return result;
  }

  public prependChild(c: Tree<T>): Tree<T> {
      const result = new Tree(this.node);
      result.children = this.children.prepend(c);
      return result;
  }

  public concatChildren(cs: List<Tree<T>>): Tree<T> {
      const result = new Tree(this.node);
      result.children = List.concat(this.children, cs);
      return result;
  }
}
