export class Tree<T> {
  protected node: T;
  protected children: Array<Tree<T>>;

  constructor(value: T) {
    this.node = value;
    this.children = [];
  }

  public hasChildren(): boolean {
    return this.children.length === 0;
  }

  public numChildren(): number {
    return this.children.length;
  }
}
