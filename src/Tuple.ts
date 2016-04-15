export default class Tuple<R,S> {
	first: R;
	second: S;

	constructor(x: R, y: S) {
		this.first = x;
		this.second = y;
	}

	static curried<U,V>(x: U): {(y: V): Tuple<U,V>} {
		return function(y) {
			return new Tuple(x, y);
		};
	}

	reverse() : Tuple<S,R> {
		return new Tuple(this.second, this.first);
	}

	map<T,U>(f:{(x:R):T}, g:{(y:S):U}): Tuple<T,U> {
		return new Tuple(f(this.first), g(this.second));
	}
}
