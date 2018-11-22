import { numberOrd, RedBlackTree } from '../src';
import { BinaryTreeNode } from '../src/trees/BinaryTree';
import { RedBlackNode } from '../src/trees/RedBlackTree';

describe('Red-black trees', () => {
  it('insert', () => {
      const eleven = new RedBlackNode(11);
      const two = new RedBlackNode(2);
      const fourteen = new RedBlackNode(14);
      eleven.isBlack = true;
      two.isBlack = false;
      fourteen.isBlack = true;
      BinaryTreeNode.setLeftChild(eleven, two);
      BinaryTreeNode.setRightChild(eleven, fourteen);
      const one = new RedBlackNode(1);
      const seven = new RedBlackNode(7);
      one.isBlack = seven.isBlack = true;
      BinaryTreeNode.setLeftChild(two, one);
      BinaryTreeNode.setRightChild(two, seven);
      const five = new RedBlackNode(5);
      const eight = new RedBlackNode(8);
      five.isBlack = eight.isBlack = false;
      BinaryTreeNode.setLeftChild(seven, five);
      BinaryTreeNode.setRightChild(seven, eight);
      const fifteen = new RedBlackNode(15);
      fifteen.isBlack = false;
      BinaryTreeNode.setRightChild(fourteen, fifteen);
      const tree = new RedBlackTree(numberOrd);
      tree.root = eleven;
      tree.insert(4);
      console.log(tree.root.toDebugString())
  });
});
