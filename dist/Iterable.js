"use strict";
/**
 * Helpers for finite and infinite Iterables
 */
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Functions_1 = require("./Functions");
/**
 * @summary Applies a function over the elements of an iterable.
 */
function map(fn) {
    function generatorT(xs) {
        var _i, xs_1, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, xs_1 = xs;
                    _a.label = 1;
                case 1:
                    if (!(_i < xs_1.length)) return [3 /*break*/, 4];
                    x = xs_1[_i];
                    return [4 /*yield*/, fn(x)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }
    return generatorT;
}
exports.map = map;
/**
 * @summary Filter an iterable to one whose elements all make `pred` true.
 */
function filter(pred) {
    function generatorT(xs) {
        var _i, xs_2, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, xs_2 = xs;
                    _a.label = 1;
                case 1:
                    if (!(_i < xs_2.length)) return [3 /*break*/, 4];
                    x = xs_2[_i];
                    if (!pred(x)) return [3 /*break*/, 3];
                    return [4 /*yield*/, x];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }
    return generatorT;
}
exports.filter = filter;
/**
 * @summary Maps a function over elements of an iterable and concatenates the results.
 */
function concatMap(fn) {
    function generatorT(xs) {
        var _i, xs_3, x, _a, _b, y;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, xs_3 = xs;
                    _c.label = 1;
                case 1:
                    if (!(_i < xs_3.length)) return [3 /*break*/, 6];
                    x = xs_3[_i];
                    _a = 0, _b = fn(x);
                    _c.label = 2;
                case 2:
                    if (!(_a < _b.length)) return [3 /*break*/, 5];
                    y = _b[_a];
                    return [4 /*yield*/, y];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }
    return generatorT;
}
exports.concatMap = concatMap;
/**
 * @summary Takes the first `n` elements of an iterable and return the results as an array.
 * @param n a positive integer
 */
function take(n) {
    if (!Number.isInteger(n) || Math.abs(n) === 0) {
        return function (xs) { return []; };
    }
    if (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) {
        return Functions_1.ident;
    }
    if (n > 0) {
        return function (xs) {
            var arr = [];
            var count = n;
            var iterT = xs[Symbol.iterator]();
            var nextT = iterT.next();
            while (count-- > 0 && !nextT.done) {
                arr.push(nextT.value);
                nextT = iterT.next();
            }
            return arr;
        };
    }
    else {
        return function (xs) {
            var _a;
            return _a = {},
                _a[Symbol.iterator] = function () {
                    var keep = [];
                    var iterT = xs[Symbol.iterator]();
                    var nextT = iterT.next();
                    var count = 0;
                    while (count-- > n && !nextT.done) {
                        keep.push(nextT.value);
                        nextT = iterT.next();
                    }
                    while (!nextT.done) {
                        keep.shift();
                        keep.push(nextT.value);
                        nextT = iterT.next();
                    }
                    return keep[Symbol.iterator]();
                },
                _a;
        };
    }
}
exports.take = take;
/**
 * @summary Drops the first `n` elements of an iterable.
 * @param n a positive integer
 */
function drop(n) {
    if (Number.isNaN(n) || n === 0) {
        return Functions_1.ident;
    }
    if (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) {
        return function (xs) { return []; };
    }
    if (n > 0) {
        return function (xs) {
            var _a, _b;
            var count = n;
            var iterT = xs[Symbol.iterator]();
            var nextT = iterT.next();
            while (count-- > 0 && !nextT.done) {
                nextT = iterT.next();
            }
            if (nextT.done) {
                return _a = {},
                    _a[Symbol.iterator] = function () {
                        return {
                            next: function (y) {
                                return nextT;
                            }
                        };
                    },
                    _a;
            }
            else {
                return _b = {},
                    _b[Symbol.iterator] = function () {
                        return iterT;
                    },
                    _b;
            }
        };
    }
    else {
        return function (xs) {
            var keep = [];
            var discard = [];
            var iterT = xs[Symbol.iterator]();
            var nextT = iterT.next();
            var count = 0;
            while (count-- > n && !nextT.done) {
                discard.push(nextT.value);
                nextT = iterT.next();
            }
            while (!nextT.done) {
                keep.push(discard[0]);
                discard.shift();
                discard.push(nextT.value);
            }
            return keep;
        };
    }
}
exports.drop = drop;
/**
 * @summary Takes the shortest subsequence of an iterable whose elements all make `pred` true.
 */
function takeWhile(pred) {
    function generatorT(xs) {
        var prev, _i, xs_4, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prev = [];
                    _i = 0, xs_4 = xs;
                    _a.label = 1;
                case 1:
                    if (!(_i < xs_4.length)) return [3 /*break*/, 5];
                    x = xs_4[_i];
                    if (!pred(x)) {
                        return [2 /*return*/, prev.length === 0 ? undefined : prev.pop()];
                    }
                    if (!(prev.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prev[(prev.length = 1)]];
                case 2:
                    _a.sent();
                    prev.pop();
                    prev.push(x);
                    return [3 /*break*/, 4];
                case 3:
                    prev.push(x);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    }
    return generatorT;
}
exports.takeWhile = takeWhile;
/**
 * @summary Drops the shortest subsequence of an iterable whose elements all make `pred` true.
 */
function dropWhile(pred) {
    return function (xs) {
        var _a;
        var iterT = xs[Symbol.iterator]();
        var nextT = iterT.next();
        while (!nextT.done && pred(nextT.value)) {
            nextT = iterT.next();
        }
        return _a = {},
            _a[Symbol.iterator] = function () {
                if (nextT.done) {
                    return {
                        next: function (y) {
                            return nextT;
                        }
                    };
                }
                else {
                    // @todo this skips over the first false result
                    return iterT;
                }
            },
            _a;
    };
}
exports.dropWhile = dropWhile;
/**
 * @summary Returns an infinite iterable which cycles through the elements of `xs`
 */
function cycle(xs) {
    var _i, xs_5, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 5];
                _i = 0, xs_5 = xs;
                _a.label = 1;
            case 1:
                if (!(_i < xs_5.length)) return [3 /*break*/, 4];
                x = xs_5[_i];
                return [4 /*yield*/, x];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}
exports.cycle = cycle;
/**
 * @summary Returns an infinite iterable which repeatedly returns `x`
 */
function repeat(x) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 2];
                return [4 /*yield*/, x];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
