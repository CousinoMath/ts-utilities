// /**
//  * Helpers for finite and infinite Iterables
//  */

// // import { ident } from './Functions';

// /**
//  * @summary Applies a function over the elements of an iterable.
//  */
// export function map<S, T>(fn: (x: S) => T): (xs: Iterable<S>) => Iterable<T> {
//   function* generatorT(xs: Iterable<S>): Iterable<T> {
//     for (const x of xs) {
//       yield fn(x);
//     }
//   }
//   return generatorT;
// }

// /**
//  * @summary Filter an iterable to one whose elements all make `pred` true.
//  */
// export function filter<T>(
//   pred: (x: T) => boolean
// ): (xs: Iterable<T>) => Iterable<T> {
//   function* generatorT(xs: Iterable<T>): Iterable<T> {
//     for (const x of xs) {
//       if (pred(x)) {
//         yield x;
//       }
//     }
//   }
//   return generatorT;
// }

// /**
//  * @summary Maps a function over elements of an iterable and concatenates the results.
//  */
// export function concatMap<S, T>(
//   fn: (x: S) => Iterable<T>
// ): (xs: Iterable<S>) => Iterable<T> {
//   function* generatorT(xs: Iterable<S>): Iterable<T> {
//     for (const x of xs) {
//       for (const y of fn(x)) {
//         yield y;
//       }
//     }
//   }
//   return generatorT;
// }

// /**
//  * @summary Takes the first `n` elements of an iterable and return the results as an array.
//  * @param n a positive integer
//  */
// export function take(n: number): <T>(xs: Iterable<T>) => Iterable<T> {
//   if (!Number.isInteger(n) || Math.abs(n) === 0) {
//     return <T>(xs: Iterable<T>) => [];
//   }
//   if (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) {
//     return ident;
//   }
//   if (n > 0) {
//     return <T>(xs: Iterable<T>) => {
//       const arr: T[] = [];
//       let count = n;
//       const iterT = xs[Symbol.iterator]();
//       let nextT = iterT.next();
//       while (count-- > 0 && !nextT.done) {
//         arr.push(nextT.value);
//         nextT = iterT.next();
//       }
//       return arr;
//     };
//   } else {
//     return <T>(xs: Iterable<T>) => {
//       return {
//         [Symbol.iterator](): Iterator<T> {
//           const keep: T[] = [];
//           const iterT = xs[Symbol.iterator]();
//           let nextT = iterT.next();
//           let count = 0;
//           while (count-- > n && !nextT.done) {
//             keep.push(nextT.value);
//             nextT = iterT.next();
//           }
//           while (!nextT.done) {
//             keep.shift();
//             keep.push(nextT.value);
//             nextT = iterT.next();
//           }
//           return keep[Symbol.iterator]();
//         }
//       };
//     };
//   }
// }

// /**
//  * @summary Drops the first `n` elements of an iterable.
//  * @param n a positive integer
//  */
// export function drop(n: number): <T>(xs: Iterable<T>) => Iterable<T> {
//   if (Number.isNaN(n) || n === 0) {
//     return ident;
//   }
//   if (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) {
//     return <T>(xs: Iterable<T>) => [];
//   }
//   if (n > 0) {
//     return <T>(xs: Iterable<T>) => {
//       let count = n;
//       const iterT = xs[Symbol.iterator]();
//       let nextT = iterT.next();
//       while (count-- > 0 && !nextT.done) {
//         nextT = iterT.next();
//       }
//       if (nextT.done) {
//         return {
//           [Symbol.iterator](): Iterator<T> {
//             return {
//               next(y?: any): IteratorResult<T> {
//                 return nextT;
//               }
//             };
//           }
//         };
//       } else {
//         return {
//           [Symbol.iterator](): Iterator<T> {
//             return iterT;
//           }
//         };
//       }
//     };
//   } else {
//     return <T>(xs: Iterable<T>) => {
//       const keep: T[] = [];
//       const discard: T[] = [];
//       const iterT = xs[Symbol.iterator]();
//       let nextT = iterT.next();
//       let count = 0;

//       while (count-- > n && !nextT.done) {
//         discard.push(nextT.value);
//         nextT = iterT.next();
//       }
//       while (!nextT.done) {
//         keep.push(discard[0]);
//         discard.shift();
//         discard.push(nextT.value);
//       }
//       return keep;
//     };
//   }
// }

