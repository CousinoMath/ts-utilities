"use strict";
const Maybe_1 = require("./Maybe");
class ListZipper {
    static unzip(lst) {
        var lstz = new ListZipper();
        lstz.ahead = lst;
        lstz.behind = [];
        return lstz;
    }
    zip() {
        return this.behind.reverse().concat(this.ahead);
    }
    isEmpty() { return this.length() == 0; }
    length() { return this.ahead.length + this.behind.length; }
    atEnd() { return this.ahead.length == 0; }
    atStart() { return this.behind.length == 0; }
    atFirst() { return this.atStart(); }
    atLast() { return this.ahead.length == 1; }
    forward() {
        var node;
        if (this.atEnd()) {
            return Maybe_1.default.Nothing();
        }
        else {
            node = this.ahead.shift();
            this.behind.unshift(node);
            return Maybe_1.default.Just(node);
        }
    }
    backward() {
        var node;
        if (this.atStart()) {
            return Maybe_1.default.Nothing();
        }
        else {
            node = this.behind.shift();
            this.ahead.unshift(node);
            return Maybe_1.default.Just(node);
        }
    }
    remove() {
        if (this.atEnd()) {
            return Maybe_1.default.Nothing();
        }
        else {
            return Maybe_1.default.Just(this.ahead.shift());
        }
    }
    insert(x) {
        this.ahead.unshift(x);
    }
    replace(x) {
        var zm;
        if (this.atEnd()) {
            this.ahead.unshift(x);
            zm = Maybe_1.default.Nothing();
        }
        else {
            zm = Maybe_1.default.Just(this.ahead[0]);
            this.ahead[0] = x;
        }
        return zm;
    }
    current() {
        if (this.atEnd()) {
            return Maybe_1.default.Nothing();
        }
        else {
            return Maybe_1.default.Just(this.ahead[0]);
        }
    }
}
exports.ListZipper = ListZipper;
class List {
    static Nil() {
        var lst = new List();
        lst._lst = [];
        return lst;
    }
    static Cons(hd, tl) {
        var lst = new List();
        lst._lst = [hd].concat(tl._lst);
        return lst;
    }
    static fromArray(xs) {
        var lst = new List();
        lst._lst = xs;
        return lst;
    }
    toArray() { return this._lst; }
    length() { return this._lst.length; }
    isEmpty() { return this.length() == 0; }
    head() {
        if (this.isEmpty()) {
            return Maybe_1.default.Nothing();
        }
        else {
            return Maybe_1.default.Just(this._lst[0]);
        }
    }
    tail() {
        var tl;
        if (!this.isEmpty()) {
            tl = new List();
            tl._lst = this._lst.slice(1);
        }
        else {
            tl = List.Nil();
        }
        return tl;
    }
    at(idx) { return this._lst[idx]; }
    prepend(x) {
        return List.Cons(x, this);
    }
    postpend(x) {
        var z = new List();
        z._lst = this._lst.concat(x);
        return z;
    }
    foldl(nil, f) {
        var len = this.length();
        var last = nil;
        for (var idx = 0; idx < len; idx++) {
            last = f(last, this._lst[idx]);
        }
        return last;
    }
    foldr(nil, f) {
        var len = this.length();
        var last = nil;
        for (var idx = len - 1; idx >= 0; idx--) {
            last = f(last, this._lst[idx]);
        }
        return last;
    }
    forall(p) {
        return this._lst.every(p);
    }
    exists(p) {
        return this._lst.some(p);
    }
    map(f) {
        return List.fromArray(this._lst.map(f));
    }
    concat(xs) {
        return List.fromArray(this._lst.concat(xs.toArray()));
    }
    contains(x) {
        return this._lst.indexOf(x) >= 0;
    }
    uniques() {
        var nil = List.Nil();
        var uniq = function (lst, elt) {
            if (lst.contains(elt)) {
                return lst;
            }
            else {
                return lst.concat(List.fromArray([elt]));
            }
        };
        return this.foldl(nil, uniq);
    }
}
exports.List = List;
//# sourceMappingURL=List.js.map