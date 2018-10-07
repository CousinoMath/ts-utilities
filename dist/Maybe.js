import { ident, constant } from "Utils";
/**
 * @summary Universal property of nullable types
 * @param {S} nil
 * @param {function(T): S} f
 * @returns {function(?T): S} `x => x == null ? nil : f(x)`
 */
export function maybe(nil, f) {
    return x => x == null ? nil : f(x);
}
/**
 * @function isNonNull
 * @summary Tests if a nullable value is not null
 * @param {?T} x
 * @returns {boolean} `x != null`
 */
export let isNonNull = maybe(false, constant(true));
/**
 * @function isNull
 * @summary Tests if a nullable value is null
 * @param {?T} x
 * @returns {boolean} `x == null`
 */
export let isNull = maybe(true, constant(false));
/**
 * @summary Returns the value from a nullable value or a default value
 * @param {T} d default value
 * @returns {function(?T): T} `x => x == null ? d : x`
 */
export function defaultTo(d) {
    return maybe(d, ident);
}
/**
 * @function toArray
 * @summary Turns a nullable value into an array
 * @param {?T} x
 * @returns {Array<T>} `x => x == null ? [] : [x]`
 */
export let toArray = maybe([], x => [x]);
/**
 * @function toBoolean
 * @summary Turns a nullable value into a boolean according to whether it is non-null
 * @param {?T} x
 * @returns {boolean} `x != null`
 */
export let toBoolean = isNonNull;
/**
 * @summary Transforms a function over non-null values to one over nullable values
 * @param {function(R): S} f
 * @returns {function(?R): ?S} `x => x == null : null : f(x)`
 */
export function bind(f) {
    return maybe(null, f);
}
/**
 * @function map
 * @summary An alias of `bind`
 * @see bind
 */
export let map = bind;
//# sourceMappingURL=Maybe.js.map