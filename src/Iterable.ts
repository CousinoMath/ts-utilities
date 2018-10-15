import { constant, ident } from "./Function";

/**
 * @summary Applies a function over the elements of an iterable.
 */
export function map<S, T>(fn: (x: S) => T): (xs: Iterable<S>) => Iterable<T> {
  function* generatorT(xs: Iterable<S>): Iterable<T> {
    for (const x of xs) {
      yield fn(x);
    }
  }
  return generatorT;
}

/**
 * @summary Filter an iterable to one whose elements all make `pred` true.
 */
export function filter<T>(
  pred: (x: T) => boolean
): (xs: Iterable<T>) => Iterable<T> {
  function* generatorT(xs: Iterable<T>): Iterable<T> {
    for (const x of xs) {
      if (pred(x)) {
        yield x;
      }
    }
  }
  return generatorT;
}

/**
 * @summary Maps a function over elements of an iterable and concatenates the results.
 */
export function concatMap<S, T>(
  fn: (x: S) => Iterable<T>
): (xs: Iterable<S>) => Iterable<T> {
  function* generatorT(xs: Iterable<S>): Iterable<T> {
    for (const x of xs) {
      for (const y of fn(x)) {
        yield y;
      }
    }
  }
  return generatorT;
}

/**
 * @todo deal with negative `n`, positve and negative infinity
 * @summary Takes the first `n` elements of an iterable and return the results as an array.
 * @param n a positive integer
 */
export function take(n: number): <T>(xs: Iterable<T>) => T[] {
  if (!Number.isInteger(n) || n <= 0) {
    return constant([]);
  }
  return <T>(xs: Iterable<T>) => {
    const arr: T[] = [];
    let count = n;
    const iterT = xs[Symbol.iterator]();
    let nextT = iterT.next();
    while (count-- > 0 && !nextT.done) {
      arr.push(nextT.value);
      nextT = iterT.next();
    }
    return arr;
  };
}

/**
 * @todo deal with negative `n`, positive and negative infiniity
 * @summary Drops the first `n` elements of an iterable.
 * @param n a positive integer
 */
export function drop(n: number): <T>(xs: Iterable<T>) => Iterable<T> {
  if (!Number.isInteger(n) || n <= 0) {
    return ident;
  }
  return <T>(xs: Iterable<T>) => {
    let count = n;
    const iterT = xs[Symbol.iterator]();
    let nextT = iterT.next();
    while (count-- > 0 && !nextT.done) {
      nextT = iterT.next();
    }
    if (nextT.done) {
      return {
        [Symbol.iterator](): Iterator<T> {
          return {
            next(y?: any): IteratorResult<T> {
              return nextT;
            }
          };
        }
      };
    } else {
      return {
        [Symbol.iterator](): Iterator<T> {
          return iterT;
        }
      };
    }
  };
}

/**
 * @summary Takes the shortest subsequence of an iterable whose elements all make `pred` true.
 */
export function takeWhile<T>(
  pred: (x: T) => boolean
): (xs: Iterable<T>) => Iterable<T> {
  function* generatorT(xs: Iterable<T>): Iterable<T> {
    const prev: T[] = [];
    for (const x of xs) {
      if (!pred(x)) {
        return prev.length === 0 ? undefined : prev.pop();
      }
      if (prev.length > 0) {
        yield prev[(prev.length = 1)];
        prev.pop();
        prev.push(x);
      } else {
        prev.push(x);
      }
    }
  }
  return generatorT;
}

/**
 * @summary Drops the shortest subsequence of an iterable whose elements all make `pred` true.
 */
export function dropWhile<T>(
  pred: (x: T) => boolean
): (xs: Iterable<T>) => Iterable<T> {
  return xs => {
    const iterT = xs[Symbol.iterator]();
    let nextT = iterT.next();
    while (!nextT.done && pred(nextT.value)) {
      nextT = iterT.next();
    }
    return {
      [Symbol.iterator](): Iterator<T> {
        if (nextT.done) {
          return {
            next(y?: any): IteratorResult<T> {
              return nextT;
            }
          };
        } else {
          // @todo this skips over the first false result
          return iterT;
        }
      }
    };
  };
}

