"use strict";
function identity(x) { return x; }
exports.identity = identity;
function curry(f) {
    return function (r) { return function (s) { return f(r, s); }; };
}
exports.curry = curry;
function uncurry(f) {
    return function (r, s) { return f(r)(s); };
}
exports.uncurry = uncurry;
function constant(x) {
    return function (y) { return x; };
}
exports.constant = constant;
function flip(f) {
    return function (y) {
        return function (x) {
            var g = f(x);
            return g(y);
        };
    };
}
exports.flip = flip;
function compose(g) {
    return function (f) {
        return function (x) {
            return g(f(x));
        };
    };
}
exports.compose = compose;
function over(f, op) {
    return function (x, y) {
        return op(f(x), f(y));
    };
}
exports.over = over;
function longCommSubseqs(xs, ys) {
    var m = xs.length, n = ys.length, D = new Array(m);
    var R;
    var s, t;
    for (var i = 0; i < m; i++) {
        D[i] = new Array(n);
        D[i][0] = [];
    }
    for (var j = 0; j < n; j++) {
        D[0][j] = [];
    }
    for (var i = 1; i < m; i++) {
        for (var j = 1; j < n; j++) {
            if (xs[i] == ys[j]) {
                D[i][j] = D[i - 1][j - 1].map(function (zs) { return zs + xs[i]; });
            }
            else {
                R = D[i - 1][j];
                s = (R.length > 0 ? R[0].length : 0);
                R = D[i][j - 1];
                t = (R.length > 0 ? R[0].length : 0);
                if (s > t) {
                    R = D[i - 1][j];
                }
                else if (s < t) {
                    R = D[i][j - 1];
                }
                else {
                    var S = D[i][j - 1];
                    var len = S.length;
                    R = D[i - 1][j];
                    for (var idx = 0; idx < len; idx++) {
                        if (R.indexOf(S[idx]) < 0) {
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
exports.longCommSubseqs = longCommSubseqs;
//# sourceMappingURL=Utils.js.map