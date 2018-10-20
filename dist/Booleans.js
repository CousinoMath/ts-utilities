"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @summary Inductive rule for booleans.
 * @see [[ifte]]
 */
function bool(trueRes, falseRes) {
    return function (b) { return (b ? trueRes : falseRes); };
}
exports.bool = bool;
/**
 * @summary A functional if-then-else.
 * @param trueRes returned when `cond` is true
 * @param falseRes returned when `cond` is false
 */
function ifte(cond, trueRes, falseRes) {
    return cond ? trueRes : falseRes;
}
exports.ifte = ifte;
//# sourceMappingURL=Booleans.js.map