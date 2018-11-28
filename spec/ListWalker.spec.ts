import { List, ListWalker } from '../src/index';

describe('ListWalker', () => {
  const fromArray = xs => ListWalker.fromArray<number>(xs);
  const fromList = (...xs) => ListWalker.fromList<number>(new List(...xs));
  it('traversing', () => {
    const lw = fromArray([1, 2, 3]);
    const len = 3;
    expect(lw.isEmpty()).toBe(false);
    expect(fromList(new List<number>()).isEmpty()).toBe(true);
    // lw2 = [4, 3, 2, 1]:[]
    let lw2 = lw
      .moveAhead()
      .moveAhead()
      .moveAhead()
      .moveAhead();
    expect(lw2.canMoveAhead()).toBe(false);
    expect(lw2.hasMoreAhead()).toBe(false);
    expect(lw2.canMoveBehind()).toBe(true);
    expect(lw2.hasMoreBehind()).toBe(true);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBeUndefined();
    // lw2 = [4, 3, 2, 1]:[]
    lw2 = lw2.moveAhead();
    expect(lw2.canMoveAhead()).toBe(false);
    expect(lw2.hasMoreAhead()).toBe(false);
    expect(lw2.canMoveBehind()).toBe(true);
    expect(lw2.hasMoreBehind()).toBe(true);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBeUndefined();
    // lw2 = [3, 2, 1]:[4]
    lw2 = lw2.moveBehind();
    expect(lw2.canMoveAhead()).toBe(true);
    expect(lw2.hasMoreAhead()).toBe(false);
    expect(lw2.canMoveBehind()).toBe(true);
    expect(lw2.hasMoreBehind()).toBe(true);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBe(4);
    // lw2 = [2, 1]:[3, 4]
    lw2 = lw2.moveBehind();
    expect(lw2.canMoveAhead()).toBe(true);
    expect(lw2.hasMoreAhead()).toBe(true);
    expect(lw2.canMoveBehind()).toBe(true);
    expect(lw2.hasMoreBehind()).toBe(true);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBe(3);
    // lw2 = [1]:[2, 3, 4]
    lw2 = lw2.moveBehind();
    expect(lw2.canMoveAhead()).toBe(true);
    expect(lw2.hasMoreAhead()).toBe(true);
    expect(lw2.canMoveBehind()).toBe(true);
    expect(lw2.hasMoreBehind()).toBe(true);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBe(2);
    // lw2 = []:[1, 2, 3, 4]
    lw2 = lw2.moveBehind();
    expect(lw2.canMoveAhead()).toBe(true);
    expect(lw2.hasMoreAhead()).toBe(true);
    expect(lw2.canMoveBehind()).toBe(false);
    expect(lw2.hasMoreBehind()).toBe(false);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBe(1);
    // lw2 = []:[1, 2, 3, 4]
    lw2 = lw2.moveBehind();
    expect(lw2.canMoveAhead()).toBe(true);
    expect(lw2.hasMoreAhead()).toBe(true);
    expect(lw2.canMoveBehind()).toBe(false);
    expect(lw2.hasMoreBehind()).toBe(false);
    expect(lw2.length).toBe(len);
    expect(lw2.current).toBe(1);
  });
  it('(insert|remove)Ahead', () => {
    const lw = fromList(1, 2, 3);
    const lw2 = lw
      .moveAhead()
      .moveAhead()
      .moveAhead();
    expect(lw.insertAhead(0)).toEqual(fromList(0, 1, 2, 3));
    expect(lw.removeAhead()).toEqual(fromList(2, 3));
    expect(lw2.insertAhead(4)).toEqual(
      fromList(1, 2, 3, 4)
        .moveAhead()
        .moveAhead()
        .moveAhead()
    );
    expect(lw2.removeAhead()).toEqual(lw2);
  });
});
