export class Tree<T> {
  protected node: T;
  protected children: Array<Tree<T>>;

  constructor(value: T) {
    this.node = value;
    this.children = [];
  }

  public hasChildren(): boolean {
    return this.children.length === 0;
  }

  public numChildren(): number {
    return this.children.length;
  }
}

// export class TreeZipper<T> {
//   public prevSiblings: Array<Tree<T>>; // stored in reverse order
//   public nextSiblings: Array<Tree<T>>;
//   public currTree: Tree<T>;
//   public context: TreeZipper<T> | null;

//   constructor(tree: Tree<T>, prev: Array<Tree<T>>, next: Array<Tree<T>>, cntxt: TreeZipper<T> | null) {
//     this.currTree = tree;
//     this.prevSiblings = prev;
//     this.nextSiblings = next;
//     this.context = cntxt;
//   }

//   public atRoot(): boolean {
//     return isNull(this.context);
//   }

//   public ascend(): TreeZipper<T> | null {
//     return this.context; // FIX: should just be TreeZipper<T>
//   }

//   public atLeaf(): boolean {
//     return this.currTree.hasChildren();
//   }

//   public descend(): TreeZipper<T> | null {
//     if (!this.atLeaf()) {
//       const children = this.currTree.children;
//       return new TreeZipper<T>(children[0], [], children.slice(1), this);
//     }
//     return null;
//   }

//   public atFirstSibling(): boolean {
//     return this.prevSiblings.length === 0;
//   }

//   public prevSibling(): TreeZipper<T> | null {
//     if (!this.atFirstSibling()) {
//       const prev = this.prevSiblings;
//       return new TreeZipper<T>(prev[0], prev.slice(1), [this.currTree].concat(this.nextSiblings), this.context);
//     }
//     return null;
//   }

//   public atLastSibling(): boolean {
//     return this.nextSiblings.length === 0;
//   }

//   public nextSibling(): TreeZipper<T> | null {
//     if (!this.atLastSibling()) {
//       const next = this.nextSiblings;
//       return new TreeZipper<T>(next[0], [this.currTree].concat(this.prevSiblings), next.slice(1), this.context);
//     }
//     return null;
//   }

//   // insertTreePrior
//   // insertTreeAfter
//   // removeTree
//   // replaceNode
//   // walker
//   //
// }
