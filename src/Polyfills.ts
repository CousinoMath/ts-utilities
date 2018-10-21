/**
 * @summary A polyfill for [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
 */
export function is(x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return (
      typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)
    );
  }
}

/**
 * @summary A polyfill for [Number.isInteger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)
 */
export function isInteger(value: number): boolean {
  return isFinite(value) && Math.floor(value) === value;
}

/**
 * @summary A polyfill for [Number.isNaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
 */
export function isNaN(value: number): boolean {
  return value !== value;
}

/**
 * @summary A polyfill for [Math.log2](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2)
 */
export function log2(x: number): number {
  return Math.log(x) / Math.LN2;
}

/**
 * @summary A polyfill for [Math.sign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign)
 */
export function sign(value: number): any {
  return Number(value > 0) - Number(value < 0) || +value;
}
