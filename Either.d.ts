import Tuple from "./Tuple";
export default class Either<R, S> {
    private _lvalue;
    private _rvalue;
    private _isRight;
    static Left<U, V>(x: U): Either<U, V>;
    static Right<U, V>(y: V): Either<U, V>;
    isRight(): boolean;
    isLeft(): boolean;
    either<T>(f: {
        (u: R): T;
    }, g: {
        (v: S): T;
    }): T;
    toPartition(): Tuple<Array<R>, Array<S>>;
    map<T, U>(f: {
        (x: R): T;
    }, g: {
        (y: S): U;
    }): Either<T, U>;
    bindRight<T>(f: {
        (x: S): Either<R, T>;
    }): Either<R, T>;
    bindLeft<T>(f: {
        (x: R): Either<T, S>;
    }): Either<T, S>;
}
