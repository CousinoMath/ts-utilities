export function select<T, K extends keyof T>(obj: T, names: K[]): Partial<T> {
  const result: Partial<T> = {};
  for (const name of names) {
    if (obj.hasOwnProperty(name)) {
      result[name] = obj[name];
    }
  }
  return result;
}

export function where<T>(
  obj: T,
  pred: (val: T[keyof T]) => boolean
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && pred(obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function jsonType(obj: any): string {
  const typeStr = typeof obj;
  switch (typeStr) {
    case 'number':
    case 'string':
    case 'boolean':
      return typeStr;
    default:
      return Array.isArray(obj) ? 'array' : 'object';
  }
}