/**
 * @summary Returns an infinite iterable which cycles through the elements of `xs`
 */
export function* cycle<T>(xs: Iterable<T>): Iterable<T> {
  while (true) {
    for (const x of xs) {
      yield x;
    }
  }
}

/**
 * @summary Returns an infinite iterable which repeatedly returns `x`
 */
export function* repeat<T>(x: T): Iterable<T> {
  while (true) {
    yield x;
  }
}

/**
 * @summary Returns the infinite iterable `(0, 1, 2, 3, ...)`.
 */
export function* naturals(): Iterable<number> {
  let n = 0;
  while (true) {
    yield n++;
  }
}

/**
 * @summary Returns true if and only if every element of the iterable makes `pred` true.
 */
export function every<T>(
  pred: (x: T) => boolean
): (xs: Iterable<T>) => boolean {
  //   return iterable<T, boolean>(true, (accu, x) => accum && pred(x));
  return xs => {
    for (const x of xs) {
      if (!pred(x)) {
        return false;
      }
    }
    return true;
  };
}

/**
 * @summary Returns true if and only if there is at least one element of the iterable which makes `pred` true.
 */
export function some<T>(pred: (x: T) => boolean): (xs: Iterable<T>) => boolean {
  //   return iterable<T, boolean>(false, (accum, x) => accum || pred(x));
  return xs => {
    for (const x of xs) {
      if (pred(x)) {
        return true;
      }
    }
    return false;
  };
}

/**
 * @summary Applies a reduction over the elements of an iterable.
 * @see [[iterable]]
 */
export function reduce<S, T>(
  fn: (accum: T, x: S) => T,
  init: T
): (xs: Iterable<S>) => T {
  return iterable(init, fn);
}

/**
 * @summary Applies a reduction over the elements of an iterable and returns the partial results
 */
export function accumulate<S, T>(
  fn: (accum: T, x: S) => T,
  init: T
): (xs: Iterable<S>) => Iterable<T> {
  function* generatorT(xs: Iterable<S>): Iterable<T> {
    let valT = init;
    yield valT;
    for (const x of xs) {
      valT = fn(valT, x);
      yield valT;
    }
  }
  return generatorT;
}

/**
 * @summary Zips up two iterables into one iterable of tuples.
 */
export function zip<S, T>(xs: Iterable<S>, ys: Iterable<T>): Iterable<[S, T]> {
  return {
    [Symbol.iterator](): Iterator<[S, T]> {
      const iterS = xs[Symbol.iterator]();
      const iterT = ys[Symbol.iterator]();
      let nextS = iterS.next();
      let nextT = iterT.next();
      return {
        next(y?: any): IteratorResult<[S, T]> {
          const done = nextS.done && nextT.done;
          const value: [S, T] = [nextS.value, nextT.value];
          nextS = iterS.next();
          nextT = iterT.next();
          return { done, value };
        }
      };
    }
  };
}

/**
 * @summary Unzips an iterable of tuples into a tuple of iterables.
 */
export function unzip<S, T>(xys: Iterable<[S, T]>): [Iterable<S>, Iterable<T>] {
  const iterS: S[] = [];
  const iterT: T[] = [];
  for (const [x, y] of xys) {
    iterS.push(x);
    iterT.push(y);
  }
  return [iterS, iterT];
}

/**
 * @summary Builds functions over iterables recursively.
 */
export function iterable<S, T>(
  init: T,
  fn: (accum: T, x: S) => T
): (xs: Iterable<S>) => T {
  return xs => {
    let valT = init;
    for (const x of xs) {
      valT = fn(valT, x);
    }
    return valT;
  };
}

export function* concat<T>(xs: Iterable<T>, ys: Iterable<T>): Iterable<T> {
  for (const x of xs) {
    yield x;
  }
  for (const y of ys) {
    yield y;
  }
}
