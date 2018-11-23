import { identity } from './internal';

/**
 * @summary A wrapper for lazy computations
 */
export class Lazy<T> {
  /**
   * @summary Condense many lazy wrappers into one
   * @param xll 
   */
  public static condense<A>(xll: Lazy<Lazy<A>>): Lazy<A> {
    return xll.bind(identity);
  }

  /**
   * @summary Lift a function to become a lazy one
   * @param f 
   */
  public static lift<A, B>(f: (x: A) => B): (xl: Lazy<A>) => Lazy<B> {
    return xl => xl.lift(f);
  }

  /**
   * @summary Binds a lazy-valued function to a lazy argument
   * @param f 
   */
  public static bind<A, B>(f: (x: A) => Lazy<B>): (xl: Lazy<A>) => Lazy<B> {
    return xl => xl.bind(f);
  }

  private callback: () => T;
  private forced: boolean = false;

  constructor(xl: () => T) {
    this.callback = xl;
  }

  /**
   * @summary A flag to determine if the lazy computation has been evaluated
   */
  public get isComputed(): boolean {
    return this.forced;
  }

  /**
   * @summary Evaluates a lazy computation (only if it hasn't already been evaluated).
   */
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

  /**
   * @summary Lifts a function onto the current lazy computation queue.
   * @param f 
   */
  public lift<U>(f: (x: T) => U): Lazy<U> {
    return new Lazy(() => f(this.callback()));
  }

  /**
   * @summary Binds a lazy-valued function onto the current lazy object.
   * @param f 
   */
  public bind<U>(f: (x: T) => Lazy<U>): Lazy<U> {
    return new Lazy(() => f(this.callback()).callback());
  }
}
