"use strict";
class Tuple {
    constructor(x, y) {
        this.first = x;
        this.second = y;
    }
    static curried(x) {
        return function (y) {
            return new Tuple(x, y);
        };
    }
    reverse() {
        return new Tuple(this.second, this.first);
    }
    map(f, g) {
        return new Tuple(f(this.first), g(this.second));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tuple;
//# sourceMappingURL=Tuple.js.map