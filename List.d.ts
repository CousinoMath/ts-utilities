import Maybe from "./Maybe";
export declare class ListZipper<T> {
    ahead: Array<T>;
    behind: Array<T>;
    static unzip<U>(lst: Array<U>): ListZipper<U>;
    zip(): Array<T>;
    isEmpty(): boolean;
    length(): number;
    atEnd(): boolean;
    atStart(): boolean;
    atFirst(): boolean;
    atLast(): boolean;
    forward(): Maybe<T>;
    backward(): Maybe<T>;
    remove(): Maybe<T>;
    insert(x: T): void;
    replace(x: T): Maybe<T>;
    current(): Maybe<T>;
}
export declare class List<T> {
    private _lst;
    static Nil<U>(): List<U>;
    static Cons<U>(hd: U, tl: List<U>): List<U>;
    static fromArray<U>(xs: Array<U>): List<U>;
    toArray(): Array<T>;
    length(): number;
    isEmpty(): boolean;
    head(): Maybe<T>;
    tail(): List<T>;
    at(idx: number): T;
    prepend(x: T): List<T>;
    postpend(x: T): List<T>;
    foldl<U>(nil: U, f: {
        (x: U, y: T): U;
    }): U;
    foldr<U>(nil: U, f: {
        (x: U, y: T): U;
    }): U;
    forall(p: {
        (x: T): boolean;
    }): boolean;
    exists(p: {
        (x: T): boolean;
    }): boolean;
    map<U>(f: {
        (x: T): U;
    }): List<U>;
    concat(xs: List<T>): List<T>;
    contains(x: T): boolean;
    uniques(): List<T>;
}
