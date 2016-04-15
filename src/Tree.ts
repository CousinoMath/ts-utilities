import Maybe from "./Maybe";

export default class Tree<T> {
  node : T;
  children : Array<Tree<T>>;

  constructor(value : T) {
    this.node = value;
    this.children = [];
  }

  hasChildren() : boolean {
    return this.children.length == 0;
  }

  numChildren() : number {
    return this.children.length;
  }
}

export class TreeZipper<T> {
  prevSiblings : Array<Tree<T>>; //stored in reverse order
  nextSiblings : Array<Tree<T>>;
  currTree : Tree<T>;
  context: Maybe<TreeZipper<T>>;

  constructor(tree : Tree<T>, prev : Array<Tree<T>>, next : Array<Tree<T>>, cntxt : Maybe<TreeZipper<T>>) {
    this.currTree = tree;
    this.prevSiblings = prev;
    this.nextSiblings = next;
    this.context = cntxt;
  }

  atRoot() : boolean {
    return this.context.isNothing();
  }

  ascend() : Maybe<TreeZipper<T>> {
      return this.context;//FIX: should just be TreeZipper<T>
  }

  atLeaf() : boolean {
    return this.currTree.hasChildren();
  }

  descend() : TreeZipper<T> {
    if(! this.atLeaf()) {
      var children = this.currTree.children;
      return new TreeZipper<T>(children[0], [], children.slice(1), Maybe.Just(this));
    }
  }

  atFirstSibling() : boolean {
    return this.prevSiblings.length == 0;
  }

  prevSibling() : TreeZipper<T> {
    if(! this.atFirstSibling()) {
      var prev = this.prevSiblings;
      return new TreeZipper<T>(prev[0], prev.slice(1), [this.currTree].concat(this.nextSiblings), this.context);
    }
  }

  atLastSibling() : boolean {
    return this.nextSiblings.length == 0;
  }

  nextSibling() : TreeZipper<T> {
    if(! this.atLastSibling()) {
      var next = this.nextSiblings;
      return new TreeZipper<T>(next[0], [this.currTree].concat(this.prevSiblings), next.slice(1), this.context);
    }
  }

  //insertTreePrior
  //insertTreeAfter
  //removeTree
  //replaceNode
  //walker
  //
}
