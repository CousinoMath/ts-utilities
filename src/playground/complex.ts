class Complex {
  public static Cartesian(x: number, y: number): Complex {
      return new Complex(x, y);
  }

  public static Polar(r: number, t: number): Complex {
      return new Complex(r * Math.cos(t), r * Math.sin(t));
  }

  protected re: number;
  protected im: number;

  constructor(r: number, i: number) {
      this.re = r;
      this.im = i;
  }

  public get real(): number { return this.re; }
  public get imag(): number { return this.im; }
  public get arg(): number { return Math.atan2(this.im, this.re); }
  public get mod(): number { return Math.hypot(this.re, this.im); }

  public conj(): Complex {
      return new Complex(this.re, -this.im);
  }

  public plus(c2: Complex): Complex {
      return new Complex(this.re + c2.re, this.im + c2.im);
  }

  public minus(c2: Complex): Complex {
      return new Complex(this.re - c2.re, this.im - c2.im);
  }

  public negate(): Complex {
      return new Complex(-this.re, -this.im);
  }

  public times(c2: Complex): Complex {
      const re = this.re * c2.re - this.im * c2.im;
      const im = this.re * c2.im + this.im * c2.re;
      return new Complex(re, im);
  }

  public divides(c2: Complex): Complex {
      const re = this.re * c2.re + this.im * c2.im;
      const im = this.im * c2.re - this.re * c2.im;
      return new Complex(re / c2.mod, im / c2.mod);
  }

  public exp(): Complex {
      const r = Math.exp(this.re);
      return new Complex(r * Math.cos(this.im), r * Math.sin(this.im));
  }

  public log(): Complex {
      return new Complex(Math.log(this.mod), this.arg);
  }

  public power(c2: Complex) {
      return this.log().times(c2).exp();
  }
}

const I: Complex = new Complex(0, 1);
const negI: Complex = new Complex(0, -1);