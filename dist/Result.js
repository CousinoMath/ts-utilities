"use strict";
/**
 * Wraps the result of a computation that can return/throw an error.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wraps a result as an Ok value.
 * @param value
 */
function ok(value) {
    return { kind: 'ok', value };
}
exports.ok = ok;
/**
 * Wraps a result as an Err value.
 * @param value
 */
function err(value) {
    return { kind: 'err', value };
}
exports.err = err;
/**
 * Returns true if and only if the Result is an Ok value.
 * @param result
 */
function isOk(result) {
    return result.kind === 'ok';
}
exports.isOk = isOk;
/**
 * Returns true if and only if the Result is an Err value.
 * @param result
 */
function isErr(result) {
    return result.kind === 'err';
}
exports.isErr = isErr;
/**
 * Unwraps
 * @param result
 */
function unwrapOk(result) {
    if (result.kind === 'ok') {
        return result.value;
    }
    throw new Error('Cannot unwrap an Ok from an Err value.');
}
exports.unwrapOk = unwrapOk;
function unwrapOr(result, dflt) {
    return result.kind === 'ok' ? result.value : dflt;
}
exports.unwrapOr = unwrapOr;
function unwrapErr(result) {
    if (result.kind === 'err') {
        return result.value;
    }
    throw new Error('Tried to unwrap an Err from an Ok value.');
}
exports.unwrapErr = unwrapErr;
function map(result, fn) {
    if (result.kind === 'ok') {
        return ok(fn(result.value));
    }
    else {
        return err(result.value);
    }
}
exports.map = map;
function mapOr(result, fn) {
    if (result.kind === 'ok') {
        return result.value;
    }
    else {
        return fn(result.value);
    }
}
exports.mapOr = mapOr;
function mapOrElse(result, okFn, errFn) {
    if (result.kind === 'ok') {
        return okFn(result.value);
    }
    else {
        return errFn(result.value);
    }
}
exports.mapOrElse = mapOrElse;
//# sourceMappingURL=Result.js.map