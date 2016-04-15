"use strict";
const Maybe_1 = require("./Maybe");
class Tree {
    constructor(value) {
        this.node = value;
        this.children = [];
    }
    hasChildren() {
        return this.children.length == 0;
    }
    numChildren() {
        return this.children.length;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tree;
class TreeZipper {
    constructor(tree, prev, next, cntxt) {
        this.currTree = tree;
        this.prevSiblings = prev;
        this.nextSiblings = next;
        this.context = cntxt;
    }
    atRoot() {
        return this.context.isNothing();
    }
    ascend() {
        return this.context; //FIX: should just be TreeZipper<T>
    }
    atLeaf() {
        return this.currTree.hasChildren();
    }
    descend() {
        if (!this.atLeaf()) {
            var children = this.currTree.children;
            return new TreeZipper(children[0], [], children.slice(1), Maybe_1.default.Just(this));
        }
    }
    atFirstSibling() {
        return this.prevSiblings.length == 0;
    }
    prevSibling() {
        if (!this.atFirstSibling()) {
            var prev = this.prevSiblings;
            return new TreeZipper(prev[0], prev.slice(1), [this.currTree].concat(this.nextSiblings), this.context);
        }
    }
    atLastSibling() {
        return this.nextSiblings.length == 0;
    }
    nextSibling() {
        if (!this.atLastSibling()) {
            var next = this.nextSiblings;
            return new TreeZipper(next[0], [this.currTree].concat(this.prevSiblings), next.slice(1), this.context);
        }
    }
}
exports.TreeZipper = TreeZipper;
//# sourceMappingURL=Tree.js.map