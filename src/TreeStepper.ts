import { bottom, isNonNull, isNull, ListWalker, Maybe, Tree } from './internal';

export class TreeStepper<T> {
  public siblings: ListWalker<Tree<T>> = new ListWalker();
  public ancestor: Maybe<TreeStepper<T>> = bottom;

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
      const result = new TreeStepper<T>();
      result.siblings = ListWalker.fromList(this.siblings.current!.children);
      result.ancestor = this;
      return result;
    } else {
      return this;
    }
  }
  public moveToFirstSibling(): TreeStepper<T> {
    const result = new TreeStepper<T>();
    result.siblings = this.siblings.moveToFirst();
    result.ancestor = this.ancestor;
    return result;
  }

  public moveToLastSibling(): TreeStepper<T> {
    const result = new TreeStepper<T>();
    result.siblings = this.siblings.moveToLast();
    result.ancestor = this.ancestor;
    return result;
  }

  public moveToNextSibling(): TreeStepper<T> {
    const result = new TreeStepper<T>();
    result.siblings = this.siblings.moveAhead();
    result.ancestor = this.ancestor;
    return result;
  }

  public moveToRoot(): TreeStepper<T> {
    let result = new TreeStepper<T>();
    result.siblings = this.siblings;
    result.ancestor = this.ancestor;
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
    const result = new TreeStepper<T>();
    result.siblings = this.siblings.moveBehind();
    result.ancestor = this.ancestor;
    return result;
  }
}
/* TODO
 * (insert|remove)Child(n: number, ts: Tree<T>)
 * (insert|remove)Sibling(ts: Tree<T>)
 */
