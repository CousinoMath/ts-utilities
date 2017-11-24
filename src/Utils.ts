export interface Func<S,T> { (x: S): T; }
export interface Func2<R,S,T> { (x: R, y: S): T; }
export function identity<T>(x : T) : T { return x; }
export function curry<R,S,T>(f : Func2<R,S,T>) : Func<R,Func<S,T>> {
  return function(r) { return function(s) { return f(r,s); }; };
}
export function uncurry<R,S,T>(f : Func<R,Func<S,T>>) : Func2<R,S,T> {
  return function(r, s) { return f(r)(s); }
}
export function constant<R,S>(x: R): {(y: S): R} {
  return function(y) { return x; };
}
export function flip<R,S,T>(f: Func<R, Func<S,T>>): Func<S, Func<R,T>> {
  return function(y) {
    return function(x) {
      let g = f(x);
      return g(y);
    };
  };
}
export function compose<R,S,T>(g: Func<S,T>): Func<Func<R,S>, Func<R,T>> {
  return function(f) {
    return function(x) {
      return g(f(x));
    };
  };
}

export function over<R,S,T>(f: Func<R,S>, op: Func2<S,S,T>): Func2<R,R,T> {
  return function(x, y) {
    return op(f(x), f(y));
  }
}

export function range(start: number, stop: number, delta: number): Array<number> {
  /* Creates an array [start, start + delta, start + 2 delta, ..., end] where
   * end is less than delta away from stop.
   *
   * PRE: delta != 0
   * RETURNS: [start, start + delta, start + 2 delta, ..., end] with
   *          abs(stop - end) < abs(delta)
   */
  let size = Math.floor((stop - start)/delta);
  if(size > 0) {
    let res = new Array<number>(size + 1);
    res[0] = start;
    for(let k = 1; k <= size; k++) {
      res[k] = res[k - 1] + delta;
    }
    return res;
  } else {
    return new Array<number>(0);
  }
}

export function	longCommSubseqs<T>(xs: string, ys: string): Array<string> {
		let m = xs.length, n = ys.length, D = new Array<Array<Array<string>>>(m);
    let R: Array<string>;
    let s: number, t: number;
		for(let i = 0; i < m; i++) {
			D[i] = new Array<Array<string>>(n);
			D[i][0] = [];
		}
		for(let j = 0; j < n; j++) {
			D[0][j] = [];
		}
		for(let i = 1; i < m; i++) {
			for(let j = 1; j < n; j++) {
				if(xs[i] == ys[j]) {
					D[i][j] = D[i - 1][j - 1].map(function(zs) { return zs + xs[i]; });
				} else {
          R = D[i - 1][j];
          s = (R.length > 0 ? R[0].length : 0);
          R = D[i][j - 1];
          t = (R.length > 0 ? R[0].length : 0);
          if(s > t) {
            R = D[i - 1][j];
          } else if(s < t) {
            R = D[i][j - 1];
          } else { // s == t
            let S = D[i][j - 1];
            let len = S.length;
            R = D[i - 1][j];
            for(let idx = 0; idx < len; idx++) {
              if(R.indexOf(S[idx]) < 0) {
                R.push(S[idx]);
              }
            }
          }
          D[i][j] = R;
				}
			}
		}
		return D[m][n];
}
