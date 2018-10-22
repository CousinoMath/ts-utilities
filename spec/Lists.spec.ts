import { defaultTo, List, list, NonEmptyList } from '../src/index';
describe('List suites', () => {
  const make = List.make;
  const neMake = NonEmptyList.make;
  const empty: List<any> = make();
  describe('static methods', () => {
    it('and|or', () => {
      expect(List.and(empty)).toBe(true);
      expect(List.and(make(true, true, true))).toBe(true);
      expect(List.and(make(false, true, true))).toBe(false);
      expect(List.and(make(true, true, false))).toBe(false);
      expect(List.or(empty)).toBe(false);
      expect(List.or(make(false, false, false))).toBe(false);
      expect(List.or(make(true, false, false))).toBe(true);
      expect(List.or(make(false, false, true))).toBe(true);
    });
    it('concat', () => {
      expect(List.concat()).toEqual(empty);
      expect(List.concat(empty, empty)).toEqual(empty);
      expect(List.concat(make(1, 2, 3))).toEqual(make(1, 2, 3));
      expect(List.concat(make(1), make(2), make(3))).toEqual(make(1, 2, 3));
    });
    it('make', () => {
      expect(List.make()).toEqual(empty);
      expect(List.make(1, 2, 3, 4, 5)).toEqual(new List([1, 2, 3, 4, 5]));
    });
    it('range', () => {
      // expect(List.range(10)).toEqual(make(0, 1, 2, 3, 4, 5, 6, 7, 8, 9));
      // expect(List.range(0)).toEqual(empty);
      // expect(List.range(-1)).toEqual(empty);
      expect(List.range(1, 1)).toEqual(make(1));
      expect(List.range(1, 10)).toEqual(make(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
      expect(List.range(1, 10, 2)).toEqual(make(1, 3, 5, 7, 9));
      expect(List.range(10, 1, -2)).toEqual(make(10, 8, 6, 4, 2));
      expect(() => List.range(1, 10, 0)).toThrowError(
        'Invalid list length encountered in call to List.range'
      );
      expect(() => List.range(1, 10, -1)).toThrowError(
        'Invalid list length encountered in call to List.range'
      );
    });
    it('repeat', () => {
      expect(List.repeat(0, '')).toEqual(empty);
      expect(List.repeat(1, '')).toEqual(make(''));
      expect(List.repeat(5, '')).toEqual(make('', '', '', '', ''));
      expect(() => List.repeat(-1, '')).toThrowError(
        'Invalid list length encountered in a call to List.repeat'
      );
      expect(() => List.repeat(Math.pow(2, 32), '')).toThrowError(
        'Invalid list length encountered in a call to List.repeat'
      );
    });
    it('(un)?zip', () => {
      const strs = make('cat', 'is', 'suffering', 'from', 'what', 'we', 'vets');
      const nums = make(0, -1, 2, -3, 4, -5, 6, -7);
      expect(strs.zip(nums.take(5))).toEqual(
        make<[string, number]>(
          ['cat', 0],
          ['is', -1],
          ['suffering', 2],
          ['from', -3],
          ['what', 4]
        )
      );
      expect(List.unzip(strs.zip(nums.take(5)))).toEqual([
        strs.take(5),
        nums.take(5)
      ]);
    });
  });
  it('head|last|is(Non)?Empty|tail|init|length|size|nth', () => {
    // readonly properties + nth
    const nums = make(1, 2, 3, 4, 5);
    expect(empty.head).toBeNull();
    expect(nums.head).toBe(1);
    expect(empty.last).toBeNull();
    expect(nums.last).toBe(5);
    expect(empty.isEmpty).toBe(true);
    expect(nums.isEmpty).toBe(false);
    expect(empty.isNonEmpty()).toBe(false);
    expect(nums.isNonEmpty()).toBe(true);
    expect(empty.tail).toEqual(empty);
    expect(nums.tail).toEqual(make(2, 3, 4, 5));
    expect(empty.init).toEqual(empty);
    expect(nums.init).toEqual(make(1, 2, 3, 4));
    expect(empty.length).toBe(0);
    expect(nums.length).toBe(5);
    expect(empty.size).toBe(0);
    expect(nums.size).toBe(5);
    expect(empty.nth(0)).toBeNull();
    expect(nums.nth(0)).toBe(1);
    expect(nums.nth(4)).toBe(5);
    expect(nums.nth(-1)).toBeNull();
    expect(nums.nth(5)).toBeNull();
    const neNums = neMake(1, 2, 3, 4, 5);
    expect(neNums.head).toBe(1);
    expect(neNums.last).toBe(5);
    expect(neNums.isEmpty).toBe(false);
  });
  describe('methods', () => {
    it('accumulate(Right)?(With)?', () => {
      const nums = make(1, 3, 5, 7, 9);
      const plus = (x: number, y: number) => x + y;
      expect(nums.accumulate(plus, 0)).toEqual(make(0, 1, 4, 9, 16, 25));
      expect(empty.accumulate(plus, 0)).toEqual(make(0));
      expect(nums.accumulateRight(plus, 0)).toEqual(make(0, 9, 16, 21, 24, 25));
      expect(empty.accumulateRight(plus, 0)).toEqual(make(0));
      expect(nums.accumulateRightWith(plus)).toEqual(make(9, 16, 21, 24, 25));
      expect(empty.accumulateRightWith(plus)).toEqual(empty);
      expect(make(1).accumulateRightWith(plus)).toEqual(make(1));
      expect(nums.accumulateWith(plus)).toEqual(make(1, 4, 9, 16, 25));
      expect(empty.accumulateWith(plus)).toEqual(empty);
      expect(make(1).accumulateWith(plus)).toEqual(make(1));
      const neNums = neMake(1, 3, 5, 7, 9);
      expect(neNums.accumulate(plus, 0)).toEqual(neMake(0, 1, 4, 9, 16, 25));
      expect(neNums.accumulateRight(plus, 0)).toEqual(
        neMake(0, 9, 16, 21, 24, 25)
      );
      expect(neNums.accumulateRightWith(plus)).toEqual(
        neMake(9, 16, 21, 24, 25)
      );
      expect(neMake(1).accumulateRightWith(plus)).toEqual(neMake(1));
      expect(neNums.accumulateWith(plus)).toEqual(neMake(1, 4, 9, 16, 25));
      expect(neMake(1).accumulateWith(plus)).toEqual(neMake(1));
    });
    it('append|prepend', () => {
      expect(empty.append(1)).toEqual(neMake(1));
      expect(empty.append(1).append(2)).toEqual(neMake(1, 2));
      expect(
        empty
          .append(1)
          .prepend(0)
          .append(2)
      ).toEqual(neMake(0, 1, 2));
    });
    it('delete|insert|replace', () => {
      const fibs = make(1, 1, 2, 3);
      expect(empty.delete(0)).toEqual(empty);
      expect(fibs.delete(2)).toEqual(make(1, 1, 3));
      expect(fibs.delete(-1)).toEqual(fibs);
      expect(fibs.delete(4)).toEqual(fibs);
      expect(empty.insert(0, 0)).toEqual(make(0));
      expect(empty.insert(-1, 0)).toEqual(empty);
      expect(empty.insert(1, 0)).toEqual(empty);
      expect(fibs.insert(1, 0)).toEqual(make(1, 0, 1, 2, 3));
      expect(fibs.insert(0, 0)).toEqual(make(0, 1, 1, 2, 3));
      expect(fibs.insert(4, 0)).toEqual(make(1, 1, 2, 3, 0));
      expect(fibs.insert(-1, 0)).toEqual(fibs);
      expect(fibs.insert(5, 0)).toEqual(fibs);
      expect(empty.replace(0, 0)).toEqual(empty);
      expect(empty.replace(-1, 0)).toEqual(empty);
      expect(fibs.replace(1, 0)).toEqual(make(1, 0, 2, 3));
      expect(fibs.replace(0, 0)).toEqual(make(0, 1, 2, 3));
      expect(fibs.replace(4, 0)).toEqual(fibs);
      expect(fibs.replace(-1, 0)).toEqual(fibs);
      const neFibs = neMake(1, 1, 2, 3);
      expect(neFibs.replace(1, 0)).toEqual(neMake(1, 0, 2, 3));
      expect(neFibs.replace(0, 0)).toEqual(neMake(0, 1, 2, 3));
      expect(neFibs.replace(4, 0)).toEqual(neFibs);
      expect(neFibs.replace(-1, 0)).toEqual(neFibs);
    });
    it('(difference|intersect|union)(By)?', () => {
      const nums1 = make(1, NaN, -0, 0, 2, 3, 1);
      const nums2 = make(0, -0, NaN, 1, 4, 4);
      expect(empty.difference(empty)).toEqual(empty);
      expect(empty.difference(nums2)).toEqual(empty);
      expect(nums1.difference(empty)).toEqual(nums1);
      expect(nums1.difference(nums2)).toEqual(make(2, 3, 1));
      expect(nums1.differenceBy(() => true, nums2)).toEqual(make(1));
      expect(nums1.differenceBy(() => false, nums2)).toEqual(nums1);
      expect(empty.intersect(empty)).toEqual(empty);
      expect(empty.intersect(nums2)).toEqual(empty);
      expect(nums1.intersect(empty)).toEqual(empty);
      expect(nums1.intersect(nums2)).toEqual(make(1, NaN, -0, 0, 1));
      expect(nums1.intersectBy(() => true, nums2)).toEqual(nums1);
      expect(nums1.intersectBy(() => false, nums2)).toEqual(empty);
      expect(empty.union(empty)).toEqual(empty);
      expect(empty.union(nums2)).toEqual(nums2.drop(-1).delete(1));
      expect(nums1.union(empty)).toEqual(nums1);
      expect(nums1.union(nums2)).toEqual(make(1, NaN, -0, 0, 2, 3, 1, 4));
      expect(nums1.unionBy(() => true, nums2)).toEqual(nums1);
      expect(nums1.unionBy(() => false, nums2)).toEqual(
        make(1, NaN, -0, 0, 2, 3, 1, 0, -0, NaN, 1, 4, 4)
      );
      const neNums1 = neMake(1, NaN, -0, 0, 2, 3, 1);
      const neNums2 = neMake(0, -0, NaN, 1, 4, 4);
      expect(neNums1.union(empty)).toEqual(neNums1);
      expect(neNums1.union(neNums2)).toEqual(neMake(1, NaN, -0, 0, 2, 3, 1, 4));
      expect(neNums1.unionBy(() => true, neNums2)).toEqual(neNums1);
      expect(neNums1.unionBy(() => false, neNums2)).toEqual(
        neMake(1, NaN, -0, 0, 2, 3, 1, 0, -0, NaN, 1, 4, 4)
      );
    });
    it('take|drop', () => {
      const xs = make(0, 1, 2, 3, 4, 5);
      expect(xs.take(Math.PI)).toEqual(xs);
      expect(xs.take(-0)).toEqual(empty);
      expect(xs.take(0)).toEqual(empty);
      expect(xs.take(3)).toEqual(make(0, 1, 2));
      expect(xs.take(-3)).toEqual(make(3, 4, 5));
      expect(xs.take(-6)).toEqual(xs);
      expect(xs.take(6)).toEqual(xs);
      expect(xs.drop(Math.PI)).toEqual(xs);
      expect(xs.drop(-0)).toEqual(xs);
      expect(xs.drop(0)).toEqual(xs);
      expect(xs.drop(3)).toEqual(make(3, 4, 5));
      expect(xs.drop(-3)).toEqual(make(0, 1, 2));
      expect(xs.drop(6)).toEqual(empty);
      expect(xs.drop(-6)).toEqual(empty);
    });
    it('(take(drop)?|drop)(Tail)?While', () => {
      const xs = make(1, 2, 4, 8, 16, 32, 64, 32, 16, 8, 4, 2, 1);
      expect(xs.takeWhile(() => false)).toEqual(empty);
      expect(xs.takeWhile(() => true)).toEqual(xs);
      expect(xs.takeWhile((n: number) => n < 10)).toEqual(make(1, 2, 4, 8));
      expect(xs.takeTailWhile(() => false)).toEqual(empty);
      expect(xs.takeTailWhile(() => true)).toEqual(xs);
      expect(xs.takeTailWhile((n: number) => n < 10)).toEqual(make(8, 4, 2, 1));
      expect(xs.dropWhile(() => false)).toEqual(xs);
      expect(xs.dropWhile(() => true)).toEqual(empty);
      expect(xs.dropWhile((n: number) => n < 10)).toEqual(
        make(16, 32, 64, 32, 16, 8, 4, 2, 1)
      );
      expect(xs.dropTailWhile(() => false)).toEqual(xs);
      expect(xs.dropTailWhile(() => true)).toEqual(empty);
      expect(xs.dropTailWhile((n: number) => n < 10)).toEqual(
        make(1, 2, 4, 8, 16, 32, 64, 32, 16)
      );
      expect(xs.takeDropWhile(n => n < 10)).toEqual([
        make(1, 2, 4, 8),
        make(16, 32, 64, 32, 16, 8, 4, 2, 1)
      ]);
      expect(xs.takeDropTailWhile(n => n < 10)).toEqual([
        make(1, 2, 4, 8, 16, 32, 64, 32, 16),
        make(8, 4, 2, 1)
      ]);
    });
    it('filter|partition', () => {
      const xs = make(1, 1, 2, 3, 5, 8, 13, 8, 5, 3, 2, 1, 1, 2, 3, 5);
      expect(empty.filter(() => true)).toEqual(empty);
      expect(xs.filter(() => false)).toEqual(empty);
      expect(xs.filter(() => true)).toEqual(xs);
      expect(xs.filter((x: number) => x < 5)).toEqual(
        make(1, 1, 2, 3, 3, 2, 1, 1, 2, 3)
      );
      expect(empty.partition(() => true)).toEqual([empty, empty]);
      expect(xs.partition(() => false)).toEqual([empty, xs]);
      expect(xs.partition(() => true)).toEqual([xs, empty]);
      expect(xs.partition((x: number) => x < 5)).toEqual([
        make(1, 1, 2, 3, 3, 2, 1, 1, 2, 3),
        make(5, 8, 13, 8, 5, 5)
      ]);
    });
    it('find(Index|Indices)?', () => {
      const xs = make(1, 1, 2, 3, 5, 8, 13, 21, 34);
      expect(xs.find(() => false)).toBeNull();
      expect(xs.find(() => true)).toBe(1);
      expect(xs.find((x: number) => x % 2 === 0)).toBe(2);
      expect(xs.findIndex(() => false)).toBeNull();
      expect(xs.findIndex(() => true)).toBe(0);
      expect(xs.findIndex((x: number) => x % 2 === 0)).toBe(2);
      expect(xs.findIndices(() => false)).toEqual(empty);
      expect(xs.findIndices(() => true)).toEqual(List.range(0, xs.length - 1));
      expect(xs.findIndices((x: number) => x % 2 === 0)).toEqual(make(2, 5, 8));
    });
    it('flatMap', () => {
      const factors = (n: number) =>
        List.range(1, n).filter((d: number) => n % d === 0);
      const xs = make(1, 2, 3, 4, 5);
      expect(xs.flatMap(factors)).toEqual(make(1, 1, 2, 1, 3, 1, 2, 4, 1, 5));
      expect(xs.flatMap(() => empty)).toEqual(empty);
      expect(xs.flatMap((x: number) => make(x))).toEqual(xs);
    });
    it('group(By)?', () => {
      const xs = make(1, 1, 2, 3, 5, 8, 2, 1, 3, 4, 7, 11);
      expect(empty.group()).toEqual(empty);
      expect(xs.group()).toEqual(
        make(
          neMake(1, 1, 1),
          neMake(2, 2),
          neMake(3, 3),
          neMake(5),
          neMake(8),
          neMake(4),
          neMake(7),
          neMake(11)
        )
      );
      expect(xs.groupBy(() => false)).toEqual(xs.map((x: number) => neMake(x)));
      expect(xs.groupBy(() => true)).toEqual(
        make(defaultTo(neMake(-1), xs.toNonEmptyList()))
      );
      const neXs = neMake(1, 1, 2, 3, 5, 8, 2, 1, 3, 4, 7, 11);
      expect(neXs.group()).toEqual(
        neMake(
          neMake(1, 1, 1),
          neMake(2, 2),
          neMake(3, 3),
          neMake(5),
          neMake(8),
          neMake(4),
          neMake(7),
          neMake(11)
        )
      );
      expect(neXs.groupBy(() => false)).toEqual(
        neXs.map((x: number) => neMake(x))
      );
      expect(neXs.groupBy(() => true)).toEqual(neMake(neXs.toNonEmptyList()));
    });
    it('inits|tails', () => {
      const xs = make(1, 2, 3);
      expect(empty.inits()).toEqual(neMake(empty));
      expect(xs.inits()).toEqual(
        neMake(empty, make(1), make(1, 2), make(1, 2, 3))
      );
      expect(empty.tails()).toEqual(neMake(empty));
      expect(xs.tails()).toEqual(
        neMake(make(1, 2, 3), make(2, 3), make(3), empty)
      );
    });
    it('intercalate|intersperse', () => {
      let xs = make(',', ' ');
      expect(xs.intercalate(empty)).toEqual(empty);
      expect(xs.intercalate(make(make('well')))).toEqual(make('well'));
      expect(
        xs.intercalate(make(make('well'), make("you're"), make('a')))
      ).toEqual(make('well', ',', ' ', "you're", ',', ' ', 'a'));
      xs = make('hello', 'polly', 'parrot');
      expect(empty.intersperse(' ')).toEqual(empty);
      expect(xs.take(1).intersperse(' ')).toEqual(xs.take(1));
      expect(xs.intersperse(' ')).toEqual(
        make('hello', ' ', 'polly', ' ', 'parrot')
      );
      xs = neMake('hello', 'polly', 'parrot');
      expect(xs.take(1).intersperse(' ')).toEqual(xs.take(1));
      expect(xs.intersperse(' ')).toEqual(
        neMake('hello', ' ', 'polly', ' ', 'parrot')
      );
    });
    it('is((In|Pre|Suf)fix|Subsequence)Of(By)?', () => {
      const xs = List.range(1, 6);
      expect(empty.isInfixOf(empty)).toBe(true);
      expect(empty.isInfixOf(xs)).toBe(true);
      expect(xs.isInfixOf(empty)).toBe(false);
      expect(make(3, 4).isInfixOf(xs)).toBe(true);
      expect(make(4, 3).isInfixOf(xs)).toBe(false);
      expect(xs.isInfixOf(xs)).toBe(true);
      expect(empty.isPrefixOf(empty)).toBe(true);
      expect(empty.isPrefixOf(xs)).toBe(true);
      expect(xs.isPrefixOf(empty)).toBe(false);
      expect(List.range(1, 3).isPrefixOf(xs)).toBe(true);
      expect(make(1, 2, 4).isPrefixOf(xs)).toBe(false);
      expect(empty.isSuffixOf(empty)).toBe(true);
      expect(empty.isSuffixOf(xs)).toBe(true);
      expect(xs.isSuffixOf(empty)).toBe(false);
      expect(List.range(3, 6).isSuffixOf(xs)).toBe(true);
      expect(make(-5, 5, 6).isSuffixOf(xs)).toBe(false);
      expect(empty.isSubsequenceOf(empty)).toBe(true);
      expect(empty.isSubsequenceOf(xs)).toBe(true);
      expect(xs.isSubsequenceOf(empty)).toBe(false);
      expect(make(1, 3, 5).isSubsequenceOf(xs)).toBe(true);
      expect(make(1, 3, 9).isSubsequenceOf(xs)).toBe(false);
    });
    it('map', () => {
      expect(empty.map(() => true)).toEqual(empty);
      expect(make(1, 2, 3).map(String)).toEqual(make('1', '2', '3'));
      expect(neMake(1, 2, 3).map(String)).toEqual(neMake('1', '2', '3'));
    });
    it('mapAccum(Right)?', () => {
      const xs = List.range(1, 5);
      expect(empty.mapAccum(() => [1, 1], 0)).toEqual([0, empty]);
      expect(
        xs.mapAccum((accum: number, val) => [accum + 1, String(val)], 0)
      ).toEqual([5, make('1', '2', '3', '4', '5')]);
      expect(empty.mapAccumRight(() => [1, 1], 0)).toEqual([0, empty]);
      expect(
        xs.mapAccumRight((accum: number, val) => [accum + 1, String(val)], 0)
      ).toEqual([5, make('5', '4', '3', '2', '1')]);
      const neXs = neMake(1, 2, 3, 4, 5);
      expect(
        neXs.mapAccum(
          (accum: number, val: number) => [2 * accum, accum + val],
          1
        )
      ).toEqual([32, neMake(2, 4, 7, 12, 21)]);
      expect(
        neXs.mapAccumRight(
          (accum: number, val: number) => [2 * accum, accum + val],
          1
        )
      ).toEqual([32, neMake(6, 6, 7, 10, 17)]);
    });
    it('permutations|sub(sequences|strings)', () => {
      // List and NonEmptyList for all
      const xs = make(1, 2, 3, 4);
      const perms = [
        [1, 2, 3, 4],
        [1, 2, 4, 3],
        [1, 3, 2, 4],
        [1, 3, 4, 2],
        [1, 4, 2, 3],
        [1, 4, 3, 2],
        [2, 1, 3, 4],
        [2, 1, 4, 3],
        [2, 3, 1, 4],
        [2, 3, 4, 1],
        [2, 4, 1, 3],
        [2, 4, 3, 1],
        [3, 1, 2, 4],
        [3, 1, 4, 2],
        [3, 2, 1, 4],
        [3, 2, 4, 1],
        [3, 4, 1, 2],
        [3, 4, 2, 1],
        [4, 1, 2, 3],
        [4, 1, 3, 2],
        [4, 2, 1, 3],
        [4, 2, 3, 1],
        [4, 3, 1, 2],
        [4, 3, 2, 1]
      ];
      expect(empty.permutations()).toEqual(neMake(empty));
      expect(xs.permutations()).toEqual(
        neMake(make(...perms[0]), ...perms.slice(1).map(perm => make(...perm)))
      );
      expect(() => List.range(0, 12).permutations()).toThrowError();
      expect(neMake(1, 2, 3, 4).permutations()).toEqual(
        neMake(
          neMake(perms[0][0], ...perms[0].slice(1)),
          ...perms.slice(1).map(perm => neMake(perm[0], ...perm.slice(1)))
        )
      );
      expect(empty.subsequences()).toEqual(neMake(empty));
      expect(xs.subsequences()).toEqual(
        neMake(
          empty,
          make(1),
          make(2),
          make(3),
          make(4),
          make(1, 2),
          make(1, 3),
          make(1, 4),
          make(2, 3),
          make(2, 4),
          make(3, 4),
          make(1, 2, 3),
          make(1, 2, 4),
          make(1, 3, 4),
          make(2, 3, 4),
          make(1, 2, 3, 4)
        )
      );
      expect(() => List.range(0, 31).subsequences()).toThrowError();
      expect(empty.substrings()).toEqual(neMake(empty));
      expect(xs.substrings()).toEqual(
        neMake(
          empty,
          make(1),
          make(2),
          make(3),
          make(4),
          make(1, 2),
          make(2, 3),
          make(3, 4),
          make(1, 2, 3),
          make(2, 3, 4),
          make(1, 2, 3, 4)
        )
      );
      expect(() => List.range(1, 92682).substrings()).toThrowError();
    });
    it('remove(By)?', () => {
      const xs = make(1, 2, 3, 5, 8, 5, 3, 2, 1);
      expect(empty.remove(0)).toEqual(empty);
      expect(xs.remove(1)).toEqual(xs.drop(1));
      expect(xs.remove(5)).toEqual(xs.delete(3));
      expect(xs.removeBy(() => false, 11)).toEqual(xs);
      expect(xs.removeBy(() => true, 11)).toEqual(xs.drop(1));
      expect(xs.removeBy((x, y) => x % 4 === y % 4, 8)).toEqual(xs.delete(4));
    });
    it('reverse', () => {
      expect(empty.reverse()).toEqual(empty);
      expect(make(1).reverse()).toEqual(make(1));
      expect(make(1, 2, 3).reverse()).toEqual(make(3, 2, 1));
      expect(neMake(1).reverse()).toEqual(neMake(1));
      expect(neMake(1, 2, 3).reverse()).toEqual(neMake(3, 2, 1));
    });
    it('sortOn|uniques(By)?', () => {
      const xs = make(-5, 4, -3, 2, -1, 1, -2, 3, -4, 5);
      const numOrd = (x: number, y: number) =>
        x < y ? 'LT' : x > y ? 'GT' : 'EQ';
      const cmp1 = (x: number, y: number) => numOrd(x * x, y * y);
      const cmp2 = (x: number, y: number) => cmp1(y, x);
      expect(empty.sortOn(() => 'EQ')).toEqual(empty);
      expect(xs.sortOn(numOrd)).toEqual(List.range(-5, 5).remove(0));
      expect(xs.sortOn(cmp1)).toEqual(make(-1, 1, 2, -2, -3, 3, 4, -4, -5, 5));
      expect(xs.sortOn(cmp2)).toEqual(make(-5, 5, 4, -4, -3, 3, 2, -2, -1, 1));
      expect(empty.uniques()).toEqual(empty);
      expect(xs.uniques()).toEqual(xs);
      expect(make(1, 1, 1, 2, 2, 1, 3, 1).uniques()).toEqual(make(1, 2, 3));
      expect(empty.uniquesBy(() => true)).toEqual(empty);
      expect(xs.uniquesBy((x, y) => cmp1(x, y) === 'EQ')).toEqual(
        make(-5, 4, -3, 2, -1)
      );
      expect(xs.uniquesBy(() => false)).toEqual(xs);
      expect(xs.uniquesBy(() => true)).toEqual(make(-5));
      const neXs = neMake(-5, 4, -3, 2, -1, 1, -2, 3, -4, 5);
      expect(neXs.sortOn(numOrd)).toEqual(
        neMake(-5, -4, -3, -2, -1, 1, 2, 3, 4, 5)
      );
      expect(neXs.sortOn(cmp1)).toEqual(
        neMake(-1, 1, 2, -2, -3, 3, 4, -4, -5, 5)
      );
      expect(neXs.sortOn(cmp2)).toEqual(
        neMake(-5, 5, 4, -4, -3, 3, 2, -2, -1, 1)
      );
      expect(neXs.uniques()).toEqual(neXs);
      expect(neMake(1, 1, 1, 2, 2, 1, 3, 1).uniques()).toEqual(neMake(1, 2, 3));
      expect(neXs.uniquesBy((x, y) => cmp1(x, y) === 'EQ')).toEqual(
        neMake(-5, 4, -3, 2, -1)
      );
      expect(neXs.uniquesBy(() => false)).toEqual(neXs);
      expect(neXs.uniquesBy(() => true)).toEqual(neMake(-5));
    });
    it('splitAt', () => {
      const xs = make(1, 2, 3, 4, 5);
      expect(empty.splitAt(2)).toEqual([empty, empty]);
      expect(xs.splitAt(0)).toEqual([empty, xs]);
      expect(xs.splitAt(2)).toEqual([xs.take(2), xs.drop(2)]);
      expect(xs.splitAt(5)).toEqual([xs, empty]);
      expect(xs.splitAt(-1)).toEqual([xs, empty]);
      expect(xs.splitAt(10)).toEqual([xs, empty]);
    });
    it('to(Array|List)', () => {
      const xs = [1, 2, 3];
      expect(empty.toArray()).toEqual([]);
      expect(empty.toList()).toEqual(empty);
      expect(make(...xs).toArray()).toEqual(xs);
      expect(make(...xs).toList()).toEqual(make(...xs));
      expect(neMake(xs[0], ...xs.slice(1)).toList()).toEqual(make(...xs));
    });
    it('zipWith', () => {
      const nums1 = make(1, 1, 2, 3, 5, 8, 13, 21, 34, 55);
      const nums2 = make(2, 1, 3, 4, 7, 11, 18, 29, 47, 76);
      expect(nums1.take(5).zipWith((x, y) => y - x, nums2)).toEqual(
        make(1, 0, 1, 1, 2)
      );
      expect(nums1.zipWith((x, y) => y - x, nums2.take(6))).toEqual(
        make(1, 0, 1, 1, 2, 3)
      );
    });
  });
  it('list', () => {
    // inductive rule
    expect(list<number, number>(0, (accum, val) => accum + val)(empty)).toBe(0);
    expect(
      list<number, number>(0, (accum, val) => accum + val)(make(1, 2, 3, 4, 5))
    ).toBe(15);
    const len = list(0, accum => accum + 1);
    expect(len(empty)).toBe(0);
    expect(len(make(1, 2, 3))).toBe(3);
    const evens = list<number, number[]>(
      [],
      (accum, value) => (value % 2 === 0 ? accum.concat(value) : accum)
    );
    const xs = make(1, 2, 3, 4, 5, 6);
    expect(evens(empty)).toEqual([]);
    expect(evens(xs)).toEqual([2, 4, 6]);
  });
  describe('AbstractList methods', () => {
    it('allTruthy|some(Truthy)?|every', () => {
      const xs = make(1, -1, 2, -2, 3, -3);
      expect(empty.allTruthy()).toBe(true);
      expect(empty.every(() => false)).toBe(true);
      expect(empty.someTruthy()).toBe(false);
      expect(empty.some(() => true)).toBe(false);
      expect(xs.every(x => x >= 0)).toBe(false);
      expect(xs.every(x => Math.abs(x) <= 3)).toBe(true);
      expect(xs.some(x => x >= 0)).toBe(true);
      expect(xs.some(x => Math.abs(x) > 3)).toBe(false);
    });
    it('(has|includes)(By)?', () => {
      const xs = make(1, 2, 3, 4, 5);
      expect(empty.has(0)).toBe(false);
      expect(empty.hasBy(() => true, 11)).toBe(false);
      expect(empty.includes(0)).toBe(false);
      expect(empty.includesBy(() => true, 11)).toBe(false);
      expect(xs.has(5)).toBe(true);
      expect(xs.has(0)).toBe(false);
      expect(xs.hasBy(() => false, 11)).toBe(false);
      expect(xs.hasBy(() => true, 11)).toBe(true);
      expect(xs.includes(5)).toBe(true);
      expect(xs.includes(0)).toBe(false);
      expect(xs.includesBy(() => false, 11)).toBe(false);
      expect(xs.includesBy(() => true, 11)).toBe(true);
    });
    it('max|min', () => {
      // List and NonEmptyList
      const xs = make(1, -1, 5, -5, 2, -2, 4, -4, 3, -3);
      const neXs = neMake(1, -1, 5, -5, 2, -2, 4, -4, 3, -3);
      const numOrd = (x: number, y: number) =>
        x < y ? 'LT' : x > y ? 'GT' : 'EQ';
      expect(empty.max(numOrd)).toBeNull();
      expect(empty.min(numOrd)).toBeNull();
      expect(xs.max(numOrd)).toBe(5);
      expect(xs.min(numOrd)).toBe(-5);
      expect(neXs.max((x, y) => numOrd(1 / x, 1 / y))).toBe(1);
      expect(neXs.min((x, y) => numOrd(1 / x, 1 / y))).toBe(-1);
    });
    it('reduce(Right)?(With)?', () => {
      // List and NonEmptyList
      const xs = make(1, 2, 3, 4, 5);
      const neXs = neMake(1, 2, 3, 4, 5);
      expect(empty.reduce((accum, val) => 7, 0)).toBe(0);
      expect(empty.reduceRight((accum, val) => 7, 0)).toBe(0);
      expect(empty.reduceRightWith((accum, val) => 7)).toBeNull();
      expect(empty.reduceWith((accum, val) => 7)).toBeNull();
      expect(xs.reduce((accum, val) => 2 * accum + val, 0)).toBe(57);
      expect(xs.reduceRight((accum, val) => 2 * accum + val, 0)).toBe(129);
      expect(xs.reduceRightWith((accum, val) => 2 * accum + val)).toBe(129);
      expect(xs.reduceWith((accum, val) => 2 * accum + val)).toBe(57);
      expect(neXs.reduce((accum, val) => 2 * accum + val, 0)).toBe(57);
      expect(neXs.reduceRight((accum, val) => 2 * accum + val, 0)).toBe(129);
      expect(neXs.reduceRightWith((accum, val) => 2 * accum + val)).toBe(129);
      expect(neXs.reduceWith((accum, val) => 2 * accum + val)).toBe(57);
    });
    it('toNonEmptyList', () => {
      const xs = [1, 2, 3];
      expect(empty.toNonEmptyList()).toBeNull();
      expect(make(...xs).toNonEmptyList()).toEqual(
        neMake(xs[0], ...xs.slice(1))
      );
      expect(neMake(xs[0], ...xs.slice(1)).toNonEmptyList()).toEqual(
        neMake(xs[0], ...xs.slice(1))
      );
    });
  });
});
