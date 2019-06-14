"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internal_1 = require("./internal");
/**
 * @summary A convenience function for `(x, y) => x == y`
 */
function equals2(x, y) {
    // tslint:disable-next-line
    return x == y;
}
exports.equals2 = equals2;
/**
 * @summary A convenience function for `(x, y) => x === y`
 */
function equals3(x, y) {
    return x === y;
}
exports.equals3 = equals3;
/**
 * @summary A convenience function for SameValueZero equality
 */
function sameValueZero(x, y) {
    const xType = typeof x;
    const yType = typeof y;
    if (xType === 'number' || yType === 'number') {
        return xType === yType && internal_1.numberOrd(Number(x), Number(y)) === 'EQ';
    }
    return Object.is(x, y);
}
exports.sameValueZero = sameValueZero;
//# sourceMappingURL=Objects.js.map