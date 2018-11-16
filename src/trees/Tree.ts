import { isNonNull, Maybe, Ordering } from '../internal';

  // tslint:disable max-classes-per-file
class BinaryTreeNode<T> {
  public readonly value: T;
  public left: Maybe<BinaryTreeNode<T>> = null;
  public right: Maybe<BinaryTreeNode<T>> = null;
  public parent: Maybe<BinaryTreeNode<T>> = null;

  constructor(val: T) {
    this.value = val;
  }
}

export class BinaryTree<T> {
  protected readonly order: Ordering<T>;
  protected readonly curr: BinaryTreeNode<T>;

  constructor(ord: Ordering<T>, value: T) {
    this.order = ord;
    this.curr = new BinaryTreeNode(value);
  }
}
