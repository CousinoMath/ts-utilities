"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @summary Returns the greatest integer no more than the argument.
 */
function greatestInt(x) {
    return isNaN(x) ? NaN : x >= 0 ? Math.floor(x) : Math.ceil(x);
}
exports.greatestInt = greatestInt;
/**
 * @summary Returns the fractional part of the input.
 */
function fractionPart(x) {
    return x - greatestInt(x);
}
exports.fractionPart = fractionPart;
/**
 * ```
 * fromContinuedFraction([]) = NaN
 * fromContinuedFraction([x0]) = x0
 * fromContinuedFraction([x0, ...xs]) = x0 + 1/fromContinuedFraction([...xs])
 * ```
 * @summary Converts a continued fraction, represented as a list, into a number
 */
function fromContinuedFraction(xs) {
    return xs.length > 0
        ? xs.reduceRight((accum, curr) => curr + 1 / accum)
        : NaN;
}
exports.fromContinuedFraction = fromContinuedFraction;
/**
 * `max() = -Infinity`
 * @summary Returns a maximum of its arguments
 */
function max(...xs) {
    let value = -Infinity;
    for (const x of xs) {
        if (x > value) {
            value = x;
        }
    }
    return value;
}
exports.max = max;
/**
 * @summary Returns the maximum, by `ord`, of its arguments
 * @param ord the ordering using to determine the maximum
 */
function maxBy(ord, x0, ...xs) {
    let value = x0;
    for (const x of xs) {
        if (ord(x, value) === 'GT') {
            value = x;
        }
    }
    return value;
}
exports.maxBy = maxBy;
/**
 * `min() = +Infinity`
 * @summary Returns the minimum of its arguments
 */
function min(...xs) {
    let value = +Infinity;
    for (const x of xs) {
        if (x < value) {
            value = x;
        }
    }
    return value;
}
exports.min = min;
/**
 * @summary Returns the minimum, by `ord`, of its arguments
 * @param ord the ordering using to determine the minimum
 */
function minBy(ord, x0, ...xs) {
    let value = x0;
    for (const x of xs) {
        if (ord(x, value) === 'LT') {
            value = x;
        }
    }
    return value;
}
exports.minBy = minBy;
/**
 * `sum() = 0`
 * @summary Returns the sum of its arguments
 */
function sum(...xs) {
    return xs.reduce((y, accum) => y + accum, 0);
}
exports.sum = sum;
/**
 * `product() = 1`
 * @summary Retruns the product of its arguments
 */
function product(...xs) {
    return xs.reduce((y, accum) => y * accum, 1);
}
exports.product = product;
/**
 * @summary Converts a number into a continued fraction, represented as an array.
 * @param x number to be converted to continued fraction representation
 * @param maxLen maximum length of the continued fraction array
 */
function toContinuedFraction(x, maxLen) {
    if (isNaN(x)) {
        return [];
    }
    if (x === 0) {
        return [0];
    }
    const result = [];
    let y = x;
    let len = 0;
    maxLen = Math.min(65536, maxLen);
    while (y !== 0 && len < maxLen) {
        const next = greatestInt(y);
        len = result.push(next);
        y = 1 / (y - next);
    }
    return result;
}
exports.toContinuedFraction = toContinuedFraction;
//# sourceMappingURL=Math.js.map