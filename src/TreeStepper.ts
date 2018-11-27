import { bottom, isNull, ListWalker, Maybe, Tree } from './internal';

export class TreeStepper<T> {
  protected siblings: ListWalker<Tree<T>> = new ListWalker();
  protected ancestors: Maybe<Tree<T>> = bottom;

  public get currentSubtree(): Maybe<Tree<T>> {
      return this.siblings.current;
  }
  
  public hasSiblingsAhead(): boolean {
    return this.siblings.hasMoreAhead();
  }

  public hasSiblingsBehind(): boolean {
    return this.siblings.hasMoreBehind();
  }

  public isEmpty(): boolean {
    return this.siblings.isEmpty() && isNull(this.ancestors);
  }
}
