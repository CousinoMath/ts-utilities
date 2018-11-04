function fibonacciNaive(n: number): number {
  if (n < 0) {
    return -1;
  }
  if (n <= 1) {
    return 1;
  }
  return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

function fibonacciRec(n: number): number {
  function fibHelper(n: number, a: number, b: number): number {
    if (n === 0) {
      return a;
    }
    return fibHelper(n - 1, a + b, a);
  }
  if (n < 0) {
    return -1;
  }
  return fibHelper(n, 1, 0);
}

const fibonacci: (n: number) => number = (function() {
  /* Largest Fibonacci number representable as ES number is 1475 
   * which is approximately 1.30699 x 10^308
   */
  const fibs: number[] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
  const fibLimit = 5000;
  return (n: number) => {
    if (n < 0) {
      return -1;
    }
    const inputs: number[] = [n];
    let inLen = 1;
    let fibsLen = fibs.length;
    let result: number = -1;
    let iterCount = 0;
    while (inLen > 0 && iterCount++ < fibLimit) {
      const input = inputs[--inLen];
      inputs.pop();
      if (input > fibsLen) {
        inLen = inputs.push(input, input - 1, input - 2);
        continue;
      }
      // input <= fibsLen
      if (input === fibsLen) {
        result = fibs[input - 1] + fibs[input - 2];
        fibsLen = fibs.push(result);
        continue;
      }
      // input < fibsLen
      result = fibs[input];
    }
    if (n < fibsLen) {
      console.log(
        `${n}th Fibonacci number is ${fibs[n]}. (Found in ${iterCount})`
      );
      return fibs[n];
    } else {
      console.log(
        `Reached iteration limit, largest Fibonacci number found is the ${fibsLen -
          1}th which is ${fibs[fibsLen - 1]}`
      );
      return fibs[fibsLen - 1];
    }
  };
})();

function ackermannNaive(m: number, n: number): number {
  if (m === 0) {
    return n + 1;
  }
  if (n === 0) {
    return ackermannNaive(m - 1, 1);
  }
  return ackermannNaive(m - 1, ackermannNaive(m, n - 1));
}

const ackermann0: (m: number, n: number) => number = (function() {
  let acks: Map<number, Map<number, number>> = new Map();
  return (m: number, n: number) => {
    if (acks.has(m)) {
      const ackM = acks.get(m);
      if (typeof ackM === 'undefined') {
        return -1;
      }
      if (ackM.has(n)) {
        const result = ackM.get(n);
        if (typeof result === 'undefined') {
          return -1;
        }
        return result;
      }
    }
    if (m === 0) {
      acks = _store(0, n, n + 1, acks);
      return n + 1;
    }
    if (n === 0) {
      const result = ackermann0(m - 1, 1);
      acks = _store(m, 0, result, acks);
    }
    const ackMNm1 = ackermann0(m, n - 1);
    const result = ackermann0(m - 1, ackMNm1);
    acks = _store(m, n, result, acks);
    return result;
  };
})();

function _store(
  m: number,
  n: number,
  y: number,
  acks: Map<number, Map<number, number>>
): Map<number, Map<number, number>> {
  const ackM = acks.get(m);
  if (typeof ackM === 'undefined') {
    acks.set(m, new Map([[n, y]]));
  } else {
    ackM.set(n, y);
    acks.set(m, ackM);
  }
  return acks;
}

const ackermann: (m: number, n: number) => number = (function() {
  // const ackFns: Array<(n: number) => number> = [n => n + 1];
  // const numAckFns = ackFns.length;
  const acks: Map<number, Map<number, number>> = new Map();
  const ackLimit = 5000;

  function nextInputsMTooLarge(m: number, n: number): Array<[number, number]> {
    // PRE: m >= acks.size, and so we cannot have computed A(m, n) yet
    // POST: return a stack of inputs that must be computed in order to compute
    //   a value for A(m, n). Top of the outputed stack will be [acks.size-1, 1]
    const acksSize = acks.size;
    const results: Array<[number, number]> = [];
    if (n > 0) {
      // A(m, n) = A(m - 1, A(m, n - 1))
      for (let j = n - 1; j >= 0; j--) {
        results.push([m, j]);
      } // resulting stack will have top of [m, 0] [m, 1] ... [m, n] ...
    }
    // We can now assume that n = 0 as that's what will be on top of the
    // resulting stack.
    // A(m, 0) = A(m - 1, 1) = A(m - 2, A(m - 1, 0)) = A(m - 2, A(m - 2, 1))
    for (let i = m - 1; i >= acksSize; i--) {
      results.push([i, 1], [i, 0]);
    } // resulting stack will now have a top of [size,0] [size,1] [size+1,0] [size+1,1] ... [m,0]
    results.push([acksSize - 1, 1]);
    return results;
  }

  function nextInputsNTooLarge(m: number, n: number): Array<[number, number]> {
    // PRE: 0 <= m < acks.size && n > acks.get(m).size (A(m, n) still suspended)
    // POST: returns a stack of inputs that must be computed in order to compute
    //   a value for A(m, n). Top of the outputed stack will be
    //   [m - 1, A(m, acks.get(m).size-1)]
    const result: Array<[number, number]> = [];
    const ackM = acks.get(m);
    if (typeof ackM === 'undefined') {
      console.log(
        `Ran into an undefined map for A(${m}, *) in 'nextInputsNTooLarge': ${JSON.stringify(
          acks
        )}`
      );
      return [];
    }

    const ackMSize = ackM.size; // assuming this is > 0
    if (n > ackMSize) {
      for (let j = n - 1; j >= ackMSize; j--) {
        result.push([m, j]);
      }
    } // stack will now have on top [m,ackMSize] [m,ackMSize+1] ... [m,n-1] [m,n]
    // A(m, ackMSize) = A(m - 1, A(m, ackMSize - 1))
    const ackMLast = ackM.get(ackMSize - 1); // = A(m, ackMSize - 1)
    if (typeof ackMLast === 'undefined') {
      console.log(
        `Ran into an undefined value for A(${m}, ${ackMSize -
          1}) in 'nextInputsNTooLarge': ${JSON.stringify(acks)}`
      );
      return [];
    }
    result.push([m - 1, ackMLast]);
    return result;
  }

  return (m: number, n: number) => {
    if (m < 0 || n < 0) {
      // throw out invalid inputs
      return -1;
    }
    const inputs: Array<[number, number]> = [[m, n]];
    let inLen = 1;
    let iterCount = 0;
    while (inLen > 0 && iterCount++ < ackLimit) {
      /* Invariants:
       *   + inLen = inputs.length
       *   + inputs, as a stack, is lexically sorted in ascending order
       *   + if the top of inputs [j, k] is trivial to compute,
       *       then there is a next element on the stack and it is non-trivial.
       *   + every element [j, k] on the stack is either the bottom or has a
       *       subsequent element [j', k'] with either k = k' + 1 or j = j' + 1
       *   + if acks(j) is defined, then all acks(numAckFns...j) are too and
       *       acks(j).size > 0 and all the acks(j)(0...size - 1) are all
       *       defined.
       */
      let [j, k] = inputs[inLen - 1];
      const acksSize = acks.size;
      if (j >= acksSize) {
        inLen = inputs.push(...nextInputsMTooLarge(m, n));
        // Resest (j, k) to reflect new top of inputs
        [j, k] = [acksSize - 1, 1];
      } // j is now minimal in that we only need to recurse over k to find a new value
      if (acks.has(j)) {
        let ackJ = acks.get(j);
        if (typeof ackJ === 'undefined') {
          console.log(`Was told A(${j}, *) exists but it doesn't`);
          return -1;
        }
        const ackJSize = ackJ.size;
        if (k >= ackJSize) {
          inLen = inputs.push(...nextInputsNTooLarge(j, k));
          const ackJLast = ackJ.get(ackJSize - 1);
          if (typeof ackJLast === 'undefined') {
            console.log(
              `Assumed A(${j}, ${ackJSize - 1}) existed but it doesn't`
            );
            return -1;
          }
          continue; // [j - 1, A(j, ackJSize - 1)] is now on top and may be nontrivial
        } // A(j, k) is already computed.
        const ackResult = ackJ.get(k);
        if (typeof ackResult === 'undefined') {
          console.log(
            `Tried to memoize values from A(${j}, ${k}) but it was undefined`
          );
          return -1;
        }
        if (inLen === 1) {
          // We're at the end.
          return ackResult;
        } // We need to memoize some computations & inLen > 1
        let lastJ = j;
        inputs.pop();
        [j, k] = inputs[--inLen - 1];
        while (lastJ + 1 === j && inLen > 0) {
          if (acks.has(j)) {
            ackJ = acks.get(j);
            if (typeof ackJ === 'undefined') {
              console.log(`A(${j}, *) should have been defined.`);
              return -1;
            }
            ackJ.set(k, ackResult);
            acks.set(j, ackJ);
          } else {
            console.assert(
              k === 0,
              `Creating a new A(${j}, *) with A(${j}, ${k})`
            );
            acks.set(j, new Map([[k, ackResult]]));
          }
          if (inLen === 1) {
            // We're at the end.
            return ackResult;
          } // inLen > 1
          lastJ = j;
          inputs.pop();
          [j, k] = inputs[--inLen - 1];
        }
      }
    }
    if (iterCount >= ackLimit) {
      const maxM = acks.size - 1;
      const maxN = acks.get(maxM).size - 1;
      console.log(
        `Reached iteration limit, largest value computed is A(${maxM}, ${maxN})=${acks
          .get(maxM)
          .get(maxN)}`
      );
      return -1;
    } else {
      console.log(`Found A(${m}, ${n})=${acks.get(m).get(n)}`);
      return acks.get(m).get(n);
    }
  };
})();

function hyper(n: number, a: number, b: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(a) || !Number.isInteger(b) || n < 0 || a < 0 || b < 0) {
    return -1;
  }
  switch (n) {
    case 0:
      return b + 1;
    case 1:
      return a + b;
    case 2:
      return a * b;
    case 3:
      return Math.pow(a, b);
  }
  return 0;
}
