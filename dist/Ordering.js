"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("./Functions");
/**
 * `preorder(f, ord)(x, y) <-> ord(f(x), f(y))`
 * @summary Pulls back an ordering along a function.
 */
function preorder(f, ord) {
    return Functions_1.on(f, ord);
}
exports.preorder = preorder;
/**
 * This function treats all zeros (+0 = 0, -0) as equal and NaNs as equals.
 * If only one of x and y are NaN, `numberOrd(x, y) = numberOrd(y, x) = 'LT'`.
 * This is the one wart on this function.
 * @summary Total ordering on number type. (excepting on NaNs)
 */
function numberOrd(x, y) {
    const xNan = Number.isNaN(x);
    const yNan = Number.isNaN(y);
    if (xNan || yNan) {
        return xNan && yNan ? 'EQ' : 'LT';
    }
    // Rid of anomolous NaN
    const xAbs = Math.abs(x);
    const yAbs = Math.abs(y);
    if (xAbs > 0 || yAbs > 0) {
        if (x < y) {
            return 'LT';
        }
        else if (x > y) {
            return 'GT';
        }
        else {
            return 'EQ';
        }
    }
    else {
        // xAbs === 0 && yAbs === 0 <-> x = y = [+-]?0
        return 'EQ';
    }
}
exports.numberOrd = numberOrd;
/**
 * @summary A convenience string ordering.
 */
function stringOrd(x, y) {
    if (x < y) {
        return 'LT';
    }
    else if (x > y) {
        return 'GT';
    }
    else {
        return 'EQ';
    }
}
exports.stringOrd = stringOrd;
/**
 * @summary A convenience Date ordering.
 */
function dateOrd(x, y) {
    if (x < y) {
        return 'LT';
    }
    else if (x === y) {
        return 'EQ';
    }
    else {
        return 'GT';
    }
}
exports.dateOrd = dateOrd;
//# sourceMappingURL=Ordering.js.map