const fibonacci: (n: number) => number = (() => {
  const fibs: number[] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
  return (n: number) => {
    if (n < 0) {
      return 1;
    }
    let k = fibs.length;
    while (k <= n) {
      k = fibs.push(fibs[k - 1] + fibs[k - 2]);
    }
    return fibs[n];
  };
})();

const ackermann: (m: number, n: number) => number = (() => {
  const acks: Map<number, Map<number, number>> = new Map([
    [0, new Map([[0, 1]])]
  ]);
  return (m: number, n: number, ackLimit = 1000) => {
    if (m < 0 || n < 0) {
      return -1;
    }
    const inputs: Array<[number, number]> = [[m, n]];
    let iterCount = 0;
    while (inputs.length > 0 && iterCount++ < ackLimit) {
      let j: number, k: number;
      [j, k] = inputs[inputs.length - 1];
      if (inputs.pop()) {
        console.log(
          `1: Popped [${j}, ${k}] from the stack ${JSON.stringify(
            inputs
          )} on the ${iterCount} iteration.`
        );
        let ackJ = acks.get(j);
        if (ackJ) {
          if (j === 0) {
            console.log(`2: Storing the result A(0, ${k}) = ${k + 1}`);
            ackJ.set(k, k + 1);
          }
          const result = ackJ.get(k);
          if (result) {
            //walk back the stack
            if (inputs.length === 0) {
              console.log('returning');
              return result; // done computing w/ result saved.
            }
            let lastJ = j;
            [j, k] = inputs[inputs.length - 1];
            while (inputs.length > 0 && lastJ + 1 === j) {
              console.log(`3: Storing the result A(${j}, ${k}) = ${result}`);
              ackJ = acks.get(j);
              if (ackJ) {
                ackJ.set(k, result);
              } else {
                acks.set(j, new Map([[k, result]]));
              }
              lastJ = j;
              inputs.pop();
              if (inputs.length > 0) {
                [j, k] = inputs[inputs.length - 1];
              }
            }
            if (lastJ === j && inputs.length > 0) {
              // in this case lastJ = j and lastK + 1 = k
              console.log(`4: Pushing [${j - 1}, ${result}] onto the stack`);
              inputs.push([j - 1, result]);
              continue;
            }
            if (inputs.length === 0) {
              const ackJ = acks.get(j);
              if (ackJ) {
                ackJ.set(k, result);
              } else {
                acks.set(j, new Map([[k, result]]));
              }
              return result;
            }
          }
          if (k === 0) {
            console.log(`5: Pushing [${j}, 0] [${j - 1}, 1] onto the stack`);
            inputs.push([j, 0], [j - 1, 1]);
            continue;
          }
          console.log(
            `6: Pushing [${j}, ${k}] [${j}, ${k - 1}] onto the stack`
          );
          inputs.push([j, k], [j, k - 1]);
          continue;
        }
        if (j === 0) {
          console.assert(
            false,
            "Again, we've defined A(0, *) but now it's gone."
          );
          return -1;
        }
        if (k === 0) {
          console.log(`7: Pushing [${j}, 0] [${j - 1}, 1] onto the stack`);
          inputs.push([j, 0], [j - 1, 1]);
        } else {
          console.log(
            `8: Pushing [${j}, ${k}] [${j}, ${k - 1}] onto the stack`
          );
          inputs.push([j, k], [j, k - 1]);
        }
      }
    }
    console.assert(false, 'Fell through the loop without rreturning a value.');
    return -1;
  };
})();

console.log(`A(1, 1) = ${ackermann(1, 1)}`);
console.log(`A(2, 2) = ${ackermann(2, 2)}`);

/* A(0)(n) = n + 1, A(1)(n) = n + 2, A(2)(n) = 2 n + 3, A(3)(n) = 2^(n+3)-3
 * [4,4] [4,3] [4,2] [4,1] [4,0]=[3,1]=[2, 5]=[1, 11]=[0, 12]=13
 * [4,4] [4,3] [4,2] [4,1]=[3,13]=[2,32765]=[1,65531]=[0,65532]=65533
 * [4,4] [4,3] [4,2]=[3,65533]=[2,unbounded]
 * 
 * [5,0]=[4,1]=65533
 * [5,1]=[4,65533] fucking done
 */
function iterate<T>(f: (x: T) => T, init: T): (n: number) => (x: T) => T {
  return (n: number) => {
    if (!Number.isInteger(n) || n < 0) {
      return (x: T) => x;
    }
    if (n === 0) {
      return (x: T) => f(init);
    }
    const fn = iterate(f, init)(n - 1);
    return (x: T) => f(fn(x));
  };
}
/* Iter(f, x0)(0) = x => f(x0)
 * Iter(f, x0)(n + 1) = x => f(Iter(f, x0)(n))
 *
 * Ack(0)(n) = S(n) = n + 1
 * Ack(m + 1) = Iter(Ack(m), 1)
 * 
 * Ack(1)(0) = Iter(Ack(0), 1)(0) = Ack(0)(1) = 2
 * Ack(1)(1) = Ack(0)(Iter(Ack(0), 1)(0)) = S(Ack(0)(1)) = S(S(1)) = 3
 * Ack(1)(2) = Ack(0)(Iter(Ack(0), 1)(1)) = S(Ack(0)(Iter(Ack(0), 1)(0))) = S(S(Ack(0)(1))) = S(Ack(1)(1)) = 4
 * IH: Ack(1)(0) = 2, Ack(1)(n + 1) = S(Ack(1)(n))
 * Ack(1)(n + 2) = Ack(0)(Iter(Ack(0),1)(n+1)) = S(Ack(0)(Iter(Ack(0),1)(n))) = S()
 */
