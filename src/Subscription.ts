class Subscription<T> {
  protected subs: Array<(x: T) => void> = [];

  public subscribe(sub: (x: T) => void): void {
    this.subs.push(sub);
  }

  public unsubscribe(sub: (x: T) => void): void {
    const idx = this.subs.indexOf(sub);
    if (idx >= 0) {
      this.subs.splice(idx, 1);
    }
  }

  public notifySubscribers(x: T): void {
      this.subs.forEach(sub => sub(x));
  }
}
