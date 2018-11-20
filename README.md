# CousinoMath Utilities

This is a [Haskell](https://www.haskell.org/) inspired utility
library for TypeScript. It's designed to provide some handy tools
from the world of functional programming, without being "_overly_"
functional.

## Contents

- [Usage](#usage)
  - [Brief Overview](#brief)
    - [Types](#types)
    - [Classes](#classes)
    - [Other notable files](#files)
  - [Detailed Overview](#detailed)
    - [Either](#Either)
    - [Maybe](#Maybe)
    - [Lists](#Lists)
- [Examples](#examples)
- [Package Scripts](#package)
  - [Installation](#install)
  - [Documentation](#docs)
  - [Testing](#tests)
- [License](#license)

## <a name="usage">Usage</a>

### <a name="brief">Brief Overview</a>

#### <a name="types">Types</a>

New types and aliases introduced by this library.

- [[Either]] is a generic discrimated union, useful for functional
  style error handling. [More details on Either](#Either)
- [[Maybe]] an alias for nullable types, which can be useful when
  using the Typescript compiler options `strict` or `strictNullChecks`.
  [More details on Maybe](#Maybe)

#### <a name="classes">Classes</a>

- [[List]] and [[NonEmptyList]] are lightweight array wrappers that are both
  type safe and immutable. If you feel ES5 arrays are too restrictive, these
  classes will give you more flexibility while having compatible methods and
  quick conversions to and from arrays. [More details on Lists](#Lists)

#### <a name="files">Other notable files</a>

- `src/Array.ts` various utilities for arrays
- `src/Function.ts` functional style programming utilities
- `src/Polyfills.ts` some "polyfills" (they don't actually extended the
  standard types) for ES5 including an `Object.is`, `Number.isNaN`, and
  `Math.sign`.

### <a name="detailed">Detailed Usage Descriptions</a>

#### <a name="Either">Either</a>

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

#### <a name="Maybe">Maybe</a>

The `Maybe<T>` type is an alias for nullable types, i.e.
`T | null`. This is handy when working under the compiler options
"strict" or "strictNullChecks". Included are utility functions to
set default values for maybe values as well as transform functions
so that they can deal with maybes. There is one subtle distinction
to be made regarding functions with optional parameters, e.g.
`(x?: T) => S`. These optional parameters are not the same as
having a parameter with a maybe type. For example, any function
`f: (x?: T) => S` can be called as `f(x)` for some `x: T` _or_ it
can be called as `f()` which no arguments, in effect making `x`
`undefined`. Whereas, calling any function `f: (x: Maybe<T>) => S`
as `f()` will result in compiler errors, because such a function
must take exactly one argument.

#### <a name="Lists">Lists</a>

TODO

## <a name="examples">Examples</a>

## <a name="package">Package Scripts</a>

### <a name="install">Installation</a>

### <a name="docs">Documentation</a>

`yarn docs` generates [TypeDoc][] documentation from the files in `src/` and
outputs the results to `doc/`. If you have custom TypeDoc themes, (please
share) use `yarn docs:json` to generate the TypeDoc JSON for your custom
processing.


### <a name="tests">Testing</a>

`yarn test` runs [Jasmine][] test suites found in `spec/`. And `yarn coverage`
generates an [Istanbull/nyc][nyc] test coverage report using the default text
reporter.

## [license][License]

This project employs an [MIT license][license]

[Jasmine]: https://jasmine.github.io/
[TypeDoc]: https://typedoc.org/
[nyc]: https://istanbul.js.org/
[license]: ./LICENSE.md