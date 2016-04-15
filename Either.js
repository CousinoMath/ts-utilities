"use strict";
const Tuple_1 = require("./Tuple");
const Utils_1 = require("./Utils");
class Either {
    static Left(x) {
        var left = new Either();
        left._lvalue = x;
        left._isRight = false;
        return left;
    }
    static Right(y) {
        var right = new Either();
        right._rvalue = y;
        right._isRight = true;
        return right;
    }
    isRight() { return this._isRight; }
    isLeft() { return !this.isRight(); }
    either(f, g) {
        return (this.isRight() ? g(this._rvalue) : f(this._lvalue));
    }
    toPartition() {
        return this.either(function (x) { return new Tuple_1.default([x], new Array()); }, function (y) { return new Tuple_1.default([], [y]); });
    }
    map(f, g) {
        return this.either(Utils_1.compose(Either.Left)(f), Utils_1.compose(Either.Right)(g));
    }
    bindRight(f) {
        return this.either(function (a) { return Either.Left(a); }, f);
    }
    bindLeft(f) {
        return this.either(f, function (b) { return Either.Right(b); });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Either;
//# sourceMappingURL=Either.js.map