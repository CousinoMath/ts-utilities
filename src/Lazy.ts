import { identity } from './internal';

export class Lazy<T> {
  public static condense<A>(xll: Lazy<Lazy<A>>): Lazy<A> {
    return xll.bind(identity);
  }

  public static liftFn<A, B>(f: (x: A) => B): (xl: Lazy<A>) => Lazy<B> {
    return xl => xl.lift(f);
  }

  public static bindFn<A, B>(f: (x: A) => Lazy<B>): (x: Lazy<A>) => Lazy<B> {
    return xl => xl.bind(f);
  }

  private callback: () => T;
  private forced: boolean = false;

  constructor(xl: () => T) {
    this.callback = xl;
  }

  public get isComputed(): boolean {
    return this.forced;
  }

  public compute(): T {
    let val: T;
    try {
      val = this.callback();
      if (!this.forced) {
        this.callback = () => val;
        this.forced = true;
      }
      return val;
    } catch (err) {
      throw new Error('Too much recursion in trying to compute a lazy value');
    }
  }

  public lift<U>(f: (x: T) => U): Lazy<U> {
    return new Lazy(() => f(this.callback()));
  }

  public bind<U>(f: (x: T) => Lazy<U>): Lazy<U> {
    return new Lazy(() => f(this.callback()).callback());
  }
}
