import { isNonNull, isNull, ListWalker, Maybe, Tree } from './internal';

export class TreeStepper<T> {
  public readonly siblings: ListWalker<Tree<T>>;
  public readonly ancestor: Maybe<TreeStepper<T>>;

  constructor(sibs: ListWalker<Tree<T>>, parent: Maybe<TreeStepper<T>>) {
    this.siblings = sibs;
    this.ancestor = parent;
  }

  public get currentSubtree(): Maybe<Tree<T>> {
    return this.siblings.current;
  }

  public hasAncestor(): boolean {
    return isNonNull(this.ancestor);
  }

  public hasChildren(): boolean {
    return this.siblings.canMoveAhead() && this.siblings.current!.hasChildren();
  }

  public hasSiblingsAhead(): boolean {
    return this.siblings.canMoveAhead();
  }

  public hasSiblingsBehind(): boolean {
    return this.siblings.canMoveBehind();
  }

  public isEmpty(): boolean {
    return this.siblings.isEmpty() && isNull(this.ancestor);
  }

  public isLeaf(): boolean {
    return !this.hasChildren();
  }

  public isRoot(): boolean {
    return !this.hasAncestor();
  }

  public moveDown(): TreeStepper<T> {
    if (this.hasChildren()) {
      return new TreeStepper<T>(
        ListWalker.fromList(this.siblings.current!.children),
        this
      );
    } else {
      return this;
    }
  }
  public moveToFirstSibling(): TreeStepper<T> {
    return new TreeStepper<T>(this.siblings.moveToFirst(), this.ancestor);
  }

  public moveToLastSibling(): TreeStepper<T> {
    return new TreeStepper<T>(this.siblings.moveToLast(), this.ancestor);
  }

  public moveToNextSibling(): TreeStepper<T> {
    return new TreeStepper<T>(this.siblings.moveAhead(), this.ancestor);
  }

  public moveToRoot(): TreeStepper<T> {
    let result = new TreeStepper<T>(this.siblings, this.ancestor);
    while (result.hasAncestor()) {
      result = result.ancestor!;
    }
    return result;
  }

  public moveUp(): TreeStepper<T> {
    if (this.hasAncestor()) {
      return this.ancestor!;
    } else {
      return this;
    }
  }

  public moveToPrevSibling(): TreeStepper<T> {
    return new TreeStepper<T>(this.siblings.moveBehind(), this.ancestor);
  }
}
/* TODO
 * (insert|remove)Child(n: number, ts: Tree<T>)
 * (insert|remove)Sibling(ts: Tree<T>)
 */
