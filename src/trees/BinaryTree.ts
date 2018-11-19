import { bottom, isNonNull, isNull, Maybe, Ordering } from '../internal';

// tslint:disable no-this-assignment max-classes-per-file
export class BinaryTreeNode<T> {
  public static setLeftChild<A>(
    parent: Maybe<BinaryTreeNode<A>>,
    left: Maybe<BinaryTreeNode<A>>
  ): void {
    if (isNonNull(left)) {
      left.parent = parent;
    }
    if (isNonNull(parent)) {
      parent.left = left;
    }
  }

  public static setRightChild<A>(
    parent: Maybe<BinaryTreeNode<A>>,
    right: Maybe<BinaryTreeNode<A>>
  ): void {
    if (isNonNull(right)) {
      right.parent = parent;
    }
    if (isNonNull(parent)) {
      parent.right = right;
    }
  }

  public static setParent<A>(
    parent: Maybe<BinaryTreeNode<A>>,
    child: Maybe<BinaryTreeNode<A>>,
    cond: (p: BinaryTreeNode<A>) => boolean
  ) {
    if (isNonNull(parent)) {
      if (cond(parent)) {
        parent.right = child;
      } else {
        parent.left = child;
      }
    }
    if (isNonNull(child)) {
      child.parent = parent;
    }
  }

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
      self.parent = oldParent.cloneToRoot();
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
    const leftNon = isNonNull(this.left);
    const rightNon = isNonNull(this.right);
    if (leftNon && rightNon) {
      return `(${
        this.value
      } ${this.left!.toDebugString()} ${this.right!.toDebugString()})`;
    } else if (leftNon) {
      return `(${this.value} ${this.left!.toDebugString()} _)`;
    } else if (rightNon) {
      return `(${this.value} _ ${this.right!.toDebugString()})`;
    }
    return `${this.value}`;
  }
}

export class BinaryTree<T> {
  public root: Maybe<BinaryTreeNode<T>> = bottom;
  protected readonly order: Ordering<T>;

  constructor(ord: Ordering<T>) {
    this.order = ord;
  }

  public delete(z: T): BinaryTree<T> {
    let oldNode = this.search(z);
    if (isNull(oldNode)) {
      return this;
    }
    let newNode: Maybe<BinaryTreeNode<T>>;
    const result: BinaryTree<T> = new BinaryTree(this.order);
    if (isNull(oldNode.left) || isNull(oldNode.right)) {
      // oldNode has at most one child
      newNode = oldNode.cloneToRoot();
      const child = isNull(newNode.left) ? newNode.right : newNode.left;
      const parent = newNode.parent;
      let newRoot = child;
      BinaryTreeNode.setParent(parent, child, p => {
        newRoot = p.root;
        return p.right === newNode;
      });
      // omitted is now omitted
      result.root = newRoot;
      return result;
    }
    // oldNode has two children, and thus a successor
    // old successor was a left child of its parent with no left child
    newNode = oldNode.successor()!.cloneToRoot();
    // refind old node in new node's ancestory
    oldNode = newNode!;
    while (this.order(z, oldNode.value) !== 'EQ') {
      oldNode = oldNode.parent!;
    }
    // if present, connect old successors parent to old successors right child
    BinaryTreeNode.setLeftChild(newNode.parent, newNode.right);
    // if present, connect old successor to all of oldNodes relations
    BinaryTreeNode.setParent(oldNode.parent, newNode, p => p.right === oldNode);
    BinaryTreeNode.setLeftChild(newNode, oldNode.left);
    BinaryTreeNode.setRightChild(newNode, oldNode.right);
    result.root = newNode.root;
    return result;
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
      node.parent = oldParent.cloneToRoot();
      BinaryTreeNode.setParent(
        oldParent,
        node,
        p => this.order(z, p.value) === 'GT'
      );
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
