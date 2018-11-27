import { bottom, ListWalker, Maybe, Tree } from './internal';

export class TreeStepper<T> {
    protected siblings: ListWalker<Tree<T>> = new ListWalker();
    protected ancestors: Maybe<Tree<T>> = bottom;

}