exports.repeat = repeat;
/**
 * @summary Returns the infinite iterable `(0, 1, 2, 3, ...)`.
 */
function naturals() {
    var n;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                n = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, n++];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
exports.naturals = naturals;
/**
 * @summary Returns true if and only if every element of the iterable makes `pred` true.
 * Short-circuits once a false is observed.
 */
function every(pred) {
    return function (xs) {
        for (var _i = 0, xs_6 = xs; _i < xs_6.length; _i++) {
            var x = xs_6[_i];
            if (!pred(x)) {
                return false;
            }
        }
        return true;
    };
}
exports.every = every;
/**
 * @summary Returns true if and only if there is at least one element of the iterable which makes `pred` true.
 * Short-circuits once a true is observed.
 */
function some(pred) {
    return function (xs) {
        for (var _i = 0, xs_7 = xs; _i < xs_7.length; _i++) {
            var x = xs_7[_i];
            if (pred(x)) {
                return true;
            }
        }
        return false;
    };
}
exports.some = some;
/**
 * @summary Applies a reduction over the elements of an iterable.
 * @see [[iterable]]
 */
function reduce(fn, init) {
    return iterable(init, fn);
}
exports.reduce = reduce;
/**
 * @summary Applies a reduction over the elements of an iterable and returns the partial results
 */
function accumulate(fn, init) {
    function generatorT(xs) {
        var valT, _i, xs_8, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    valT = init;
                    return [4 /*yield*/, valT];
                case 1:
                    _a.sent();
                    _i = 0, xs_8 = xs;
                    _a.label = 2;
                case 2:
                    if (!(_i < xs_8.length)) return [3 /*break*/, 5];
                    x = xs_8[_i];
                    valT = fn(valT, x);
                    return [4 /*yield*/, valT];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    }
    return generatorT;
}
exports.accumulate = accumulate;
/**
 * @summary Zips up two iterables into one iterable of tuples.
 * Stops as soon as one of the two iterables stops.
 */
function zip(xs, ys) {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () {
            var iterS = xs[Symbol.iterator]();
            var iterT = ys[Symbol.iterator]();
            var nextS = iterS.next();
            var nextT = iterT.next();
            return {
                next: function (y) {
                    var done = nextS.done && nextT.done;
                    var value = [nextS.value, nextT.value];
                    nextS = iterS.next();
                    nextT = iterT.next();
                    return { done: done, value: value };
                }
            };
        },
        _a;
}
exports.zip = zip;
/**
 * @summary Unzips an iterable of tuples into a tuple of iterables.
 */
