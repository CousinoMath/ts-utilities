// import { Tuple } from "./Tuple";
// import { compose } from "./Utils";

// export default class Either<R,S> {
//   private _lvalue : R | null = null;
//   private _rvalue : S | null = null;

//   static Left<U,V>(x : U) : Either<U,V> {
//     let left = new Either<U,V>();
//     left._lvalue = x;
//     return left;
//   }

//   static Right<U,V>(y : V) : Either<U,V> {
//     let right = new Either<U,V>();
//     right._rvalue = y;
//     return right;
//   }

//   isRight() : boolean { return this._rvalue != null; }
//   isLeft() : boolean { return this._lvalue != null; }

//   either<T>(f : {(u:R): T}, g : {(v:S): T}) : T {
//     return (this.isRight() ? g(this._rvalue) : f(this._lvalue));
//   }

//   toPartition() : Tuple<Array<R>,Array<S>> {
//     return this.either(
//       function(x: R) { return new Tuple([x], new Array<S>()); },
//       function(y: S) { return new Tuple([], [y]); });
//   }

//   map<T,U>(f:{(x:R):T}, g:{(y:S):U}): Either<T,U> {
//     return this.either(
//       compose<R,T,Either<T,U>>(Either.Left)(f),
//       compose<S,U,Either<T,U>>(Either.Right)(g));
//   }

//   bindRight<T>(f: {(x: S): Either<R,T>}): Either<R,T> {
//     return this.either(function(a: R) { return Either.Left<R,T>(a); },
//     f);
//   }

//   bindLeft<T>(f: {(x: R): Either<T,S>}): Either<T,S> {
//     return this.either(f,
//       function(b: S) { return Either.Right<T,S>(b); });
//   }
// }
