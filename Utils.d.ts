export interface Func<S, T> {
    (x: S): T;
}
export interface Func2<R, S, T> {
    (x: R, y: S): T;
}
export declare function identity<T>(x: T): T;
export declare function curry<R, S, T>(f: Func2<R, S, T>): Func<R, Func<S, T>>;
export declare function uncurry<R, S, T>(f: Func<R, Func<S, T>>): Func2<R, S, T>;
export declare function constant<R, S>(x: R): {
    (y: S): R;
};
export declare function flip<R, S, T>(f: Func<R, Func<S, T>>): Func<S, Func<R, T>>;
export declare function compose<R, S, T>(g: Func<S, T>): Func<Func<R, S>, Func<R, T>>;
export declare function over<R, S, T>(f: Func<R, S>, op: Func2<S, S, T>): Func2<R, R, T>;
export declare function longCommSubseqs<T>(xs: string, ys: string): Array<string>;
