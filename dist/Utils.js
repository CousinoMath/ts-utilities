/**
 * @summary Identity function
 * @param {T} x
 * @returns {T} `x`
 */
export function ident(x) { return x; }
/**
 * @summary Curry a function
 * @param {function(R, S): T} f
 * @returns {function(R): function(S): T} `x => y => f(x, y)`
 */
export function curry(f) {
    return function (x) { return function (y) { return f(x, y); }; };
}
/**
 * @summary Uncurry a function
 * @param {function(R): function(S): T} f
 * @returns {function(R, S): T} `(x, y) => f(x)(y)`
 */
export function uncurry(f) {
    return function (x, y) { return f(x)(y); };
}
/**
 * @summary Creates a function with constant output
 * @param {R} x
 * @returns {function(*): R} `y => x`
 */
export function constant(x) {
    return function (y) { return x; };
}
/**
 * @summary Flips the arguments for a function that returns another function
 * @param {function(R): function(S): T} f
 * @returns {function(S): function(R): T} `y => x => f(x)(y)`
 */
export function flip(f) {
    return function (y) { return function (x) { return f(x)(y); }; };
}
/**
 * @summary Creates the composition of two functions
 * @param {function(S): T} g
 * @returns {function(function(R): S): function(R): T} `f => x => g(f(x))`
 */
export function compose(g) {
    return function (f) { return function (x) { return g(f(x)); }; };
}
/**
 * @summary Threads a function `f` through a binary operation `op`
 * @param {function(R): S} f
 * @param {function(S, S): T} op
 * @returns {function(R, R): T} `(x, y) => op(f(x), f(y))`
 */
export function over(f, op) {
    return function (x, y) { return op(f(x), f(y)); };
}
// /**
//  * @summary Returns an array of an arithmetic sequence of numbers
//  * @param {number} start the number which begins the array
//  * @param {number} stop the number which is the upper bound for the end of the array
//  * @param {number} delta the increment between two array values (assumed to be not equal to 0)
//  * @returns {Array<number>} `[start, ..., start + n * delta]` where `n = Math.floor((stop - start) / delta)`
//  */
// export function range(start: number, stop: number, delta: number): number[] {
//   const size = (delta !== 0 ? Math.floor((stop - start) / delta) : 0);
//   if (size > 0) {
//     const res = new Array<number>(size + 1);
//     res[0] = start;
//     for (let k = 1; k <= size; k++) {
//       res[k] = res[k - 1] + delta;
//     }
//     return res;
//   } else {
//     return new Array<number>();
//   }
// }
// /**
//  * Finds the longest common subsequence (not substring) between two strings
//  * @param {string} xs
//  * @param {string} ys
//  */
// export function	longCommSubseqs(xs: string, ys: string): Array<string> {
// 		let m = xs.length, n = ys.length, D = new Array<Array<Array<string>>>(m);
//     let R: Array<string>;
//     let s: number, t: number;
// 		for(let i = 0; i < m; i++) {
// 			D[i] = new Array<Array<string>>(n);
// 			D[i][0] = [];
// 		}
// 		for(let j = 0; j < n; j++) {
// 			D[0][j] = [];
// 		}
// 		for(let i = 1; i < m; i++) {
// 			for(let j = 1; j < n; j++) {
// 				if(xs[i] == ys[j]) {
// 					D[i][j] = D[i - 1][j - 1].map(function(zs) { return zs + xs[i]; });
// 				} else {
//           R = D[i - 1][j];
//           s = (R.length > 0 ? R[0].length : 0);
//           R = D[i][j - 1];
//           t = (R.length > 0 ? R[0].length : 0);
//           if(s > t) {
//             R = D[i - 1][j];
//           } else if(s < t) {
//             R = D[i][j - 1];
//           } else { // s == t
//             let S = D[i][j - 1];
//             let len = S.length;
//             R = D[i - 1][j];
//             for(let idx = 0; idx < len; idx++) {
//               if(R.indexOf(S[idx]) < 0) {
//                 R.push(S[idx]);
//               }
//             }
//           }
//           D[i][j] = R;
// 				}
// 			}
// 		}
// 		return D[m][n];
// }
//# sourceMappingURL=Utils.js.map