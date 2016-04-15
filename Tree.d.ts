import Maybe from "./Maybe";
export default class Tree<T> {
    node: T;
    children: Array<Tree<T>>;
    constructor(value: T);
    hasChildren(): boolean;
    numChildren(): number;
}
export declare class TreeZipper<T> {
    prevSiblings: Array<Tree<T>>;
    nextSiblings: Array<Tree<T>>;
    currTree: Tree<T>;
    context: Maybe<TreeZipper<T>>;
    constructor(tree: Tree<T>, prev: Array<Tree<T>>, next: Array<Tree<T>>, cntxt: Maybe<TreeZipper<T>>);
    atRoot(): boolean;
    ascend(): Maybe<TreeZipper<T>>;
    atLeaf(): boolean;
    descend(): TreeZipper<T>;
    atFirstSibling(): boolean;
    prevSibling(): TreeZipper<T>;
    atLastSibling(): boolean;
    nextSibling(): TreeZipper<T>;
}
