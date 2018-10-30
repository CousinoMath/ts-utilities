function isNumber(x: any): x is number {
    const xNum = Number(x);
    return xNum === x || Object.is(xNum, x);
}

function isString(x: any): x is string {
    return String(x) === x;
}

function isBoolean(x: any): x is boolean {
    return Boolean(x) === x;
}