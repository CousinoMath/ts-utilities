import { bottom, isNonNull, isNull, Maybe } from './internal';

function isString(x: any): x is string {
  return typeof x === 'string';
}

export class Rope {
  private static clone(r: Rope): Rope {
    /* Returns a clone of the given rope but with cloned ancestors
         */
    let oldCurrent = r;
    const newNode = Rope.nodeClone(r);
    let newCurrent = newNode;
    let oldParent = oldCurrent.parent;
    while (isNonNull(oldParent)) {
      /* Invariants:
             *   oldCurrent.parent === oldParent
             *   oldParent & oldCurrent are immutable/unmodified
             */
      const newParent = Rope.nodeClone(oldParent);
      if (oldParent.left === oldCurrent) {
        // current is a left child
        newParent.left = newCurrent;
        newCurrent.parent = newParent;
      } else {
        // current is a right child
        newParent.right = newCurrent;
        newCurrent.parent = newParent;
      }
      // Move up the tree
      oldCurrent = oldParent;
      oldParent = oldCurrent.parent;
      newCurrent = newParent;
    }
    // Return the cloned node
    return newNode;
  }

  private static nodeClone(r: Rope): Rope {
    // Returns an exact clone of only the node r
    const clone = new Rope();
    clone.length = r.length;
    clone.height = r.height;
    clone.left = r.left;
    clone.right = r.right;
    clone.substr = r.substr;
    clone.parent = r.parent;
    return clone;
  }

  private length = 0;
  private height = 0;
  private left: Maybe<Rope> = bottom;
  private right: Maybe<Rope> = bottom;
  private parent: Maybe<Rope> = bottom;
  private substr: Maybe<string> = bottom;

  // tslint:disable-next-line
  constructor() {}

  public append(xrs: Rope | string): Rope {
    if (isNull(this.right)) {
      let r: Rope;
      if (isString(xrs)) {
        r = new Rope();
        r.substr = xrs;
        r.length = xrs.length;
      } else {
        r = Rope.clone(xrs);
      }
      const newNode = Rope.clone(this);
      newNode.right = r;
      r.parent = newNode;
      return newNode.toRoot();
    } else {
      return this.right.append(xrs);
    }
  }

  public toString(start = 0, length = this.length): string {
    let result = '';
    const stack: Array<[Rope, number, number]> = [[this, start, length]];
    let stackLen = 1;

    while (stackLen > 0) {
      const [current, begin, len] = stack[stackLen - 1];
      const left = current.left;
      const hasLeft = isNonNull(left);
      const right = current.right;
      const hasRight = isNonNull(right);
      const str = current.substr;
      stack.pop();
      stackLen--;

      if (hasLeft || hasRight) {
        /*  Indices of left + right:
         *    0 --- left.length - 1, left.length --- left.length + right.length - 1
         *  Indices of substring:
         *    begin --- len - 1 + begin
         */
        // Length of the substring plucked from left
        const leftSubLen = hasLeft ? left!.length - begin : 0;
        if (hasRight && len > leftSubLen) {
            /*  Indices of right substring:
             *    0 --- (len - 1) - (left.length - begin)
             */
          stack.push([right!, 0, len - leftSubLen]);
          stackLen++;
        }
        if (hasLeft && leftSubLen > 0) {
            /*  Indices of left substring:
             *    begin --- left.length - 1
             */
          stack.push([left!, begin, leftSubLen]);
          stackLen++;
        }
        continue;
      }
      if (isNonNull(str)) {
        result += str.substr(begin, len);
      }
    }
    return result;
  }

  private toRoot(): Rope {
    // tslint:disable-next-line
    let current: Rope = this;
    while (isNonNull(current.parent)) {
      current = current.parent;
    }
    return current;
  }
}
