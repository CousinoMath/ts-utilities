import { bottom, isNonNull, isNull, Maybe, Ordering } from '../internal';

// tslint:disable no-this-assignment max-classes-per-file
export class BinaryTreeNode<T> {
  public readonly value: T;
  public left: Maybe<BinaryTreeNode<T>> = bottom;
  public right: Maybe<BinaryTreeNode<T>> = bottom;
  public parent: Maybe<BinaryTreeNode<T>> = bottom;

  constructor(value: T) {
    this.value = value;
  }

  public cloneToRoot(val = this.value): BinaryTreeNode<T> {
    const self = new BinaryTreeNode(val);
    self.left = this.left;
    self.right = this.right;
    const oldParent = this.parent;
    if (isNonNull(oldParent)) {
      self.parent = oldParent.cloneToRoot(oldParent.value);
      if (this === oldParent.left) {
        self.parent.left = self;
      } else {
        self.parent.right = self;
      }
      return self;
    }
    return self;
  }

  public maximum(): BinaryTreeNode<T> {
    let curr: BinaryTreeNode<T> = this;
    while (isNonNull(curr.right)) {
      curr = curr.right;
    }
    return curr;
  }

  public minimum(): BinaryTreeNode<T> {
    let curr: BinaryTreeNode<T> = this;
    while (isNonNull(curr.left)) {
      curr = curr.left;
    }
    return curr;
  }

  public predecessor(): Maybe<BinaryTreeNode<T>> {
    let curr: Maybe<BinaryTreeNode<T>> = this;
    if (isNull(curr)) {
      return bottom;
    }
    if (isNonNull(curr.left)) {
      return curr.left.maximum();
    }
    let parent = curr.parent;
    while (isNonNull(parent) && curr === parent.left) {
      curr = parent;
      parent = parent.parent;
    }
    return parent;
  }

  public get root(): BinaryTreeNode<T> {
    let curr: BinaryTreeNode<T> = this;
    while (isNonNull(curr.parent)) {
      curr = curr.parent;
    }
    return curr;
  }

  public successor(): Maybe<BinaryTreeNode<T>> {
    let curr: Maybe<BinaryTreeNode<T>> = this;
    if (isNull(curr)) {
      return bottom;
    }
    if (isNonNull(curr.right)) {
      return curr.right.minimum();
    }
    let parent = curr.parent;
    while (isNonNull(parent) && curr === parent.right) {
      curr = parent;
      parent = parent.parent;
    }
    return parent;
  }

  public toDebugString(): string {
    const leftStr = isNonNull(this.left) ? ' ' + this.left.toDebugString() : '';
    const rightStr = isNonNull(this.right)
      ? ' ' + this.right.toDebugString()
      : '';
    return `(${this.value}${leftStr}${rightStr})`;
  }
}

export class BinaryTree<T> {
  public root: Maybe<BinaryTreeNode<T>> = bottom;
  protected readonly order: Ordering<T>;

  constructor(ord: Ordering<T>) {
    this.order = ord;
  }

  public insert(z: T): BinaryTree<T> {
    let oldCurr = this.root; // current node in search
    let oldParent: Maybe<BinaryTreeNode<T>> = bottom; // parent of current node
    const result = new BinaryTree<T>(this.order); // resulting tree returned
    while (isNonNull(oldCurr)) {
      /* Invariants:
       *   - parent === bottom || parent.value !== z
       */
      oldParent = oldCurr;
      switch (this.order(z, oldCurr.value)) {
        case 'LT':
          // move search along left branch
          oldCurr = oldCurr.left;
          continue;
        case 'GT':
          // move search along right branch
          oldCurr = oldCurr.right;
          continue;
        case 'EQ':
          // found our target to clone
          result.root = oldCurr.cloneToRoot(z).root;
          return result;
      }
    } // Found no match in the tree, creating a new node
    const node = new BinaryTreeNode<T>(z);
    if (isNull(oldParent)) {
      // tree is empty
      result.root = node;
    } else {
      // tree is non-empty, parent is non-null leaf
      node.parent = oldParent.cloneToRoot(oldParent.value);
      if (this.order(z, oldParent.value) === 'LT') {
        // new leaf is on the left
        node.parent.left = node;
      } else { // on the right
        node.parent.right = node;
      }
      result.root = node.root;
    }
    return result;
  }

  public search(x: T): Maybe<BinaryTreeNode<T>> {
    let curr: Maybe<BinaryTreeNode<T>> = this.root;
    while (isNonNull(curr)) {
      switch (this.order(x, curr.value)) {
        case 'LT':
          curr = curr.left;
          continue;
        case 'GT':
          curr = curr.right;
          continue;
        case 'EQ':
          return curr;
      }
    }
    return bottom;
  }
}
