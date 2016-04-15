import { Func } from "./Utils";
export default class Maybe<T> {
    private _value;
    private _isJust;
    static Nothing<U>(): Maybe<U>;
    static Just<U>(val: U): Maybe<U>;
    isJust(): boolean;
    isNothing(): boolean;
    maybe<V>(nil: V, f: Func<T, V>): V;
    defaultTo(d: T): T;
    toArray(): Array<T>;
    toBoolean(): boolean;
    map<U>(f: {
        (x: T): U;
    }): Maybe<U>;
    bind<U>(f: {
        (x: T): Maybe<U>;
    }): Maybe<U>;
}
