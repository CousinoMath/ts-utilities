import { List, Maybe } from './internal';

export class Tree<T> {
  public node: T;
  public children: List<Tree<T>> = new List();

  constructor(val: T) {
    this.node = val;
  }

  public get value(): T {
    return this.node;
  }

  public appendChild(c: Tree<T>): Tree<T> {
    const result = new Tree(this.node);
    result.children = this.children.append(c);
    return result;
  }

  public concatChildren(...cs: Array<Tree<T>>): Tree<T> {
    const result = new Tree(this.node);
    result.children = List.concat(this.children, new List(cs));
    return result;
  }

  public getChild(n: number): Maybe<Tree<T>> {
    return this.children.nth(n);
  }

  public hasChildren(): boolean {
      return !this.children.isEmpty();
  }

  public isLeaf(): boolean {
      return !this.hasChildren();
  }

  public numChildren(): number {
    return this.children.length;
  }

  public prependChild(c: Tree<T>): Tree<T> {
    const result = new Tree(this.node);
    result.children = this.children.prepend(c);
    return result;
  }

  public setValue(val: T): Tree<T> {
    const result = new Tree(val);
    result.children = this.children;
    return result;
  }
}
