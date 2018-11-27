import { List, ListWalker } from '../src/index';

describe('ListWalker', () => {
    it('*', () => {
        const lw = ListWalker.fromArray([1, 2, 3, 4]);
        expect(lw.isEmpty()).toBe(false);
        expect(ListWalker.fromList(new List<number>()).isEmpty()).toBe(true);
        // lw2 = 4:[3, 2, 1]:[]
        let lw2 = lw.moveAhead().moveAhead().moveAhead();
        expect(lw2.hasMoreAhead()).toBe(false);
        expect(lw2.hasMoreBehind()).toBe(true);
        expect(lw2.length).toBe(4);
        expect(lw2.current).toBe(4);
        // lw2 = 4:[3, 2, 1]:[]
        lw2 = lw2.moveAhead();
        expect(lw2.hasMoreAhead()).toBe(false);
        expect(lw2.hasMoreBehind()).toBe(true);
        expect(lw2.length).toBe(4);
        expect(lw2.current).toBe(4);
        // lw2 = 3:[2, 1]:[4]
        lw2 = lw2.moveBehind();
        expect(lw2.hasMoreAhead()).toBe(true);
        expect(lw2.hasMoreBehind()).toBe(true);
        expect(lw2.length).toBe(4);
        expect(lw2.current).toBe(3);
        // lw2 = 2:[1]:[2, 3, 4]
        lw2 = lw2.moveBehind();
        expect(lw2.hasMoreAhead()).toBe(true);
        expect(lw2.hasMoreBehind()).toBe(true);
        expect(lw2.length).toBe(4);
        expect(lw2.current).toBe(2);
        // lw2 = 1:[]:[2, 3, 4]
        lw2 = lw2.moveBehind();
        expect(lw2.hasMoreAhead()).toBe(true);
        expect(lw2.hasMoreBehind()).toBe(false);
        expect(lw2.length).toBe(4);
        expect(lw2.current).toBe(1);
        // lw2 = 1:[]:[2, 3, 4]
        lw2 = lw2.moveBehind();
        expect(lw2.hasMoreAhead()).toBe(true);
        expect(lw2.hasMoreBehind()).toBe(false);
        expect(lw2.length).toBe(4);
        expect(lw2.current).toBe(1);
    });
});