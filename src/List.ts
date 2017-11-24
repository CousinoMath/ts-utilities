import Maybe from "./Maybe";

export class ListZipper<T> {
	ahead: Array<T>;
	behind: Array<T>;

	static unzip<U>(lst: Array<U>): ListZipper<U> {
		let lstz = new ListZipper<U>();
		lstz.ahead = lst;
		lstz.behind = [];
		return lstz;
	}

	zip(): Array<T> {
		return this.behind.reverse().concat(this.ahead);
	}

	isEmpty(): boolean { return this.length() == 0;	}
	length(): number { return this.ahead.length + this.behind.length;	}
	atEnd(): boolean { return this.ahead.length == 0;	}
	atStart(): boolean { return this.behind.length == 0; }
	atFirst(): boolean { return this.atStart(); }
	atLast(): boolean { return this.ahead.length == 1; }

	forward(): Maybe<T> {
		let node : T;
		if(this.atEnd()) {
			return Maybe.Nothing<T>();
		} else {
			node = this.ahead.shift();
			this.behind.unshift(node);
			return Maybe.Just(node);
		}
	}

	backward(): Maybe<T> {
		let node: T;
		if(this.atStart()) {
			return Maybe.Nothing<T>();
		} else {
			node = this.behind.shift();
			this.ahead.unshift(node);
			return Maybe.Just(node);
		}
	}

	remove(): Maybe<T> {
		if(this.atEnd()) {
			return Maybe.Nothing<T>();
		} else {
			return Maybe.Just(this.ahead.shift());
		}
	}

	insert(x: T): void {
		this.ahead.unshift(x);
	}

	replace(x: T): Maybe<T> {
		let zm: Maybe<T>;
		if(this.atEnd()) {
			this.ahead.unshift(x);
			zm = Maybe.Nothing<T>();
		} else {
			zm = Maybe.Just(this.ahead[0]);
			this.ahead[0] = x;
		}
		return zm;
	}

	current(): Maybe<T> {
		if(this.atEnd()) {
			return Maybe.Nothing<T>();
		} else {
			return Maybe.Just(this.ahead[0]);
		}
	}
	//TODO Functions on ListZipper<T> which alter it's state
}

export class List<T> {
	private _lst: Array<T>;

	static Nil<U>(): List<U> {
		let lst = new List<U>();
		lst._lst = [];
		return lst;
	}

	static Cons<U>(hd: U, tl: List<U>): List<U> {
		let lst = new List<U>();
		lst._lst = [hd].concat(tl._lst);
		return lst;
	}

	static fromArray<U>(xs: Array<U>): List<U> {
		let lst = new List<U>();
		lst._lst = xs;
		return lst;
	}

	toArray(): Array<T> { return this._lst; }
	length(): number { return this._lst.length;	}
	isEmpty(): boolean { return this.length() == 0; }

	head(): Maybe<T> {
		if(this.isEmpty()) {
			return Maybe.Nothing<T>();
		} else {
			return Maybe.Just<T>(this._lst[0]);
		}
	}

	tail(): List<T> {
		let tl: List<T>;
		if(! this.isEmpty()) {
			tl = new List<T>();
			tl._lst = this._lst.slice(1);
		} else {
			tl = List.Nil<T>();
		}
		return tl;
	}

	at(idx: number): T { return this._lst[idx]; }

	prepend(x: T): List<T> {
		return List.Cons(x, this);
	}

	postpend(x: T): List<T> {
		let z = new List<T>();
		z._lst = this._lst.concat(x);
		return z;
	}

	foldl<U>(nil: U, f: {(x: U, y: T): U}): U {
		let len = this.length();
		let last = nil;
		for(let idx = 0; idx < len; idx++) {
			last = f(last, this._lst[idx]);
		}
		return last;
	}

	foldr<U>(nil: U, f: {(x: U, y: T): U}): U {
		let len = this.length();
		let last = nil;
		for(let idx = len - 1; idx >= 0; idx--) {
			last = f(last, this._lst[idx]);
		}
		return last;
	}

	forall(p: {(x: T): boolean}): boolean {
		return this._lst.every(p);
	}

	exists(p: {(x: T): boolean}): boolean {
		return this._lst.some(p);
	}

	map<U>(f: {(x: T): U}): List<U> {
		return List.fromArray<U>(this._lst.map(f));
	}

	concat(xs: List<T>): List<T> {
		return List.fromArray<T>(this._lst.concat(xs.toArray()));
	}

	contains(x: T): boolean {
		return this._lst.indexOf(x) >= 0;
	}

	uniques(): List<T> {
		let nil = List.Nil<T>();
		let uniq = function(lst: List<T>, elt: T): List<T> {
			if(lst.contains(elt)) {
				return lst;
			} else {
				return lst.concat(List.fromArray<T>([elt]));
			}
		}
		return this.foldl(nil, uniq);
	}
}