// /**
//  * @summary Takes the shortest subsequence of an iterable whose elements all make `pred` true.
//  */
// export function takeWhile<T>(
//   pred: (x: T) => boolean
// ): (xs: Iterable<T>) => Iterable<T> {
//   function* generatorT(xs: Iterable<T>): Iterable<T> {
//     const prev: T[] = [];
//     for (const x of xs) {
//       if (!pred(x)) {
//         return prev.length === 0 ? undefined : prev.pop();
//       }
//       if (prev.length > 0) {
//         yield prev[(prev.length = 1)];
//         prev.pop();
//         prev.push(x);
//       } else {
//         prev.push(x);
//       }
//     }
//   }
//   return generatorT;
// }

// /**
//  * @summary Drops the shortest subsequence of an iterable whose elements all make `pred` true.
//  */
// export function dropWhile<T>(
//   pred: (x: T) => boolean
// ): (xs: Iterable<T>) => Iterable<T> {
//   return xs => {
//     const iterT = xs[Symbol.iterator]();
//     let nextT = iterT.next();
//     while (!nextT.done && pred(nextT.value)) {
//       nextT = iterT.next();
//     }
//     return {
//       [Symbol.iterator](): Iterator<T> {
//         if (nextT.done) {
//           return {
//             next(y?: any): IteratorResult<T> {
//               return nextT;
//             }
//           };
//         } else {
//           // @todo this skips over the first false result
//           return iterT;
//         }
//       }
//     };
//   };
// }

// /**
//  * @summary Returns an infinite iterable which cycles through the elements of `xs`
//  */
// export function* cycle<T>(xs: Iterable<T>): Iterable<T> {
//   while (true) {
//     for (const x of xs) {
//       yield x;
//     }
//   }
// }

// /**
//  * @summary Returns an infinite iterable which repeatedly returns `x`
//  */
// export function* repeat<T>(x: T): Iterable<T> {
//   while (true) {
//     yield x;
//   }
// }

// /**
//  * @summary Returns the infinite iterable `(0, 1, 2, 3, ...)`.
//  */
// export function* naturals(): Iterable<number> {
//   let n = 0;
//   while (true) {
//     yield n++;
//   }
// }

// /**
//  * @summary Returns true if and only if every element of the iterable makes `pred` true.
//  * Short-circuits once a false is observed.
//  */
// export function every<T>(
//   pred: (x: T) => boolean
// ): (xs: Iterable<T>) => boolean {
//   return xs => {
//     for (const x of xs) {
//       if (!pred(x)) {
//         return false;
//       }
//     }
//     return true;
//   };
// }

// /**
//  * @summary Returns true if and only if there is at least one element of the iterable which makes `pred` true.
//  * Short-circuits once a true is observed.
//  */
// export function some<T>(pred: (x: T) => boolean): (xs: Iterable<T>) => boolean {
//   return xs => {
//     for (const x of xs) {
//       if (pred(x)) {
//         return true;
//       }
//     }
//     return false;
//   };
// }

// /**
//  * @summary Applies a reduction over the elements of an iterable.
//  * @see [[iterable]]
//  */
// export function reduce<S, T>(
//   fn: (accum: T, x: S) => T,
//   init: T
// ): (xs: Iterable<S>) => T {
//   return iterable(init, fn);
// }

// /**
//  * @summary Applies a reduction over the elements of an iterable and returns the partial results
//  */
// export function accumulate<S, T>(
//   fn: (accum: T, x: S) => T,
//   init: T
// ): (xs: Iterable<S>) => Iterable<T> {
//   function* generatorT(xs: Iterable<S>): Iterable<T> {
//     let valT = init;
//     yield valT;
//     for (const x of xs) {
//       valT = fn(valT, x);
//       yield valT;
//     }
//   }
//   return generatorT;
// }

