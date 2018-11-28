import { List, Tree } from '../src/index';

describe('Tree', () => {
  it('basics', () => {
    const tree1 = new Tree(1, new List());
    const tree2 = new Tree(2, new List());
    const tree3 = new Tree(3, new List());
    const tree4 = new Tree(4, new List([tree1, tree2, tree3]))
    const obj4 = { node: 4, children: new List([tree1, tree2, tree3]) };
    const tree5 = new Tree(5, new List([tree4]));
    const obj5 = { node: 5, children: new List([tree4]) };
    expect(jasmine.objectContaining(obj5)).toEqual(tree5);
    expect(jasmine.objectContaining(obj4)).toEqual(tree4);
    expect(jasmine.objectContaining(obj4)).toEqual(tree5.getChild(0));
    expect(true).toBe(tree5.hasChildren());
    expect(false).toBe(tree3.hasChildren());
    expect(false).toBe(tree4.isLeaf());
    expect(true).toBe(tree2.isLeaf());
    expect(1).toBe(tree5.numChildren());
    expect(3).toBe(tree4.numChildren());
    expect(0).toBe(tree1.numChildren());
    expect(5).toBe(tree5.value);
    expect(-1).toBe(tree5.setValue(-1).value);
  });
});