import { List } from "./internal";

export class Tree<T> {
    protected node: T;
    protected children: List<Tree<T>> = new List([]);

    constructor(val: T) {
        this.node = val;
    }

    
}