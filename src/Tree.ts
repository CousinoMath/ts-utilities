import { List, Maybe } from './internal';

export class Tree<T> {
  public readonly node: T;
  public readonly children: List<Tree<T>> = new List();

  constructor(val: T, kids: List<Tree<T>>) {
    this.node = val;
    this.children = kids;
  }

  public get value(): T {
    return this.node;
  }

  public appendChild(c: Tree<T>): Tree<T> {
    return new Tree(this.node, this.children.append(c));
  }

  public concatChildren(...cs: Array<Tree<T>>): Tree<T> {
    return new Tree(this.node, List.concat(this.children, new List(cs)));
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
    return new Tree(this.node, this.children.prepend(c));
  }

  public setValue(val: T): Tree<T> {
    return new Tree(val, this.children);
  }
}