function unzip(xys) {
    var iterS = [];
    var iterT = [];
    for (var _i = 0, xys_1 = xys; _i < xys_1.length; _i++) {
        var _a = xys_1[_i], x = _a[0], y = _a[1];
        iterS.push(x);
        iterT.push(y);
    }
    return [iterS, iterT];
}
exports.unzip = unzip;
/**
 * @summary Builds functions over iterables recursively.
 */
function iterable(init, fn) {
    return function (xs) {
        var valT = init;
        for (var _i = 0, xs_9 = xs; _i < xs_9.length; _i++) {
            var x = xs_9[_i];
            valT = fn(valT, x);
        }
        return valT;
    };
}
exports.iterable = iterable;
/**
 * @summary Joins together an iterable collection of iterables
 * Be careful regarding infinite iterables.
 */
function concat(xss) {
    var _i, xss_1, xs, _a, xs_10, x;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, xss_1 = xss;
                _b.label = 1;
            case 1:
                if (!(_i < xss_1.length)) return [3 /*break*/, 6];
                xs = xss_1[_i];
                _a = 0, xs_10 = xs;
                _b.label = 2;
            case 2:
                if (!(_a < xs_10.length)) return [3 /*break*/, 5];
                x = xs_10[_a];
                return [4 /*yield*/, x];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _a++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}
exports.concat = concat;
/**
 * @summary Interleaves two iterables into one.
 * Stops as soon as one of the two iterables stops.
 */
function interleave(xs, ys) {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () {
            var iterX = xs[Symbol.iterator]();
            var iterY = ys[Symbol.iterator]();
            var turnX = true;
            var lastT = iterX.next();
            var done = lastT.done;
            return {
                next: function (y) {
                    if (done) {
                        return lastT;
                    }
                    var nextT = lastT;
                    turnX = !turnX;
                    lastT = turnX ? iterX.next() : iterY.next();
                    done = done || lastT.done;
                    return nextT;
                }
            };
        },
        _a;
}
exports.interleave = interleave;
/**
 * @summary Returns an iterable that generates only unique values.
 * This uses a Set as a cache for values that have been seen
 * already. So mindful of the space consumed when passing in
 * a large iterable.
 */
function unique(xs) {
    var seen, _i, xs_11, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                seen = new Set();
                _i = 0, xs_11 = xs;
                _a.label = 1;
            case 1:
                if (!(_i < xs_11.length)) return [3 /*break*/, 4];
                x = xs_11[_i];
                if (!!seen.has(x)) return [3 /*break*/, 3];
                seen.add(x);
                return [4 /*yield*/, x];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
exports.unique = unique;
/**
 * @summary Bundles the results of an iterable into groups of `n`.
 * `n` is allowed to be +Infinity, in which case, the first
 * bundle returned contains everything. Be careful about
 * infinite iterables.
 */
function bundle(n) {
    if ((!Number.isInteger(n) && n !== Number.POSITIVE_INFINITY) || n <= 1) {
        return function (xs) { return map(function (x) { return [x]; })(xs); };
    }
    function generator(xs) {
        var nextBundle, _i, xs_12, x;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nextBundle = [];
                    _i = 0, xs_12 = xs;
                    _a.label = 1;
                case 1:
                    if (!(_i < xs_12.length)) return [3 /*break*/, 5];
                    x = xs_12[_i];
                    if (!(nextBundle.length < n)) return [3 /*break*/, 2];
                    nextBundle.push(x);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, nextBundle];
                case 3:
                    _a.sent();
                    nextBundle = [];
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, nextBundle];
            }
        });
    }
    return generator;
}
exports.bundle = bundle;
/**
 * @summary Generates all values from an iterable and returns them as an array.
 * This function short-circuits when `xs` is an array. Be
 * careful about infinite iterables.
 */
function toArray(xs) {
    if (xs instanceof Array) {
        return xs;
    }
    var arr = [];
    var iterT = xs[Symbol.iterator]();
    var nextT = iterT.next();
    while (!nextT.done) {
        arr.push(nextT.value);
        nextT = iterT.next();
    }
    return arr;
}
exports.toArray = toArray;
//# sourceMappingURL=Iterable.js.map