// /**
//  * @summary Zips up two iterables into one iterable of tuples.
//  * Stops as soon as one of the two iterables stops.
//  */
// export function zip<S, T>(xs: Iterable<S>, ys: Iterable<T>): Iterable<[S, T]> {
//   return {
//     [Symbol.iterator](): Iterator<[S, T]> {
//       const iterS = xs[Symbol.iterator]();
//       const iterT = ys[Symbol.iterator]();
//       let nextS = iterS.next();
//       let nextT = iterT.next();
//       return {
//         next(y?: any): IteratorResult<[S, T]> {
//           const done = nextS.done && nextT.done;
//           const value: [S, T] = [nextS.value, nextT.value];
//           nextS = iterS.next();
//           nextT = iterT.next();
//           return { done, value };
//         }
//       };
//     }
//   };
// }

// /**
//  * @summary Unzips an iterable of tuples into a tuple of iterables.
//  */
// export function unzip<S, T>(xys: Iterable<[S, T]>): [Iterable<S>, Iterable<T>] {
//   const iterS: S[] = [];
//   const iterT: T[] = [];
//   for (const [x, y] of xys) {
//     iterS.push(x);
//     iterT.push(y);
//   }
//   return [iterS, iterT];
// }

// /**
//  * @summary Builds functions over iterables recursively.
//  */
// export function iterable<S, T>(
//   init: T,
//   fn: (accum: T, x: S) => T
// ): (xs: Iterable<S>) => T {
//   return xs => {
//     let valT = init;
//     for (const x of xs) {
//       valT = fn(valT, x);
//     }
//     return valT;
//   };
// }

// /**
//  * @summary Joins together an iterable collection of iterables
//  * Be careful regarding infinite iterables.
//  */
// export function* concat<T>(xss: Iterable<Iterable<T>>): Iterable<T> {
//   for (const xs of xss) {
//     for (const x of xs) {
//       yield x;
//     }
//   }
// }

// /**
//  * @summary Interleaves two iterables into one.
//  * Stops as soon as one of the two iterables stops.
//  */
// export function interleave<T>(xs: Iterable<T>, ys: Iterable<T>): Iterable<T> {
//   return {
//     [Symbol.iterator](): Iterator<T> {
//       const iterX = xs[Symbol.iterator]();
//       const iterY = ys[Symbol.iterator]();
//       let turnX = true;
//       let lastT = iterX.next();
//       let done = lastT.done;
//       return {
//         next(y?: any): IteratorResult<T> {
//           if (done) {
//             return lastT;
//           }
//           const nextT = lastT;
//           turnX = !turnX;
//           lastT = turnX ? iterX.next() : iterY.next();
//           done = done || lastT.done;
//           return nextT;
//         }
//       };
//     }
//   };
// }

// /**
//  * @summary Returns an iterable that generates only unique values.
//  * This uses a Set as a cache for values that have been seen
//  * already. So mindful of the space consumed when passing in
//  * a large iterable.
//  */
// export function* unique<T>(xs: Iterable<T>): Iterable<T> {
//   const seen = new Set<T>();
//   for (const x of xs) {
//     if (!seen.has(x)) {
//       seen.add(x);
//       yield x;
//     }
//   }
// }

// /**
//  * @summary Bundles the results of an iterable into groups of `n`.
//  * `n` is allowed to be +Infinity, in which case, the first
//  * bundle returned contains everything. Be careful about
//  * infinite iterables.
//  */
// export function bundle(n: number): <T>(xs: Iterable<T>) => Iterable<T[]> {
//   if ((!Number.isInteger(n) && n !== Number.POSITIVE_INFINITY) || n <= 1) {
//     return <T>(xs: Iterable<T>) => map((x: T) => [x])(xs);
//   }
//   function* generator<T>(xs: Iterable<T>): Iterable<T[]> {
//     let nextBundle: T[] = [];
//     for (const x of xs) {
//       if (nextBundle.length < n) {
//         nextBundle.push(x);
//       } else {
//         yield nextBundle;
//         nextBundle = [];
//       }
//     }
//     return nextBundle;
//   }
//   return generator;
// }

// /**
//  * @summary Generates all values from an iterable and returns them as an array.
//  * This function short-circuits when `xs` is an array. Be
//  * careful about infinite iterables.
//  */
// export function toArray<T>(xs: Iterable<T>): T[] {
//   if (xs instanceof Array) {
//     return xs as T[];
//   }
//   const arr: T[] = [];
//   const iterT = xs[Symbol.iterator]();
//   let nextT = iterT.next();
//   while (!nextT.done) {
//     arr.push(nextT.value);
//     nextT = iterT.next();
//   }
//   return arr;
// }
