import { Func, identity, constant, compose } from "./Utils";

export default class Maybe<T> {
	private _value : T;
	private _isJust : boolean;

	static Nothing<U>() : Maybe<U> {
		let mx = new Maybe<U>();

		mx._isJust = false;
		return mx;
	}

	static Just<U>(val : U) : Maybe<U> {
		let mx = new Maybe<U>();

		mx._value = val;
		mx._isJust = true;
		return mx;
	}

	isJust() { return this._isJust; }
	isNothing() { return ! this.isJust(); }

	maybe<V>(nil : V, f : Func<T, V>) : V {
		return (this._isJust ? f(this._value) : nil);
	}

	defaultTo(d : T) : T {
		return this.maybe(d, identity);
	}

	toArray() : Array<T> {
		return this.maybe([], function(x) { return [x]; });
	}

	toBoolean(): boolean {
		return this.maybe(false, constant(true));
	}

	map<U>(f: {(x: T): U}) : Maybe<U> {
		return this.maybe(
			Maybe.Nothing<U>(),
			compose<T,U,Maybe<U>>(Maybe.Just)(f));
	}

	bind<U>(f: {(x: T): Maybe<U>}): Maybe<U> {
		return this.maybe(Maybe.Nothing<U>(), f);
	}
}
