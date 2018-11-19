import { bottom, isNonNull, isNull, Maybe, Ordering } from '../internal';
import { BinaryTree, BinaryTreeNode } from './BinaryTree';

// tslint:disable no-this-assignment max-classes-per-file
export class RedBlackNode<T> extends BinaryTreeNode<T> {
  public static isBlack<A>(node: Maybe<RedBlackNode<A>>): boolean {
    return isNull(node) || node.isBlack;
  }

  public static setParent<A>(
    parent: Maybe<RedBlackNode<A>>,
    child: Maybe<RedBlackNode<A>>,
    cond: (p: RedBlackNode<A>) => boolean
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

  public left: Maybe<RedBlackNode<T>>;
  public right: Maybe<RedBlackNode<T>>;
  public parent: Maybe<RedBlackNode<T>>;
  public isBlack: boolean = true;

  constructor(value: T) {
    super(value);
  }

  public get root(): RedBlackNode<T> {
    let curr: RedBlackNode<T> = this;
    while (isNonNull(curr.parent)) {
      curr = curr.parent;
    }
    return curr;
  }

  public cloneToRoot(val = this.value): RedBlackNode<T> {
    const self = new RedBlackNode(val);
    self.left = this.left;
    self.right = this.right;
    self.isBlack = this.isBlack;
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

  public leftRotate(): void {
    const newParent = this.right!;
    BinaryTreeNode.setRightChild(this, newParent.left);
    newParent.parent = this.parent;
    BinaryTreeNode.setParent(this.parent, newParent, p => p.right === this);
    BinaryTreeNode.setLeftChild(newParent, this);
  }

  public minimum(): RedBlackNode<T> {
    let curr: RedBlackNode<T> = this;
    while (isNonNull(curr.left)) {
      curr = curr.left;
    }
    return curr;
  }

  public rightRotate(): void {
    const newParent = this.left!;
    BinaryTreeNode.setLeftChild(this, newParent.right);
    newParent.parent = this.parent;
    BinaryTreeNode.setParent(this.parent, newParent, p => p.right === this);
    BinaryTreeNode.setRightChild(newParent, this);
  }

  public successor(): Maybe<RedBlackNode<T>> {
    let curr: Maybe<RedBlackNode<T>> = this;
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
}

export class RedBlackTree<T> extends BinaryTree<T> {
  public root: Maybe<RedBlackNode<T>> = bottom;

  constructor(ord: Ordering<T>) {
    super(ord);
  }

  public delete(z: T): RedBlackTree<T> {
    let oldNode = this.search(z);
    if (isNull(oldNode)) {
      return this;
    }
    let newNode: Maybe<RedBlackNode<T>>;
    const result: RedBlackTree<T> = new RedBlackTree(this.order);
    if (isNull(oldNode.left) || isNull(oldNode.right)) {
      // oldNode has at most one child
      newNode = oldNode.cloneToRoot();
      const child = isNull(newNode.left) ? newNode.right : newNode.left;
      const parent = newNode.parent;
      let newRoot = child;
      RedBlackNode.setParent(parent, child, p => {
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
    RedBlackNode.setLeftChild(newNode.parent, newNode.right);
    // if present, connect old successor to all of oldNodes relations
    RedBlackNode.setParent(oldNode.parent, newNode, p => p.right === oldNode);
    RedBlackNode.setLeftChild(newNode, oldNode.left);
    RedBlackNode.setRightChild(newNode, oldNode.right);
    result.root = newNode.root;
    return result;
  }

  public insert(z: T): RedBlackTree<T> {
    let oldCurr = this.root; // current node in search
    let oldParent: Maybe<RedBlackNode<T>> = bottom; // parent of current node
    const result = new RedBlackTree<T>(this.order); // resulting tree returned
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
    let node = new RedBlackNode<T>(z);
    node.isBlack = false;
    if (isNull(oldParent)) {
      // tree is empty
      result.root = node;
    } else {
      // tree is non-empty, parent is non-null leaf
      node.parent = oldParent.cloneToRoot();
      RedBlackNode.setParent(
        oldParent,
        node,
        p => this.order(z, p.value) === 'GT'
      );
      result.root = node.root;
    }
    // Fixing red-black properties
    while (!RedBlackNode.isBlack(node.parent)) {
      const parent = node.parent!;
      if (isNonNull(parent.parent)) {
        if (parent === parent.parent.left) {
          const y = parent.parent.right;
          if (!RedBlackNode.isBlack(y)) {
            parent.isBlack = true;
            y!.isBlack = true;
            node = parent.parent;
          } else {
            if (node === parent.right) {
              node = parent;
              parent.leftRotate();
            }
            parent.isBlack = true;
            parent.parent.isBlack = false;
            parent.parent.rightRotate();
          }
        } else {
          const y = parent.parent.left;
          if (!RedBlackNode.isBlack(y)) {
            parent.isBlack = true;
            y!.isBlack = true;
            node = parent.parent;
          } else {
            if (node === parent.left) {
              node = parent;
              parent.rightRotate();
            }
            parent.isBlack = true;
            parent.parent.isBlack = false;
            parent.parent.leftRotate();
          }
        }
      }
    }
    return result;
  }

  public search(x: T): Maybe<RedBlackNode<T>> {
    let curr: Maybe<RedBlackNode<T>> = this.root;
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
