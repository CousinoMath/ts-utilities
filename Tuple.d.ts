export default class Tuple<R, S> {
    first: R;
    second: S;
    constructor(x: R, y: S);
    static curried<U, V>(x: U): {
        (y: V): Tuple<U, V>;
    };
    reverse(): Tuple<S, R>;
    map<T, U>(f: {
        (x: R): T;
    }, g: {
        (y: S): U;
    }): Tuple<T, U>;
}
