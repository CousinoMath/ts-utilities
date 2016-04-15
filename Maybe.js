"use strict";
const Utils_1 = require("./Utils");
class Maybe {
    static Nothing() {
        var mx = new Maybe();
        mx._isJust = false;
        return mx;
    }
    static Just(val) {
        var mx = new Maybe();
        mx._value = val;
        mx._isJust = true;
        return mx;
    }
    isJust() { return this._isJust; }
    isNothing() { return !this.isJust(); }
    maybe(nil, f) {
        return (this._isJust ? f(this._value) : nil);
    }
    defaultTo(d) {
        return this.maybe(d, Utils_1.identity);
    }
    toArray() {
        return this.maybe([], function (x) { return [x]; });
    }
    toBoolean() {
        return this.maybe(false, Utils_1.constant(true));
    }
    map(f) {
        return this.maybe(Maybe.Nothing(), Utils_1.compose(Maybe.Just)(f));
    }
    bind(f) {
        return this.maybe(Maybe.Nothing(), f);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Maybe;
//# sourceMappingURL=Maybe.js.map