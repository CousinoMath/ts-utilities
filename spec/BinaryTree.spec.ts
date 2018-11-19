import { BinaryTree, numberOrd } from '../src/';
import { BinaryTreeNode } from '../src/trees/BinaryTree';
describe('BinaryTree', () => {
  function setLeftChildTo<T>(
    parent: BinaryTreeNode<T>,
    child: BinaryTreeNode<T>
  ): void {
    parent.left = child;
    child.parent = parent;
  }

  function setRightChildTo<T>(
    parent: BinaryTreeNode<T>,
    child: BinaryTreeNode<T>
  ): void {
    parent.right = child;
    child.parent = parent;
  }

  it('insertion', () => {
    const ord = numberOrd;
    const tree = new BinaryTree(ord)
      .insert(12)
      .insert(5)
      .insert(9)
      .insert(2)
      .insert(18)
      .insert(19)
      .insert(15)
      .insert(17)
      .insert(13);
    const twelve = new BinaryTreeNode(12);
    const five = new BinaryTreeNode(5);
    const eighteen = new BinaryTreeNode(18);
    setLeftChildTo(twelve, five);
    setRightChildTo(twelve, eighteen);
    const two = new BinaryTreeNode(2);
    const nine = new BinaryTreeNode(9);
    setLeftChildTo(five, two);
    setRightChildTo(five, nine);
    const fifteen = new BinaryTreeNode(15);
    const nineteen = new BinaryTreeNode(19);
    setLeftChildTo(eighteen, fifteen);
    setRightChildTo(eighteen, nineteen);
    const thirteen = new BinaryTreeNode(13);
    const seventeen = new BinaryTreeNode(17);
    setLeftChildTo(fifteen, thirteen);
    setRightChildTo(fifteen, seventeen);
    expect(tree.root!.toDebugString()).toEqual(twelve.toDebugString());
    tree.insert(19).insert(13.0);
    expect(tree.root!.toDebugString()).toEqual(twelve.toDebugString());
  });
  it('deletion', () => {
    const tree = new BinaryTree(numberOrd)
      .insert(15)
      .insert(5)
      .insert(16)
      .insert(3)
      .insert(12)
      .insert(20)
      .insert(10)
      .insert(13)
      .insert(18)
      .insert(23)
      .insert(6)
      .insert(7);
    const treeM13 = new BinaryTree(numberOrd)
      .insert(15)
      .insert(5)
      .insert(16)
      .insert(3)
      .insert(12)
      .insert(20)
      .insert(10)
      // .insert(13)
      .insert(18)
      .insert(23)
      .insert(6)
      .insert(7);
    const treeM16 = new BinaryTree(numberOrd)
      .insert(15)
      .insert(5)
      // .insert(16)
      .insert(20)
      .insert(3)
      .insert(12)
      .insert(18)
      .insert(23)
      .insert(10)
      .insert(13)
      .insert(6)
      .insert(7);
    const treeM5 = new BinaryTree(numberOrd)
      .insert(15)
      // .insert(5)
      .insert(6)
      .insert(16)
      .insert(3)
      .insert(12)
      .insert(20)
      .insert(10)
      .insert(13)
      .insert(18)
      .insert(23)
      .insert(7);
    expect(tree.delete(13).root!.toDebugString()).toEqual(
      treeM13.root!.toDebugString()
    );
    expect(tree.delete(16).root!.toDebugString()).toEqual(
      treeM16.root!.toDebugString()
    );
    expect(tree.delete(5).root!.toDebugString()).toEqual(
      treeM5.root!.toDebugString()
    );
  });
});
