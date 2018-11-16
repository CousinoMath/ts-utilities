import { bottom, isNonNull, Maybe, Ordering } from '../internal';

export class BinaryTree<T> {
  protected readonly order: Ordering<T>;
  protected readonly value: T;
  protected left: Maybe<BinaryTree<T>> = bottom;
  protected right: Maybe<BinaryTree<T>> = bottom;
  protected parent: Maybe<BinaryTree<T>> = bottom;


  constructor(ord: Ordering<T>, value: T) {
    this.order = ord;
    this.value = value;
  }

  public search(x: T): Maybe<BinaryTree<T>> {
    // tslint:disable-next-line
    let curr: Maybe<BinaryTree<T>> = this;
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

  public toString(): string {
    const leftStr = isNonNull(this.left) ? this.left.toString() : '';
    const rightStr = isNonNull(this.right) ? this.right.toString() : '';
    return `(${this.value} (${leftStr}) (${rightStr}))`;
  }

  protected cloneToRoot(): BinaryTree<T> {
    const self = new BinaryTree(this.order, this.value);
    self.left = this.left;
    self.right = this.right;
    if (isNonNull(this.parent)) {
      if (this === this.parent.left) {
        self.parent = this.parent.cloneToRoot();
        self.parent.left = self;
        return self;
      } else {
        self.parent = this.parent.cloneToRoot();
        self.parent.right = self;
        return self;
      }
    }
    return self;
  }
}
