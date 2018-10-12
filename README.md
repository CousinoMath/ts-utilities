# CousinoMath Utilities #

This is a [Haskell](https://www.haskell.org/) inspired utility
library for TypeScript. It's designed to provide some handy tools
from the world of functional programming, without being "*overly*"
functional.

## Contents ##

### Types ###

New types and aliases introduced by this library.

* `Either` is a generic discrimated union, useful for functional
  style error error tracking
* `Maybe` an alias for nullable types, which can be useful when
  using the compiler options `strict` or `strictNullChecks`

### Other Files ###

* `src/index.ts` reexports everything
* `src/Array.ts` various utilities for arrays
* `src/Function.ts` functional style programming utilities

## Either ##

The type `Either<R, S>` is similar to Typescript's union type
`R | S` in that the values can either be of type `R` or of type
`S`. The difference is that you don't need type guards or literal
types with Either. In other words, while the type
`number | number` is the same as type number,
`Either<number, number>` is not the same as number.
This either type carries, along with a number, a notion
of "left" and "right". This is useful when you want to write a
generic function that takes a parameter which can either be of
type `R` or of type `S`. It turns out not to be possible in
Typescript to write meaningful functions with type signature
`(rs: R | S) => T` with `R` and `S` being generic type variables.
You can however write functions with the signature
`(rs: Either<R, S>) => T`.

Either types have been found to be useful when handling errors
in a functional style. The most basic error reporting utilizes
types of the kind `Either<string, T>`, where a successful result
is kept in the right as a `T` value, and an error (in the form of
a string error message) is kept in the left. This can extend to
more generic errors which have their own types `Error<E>`. For
example, if you're being vary cautious with arrays, you'll want
to watch for RangeError. You can write functions that produce
an `Either<RangeError, T[]>` value which will be populated with
an array when successful and a RangeError encountered when
trying to create an array of negative length for example. Consumers
of `Either<RangeError, T[]>` values can easily detect whether the
value they've been given is a successful result or an error. This
allows them to continue to operate on arrays when successful or to
deal the erroneous result.

## Maybe ##

The `Maybe<T>` type is an alias for nullable types, i.e.
`T | null`. This is handy when working under the compiler options
"strict" or "strictNullChecks". Included are utility functions to
set default values for maybe values as well as transform functions
so that they can deal with maybes. There is one subtle distinction
to be made regarding functions with optional parameters, e.g.
`(x?: T) => S`. These optional parameters are not the same as
having a parameter with a maybe type. For example, any function
`f: (x?: T) => S` can be called as `f(x)` for some `x: T` *or* it
can be called as `f()` which no arguments, in effect making `x`
`undefined`. Whereas, calling any function `f: (x: Maybe<T>) => S`
as `f()` will result in compiler errors, because such a function
must take exactly one argument.

