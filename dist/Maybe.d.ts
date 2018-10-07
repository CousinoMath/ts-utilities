declare type Maybe<T> = T | null;
/**
 * @summary Universal property of nullable types
 * @param {S} nil
 * @param {function(T): S} f
 * @returns {function(?T): S} `x => x == null ? nil : f(x)`
 */
export declare function maybe<T, S>(nil: S, f: (x: T) => S): (x: Maybe<T>) => S;
/**
 * @function isNonNull
 * @summary Tests if a nullable value is not null
 * @param {?T} x
 * @returns {boolean} `x != null`
 */
export declare let isNonNull: (x: Maybe<{}>) => boolean;
/**
 * @function isNull
 * @summary Tests if a nullable value is null
 * @param {?T} x
 * @returns {boolean} `x == null`
 */
export declare let isNull: (x: Maybe<{}>) => boolean;
/**
 * @summary Returns the value from a nullable value or a default value
 * @param {T} d default value
 * @returns {function(?T): T} `x => x == null ? d : x`
 */
export declare function defaultTo<T>(d: T): (x: Maybe<T>) => T;
/**
 * @function toArray
 * @summary Turns a nullable value into an array
 * @param {?T} x
 * @returns {Array<T>} `x => x == null ? [] : [x]`
 */
export declare let toArray: (x: Maybe<{}>) => {}[];
/**
 * @function toBoolean
 * @summary Turns a nullable value into a boolean according to whether it is non-null
 * @param {?T} x
 * @returns {boolean} `x != null`
 */
export declare let toBoolean: (x: Maybe<{}>) => boolean;
/**
 * @summary Transforms a function over non-null values to one over nullable values
 * @param {function(R): S} f
 * @returns {function(?R): ?S} `x => x == null : null : f(x)`
 */
export declare function bind<T, S>(f: (x: T) => S): (xm: Maybe<T>) => Maybe<S>;
/**
 * @function map
 * @summary An alias of `bind`
 * @see bind
 */
export declare let map: typeof bind;
export {};
