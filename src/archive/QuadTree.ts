/* TODO:
 *    + insert(All)
 *    + remove(All)
 *    + update(All)
 *    + bfsVisit<S,R>(mapper: (qt: QuadTree<T>) => S, dflt: S, coaleser: (s1: S, s2: S, s3: S, s4: S) => R): R
 *    + const Enum Quadrant { NE, NW, SW, SE };
 *    + switchOnQuads(Quadrant, (qt: QuadTree<T>) => S) : S
 *    + applyToQuads((qt: QuadTree<T>) => vaid): void
 */

interface IPoint2D {
  x: number;
  y: number;
}

function equalPoint2D(p1: IPoint2D, p2: IPoint2D): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

interface IBorelBox {
  topRight: IPoint2D;
  bottomLeft: IPoint2D;
}

class QuadTree<T> {
  public static readonly MIN_DIST = Number.EPSILON;

  protected upperRight: IPoint2D;
  protected lowerLeft: IPoint2D;
  protected includeLeft: boolean;
  protected includeBottom: boolean;
  protected northEast: QuadTree<T> | null;
  protected northWest: QuadTree<T> | null;
  protected southEast: QuadTree<T> | null;
  protected southWest: QuadTree<T> | null;
  protected points: Array<[IPoint2D, T]>;
  protected depth: number;
  protected size: number;
  protected parent: QuadTree<T> | null;

  constructor(ur: IPoint2D, ll: IPoint2D) {
    this.upperRight = ur;
    this.lowerLeft = ll;
    this.includeLeft = true;
    this.includeBottom = true;
    this.northEast = this.northWest = this.southEast = this.southWest = null;
    this.points = new Array<[IPoint2D, T]>(0);
    this.depth = 1;
    this.size = 0;
    this.parent = null;
  }

  public inBoundary(p: IPoint2D): boolean {
    let bool = p.x <= this.upperRight.x && p.y <= this.upperRight.y;
    bool =
      bool &&
      (this.lowerLeft.x < p.x ||
        (this.includeLeft && this.lowerLeft.x === p.x));
    bool =
      bool &&
      (this.lowerLeft.y < p.y ||
        (this.includeBottom && this.lowerLeft.y === p.y));
    return bool;
  }

  public search(p: IPoint2D): T | null {
    if (!this.inBoundary(p)) {
      return null;
    }
    for (const data of this.points) {
      if (equalPoint2D(p, data[0])) {
        return data[1];
      }
    }
    const center = {
      x: (this.upperRight.x + this.lowerLeft.x) / 2,
      y: (this.upperRight.y + this.lowerLeft.y) / 2
    };
    if (p.x <= center.x) {
      if (p.y <= center.y) {
        // South West
        return this.southWest == null ? null : this.southWest.search(p);
      } else {
        // North West
        return this.northWest == null ? null : this.northWest.search(p);
      }
    } else {
      if (p.y <= center.y) {
        // South East
        return this.southEast == null ? null : this.southEast.search(p);
      } else {
        // North East
        return this.northEast == null ? null : this.northEast.search(p);
      }
    }
  }

  public insertAll(pds: Array<[IPoint2D, T]>): boolean {
    // TODO
    return false;
  }

  protected removePoints(ps: Array<[IPoint2D, T]>): void {
    this.points.filter(pd1 => !ps.some(pd2 => equalPoint2D(pd1[0], pd2[0])));
  }

  protected containsPoint(p: IPoint2D): boolean {
    return this.points.some(pd1 => equalPoint2D(p, pd1[0]));
  }

  protected updatePoint(p: IPoint2D, d: T): void {
    this.points.filter(pd1 => !equalPoint2D(p, pd1[0]));
    this.points.push([p, d]);
  }

  protected mapReduceQuads<R, S>(
    map: (q: QuadTree<T> | null) => R,
    reduce: (r1: R, r2: R, r3: R, r4: R) => S
  ): S {
    const ne = map(this.northEast);
    const nw = map(this.northWest);
    const sw = map(this.southWest);
    const se = map(this.southEast);
    return reduce(ne, nw, sw, se);
  }

  protected defaultMapReduceQuads<R, S>(
    dflt: R,
    map: (q: QuadTree<T>) => R,
    reduce: (r1: R, r2: R, r3: R, r4: R) => S
  ): S {
    return this.mapReduceQuads(q => (q == null ? dflt : map(q)), reduce);
  }

  protected getNodeSize(): number {
    return (
      this.points.length +
      this.defaultMapReduceQuads(
        0,
        q => 1,
        (r1, r2, r3, r4) => r1 + r2 + r3 + r4
      )
    );
  }

  protected getCenter(): IPoint2D {
    return {
      x: (this.upperRight.x + this.lowerLeft.x) / 2,
      y: (this.upperRight.y + this.lowerLeft.y) / 2
    };
  }

  protected notifyDepthChange(propogate: boolean): void {
    const oldDepth = this.depth;
    this.depth = 1 + this.defaultMapReduceQuads(0, q => q.depth, Math.max);
    if (propogate && oldDepth !== this.depth && this.parent != null) {
      this.parent.notifyDepthChange(true);
    }
  }

  protected createNE(): void {
    const ur = {
      x: this.upperRight.x,
      y: this.upperRight.y
    };
    const ll = this.getCenter();
    this.northEast = new QuadTree<T>(ur, ll);
    this.northEast.includeLeft = false;
    this.northEast.includeBottom = false;
    this.northEast.parent = this;
    this.notifyDepthChange(true);
  }

  protected createNW(): void {
    const ur = {
      x: (this.upperRight.x + this.lowerLeft.x) / 2,
      y: this.upperRight.y
    };
    const ll = {
      x: this.lowerLeft.x,
      y: (this.upperRight.y + this.lowerLeft.y) / 2
    };
    this.northWest = new QuadTree<T>(ur, ll);
    this.northWest.includeLeft = this.includeLeft;
    this.northWest.includeBottom = false;
    this.northWest.parent = this;
    this.notifyDepthChange(true);
  }

  protected createSW(): void {
    const ur = this.getCenter();
    const ll = {
      x: this.lowerLeft.x,
      y: this.lowerLeft.y
    };
    this.southWest = new QuadTree<T>(ur, ll);
    this.southWest.includeLeft = this.includeLeft;
    this.southWest.includeBottom = this.includeBottom;
    this.southWest.parent = this;
    this.notifyDepthChange(true);
  }

  protected createSE(): void {
    const ur = {
      x: this.upperRight.x,
      y: (this.upperRight.y + this.lowerLeft.y) / 2
    };
    const ll = {
      x: (this.upperRight.x + this.lowerLeft.x) / 2,
      y: this.lowerLeft.y
    };
    this.southEast = new QuadTree<T>(ur, ll);
    this.southEast.includeLeft = false;
    this.southEast.includeBottom = this.includeBottom;
    this.southEast.parent = this;
    this.notifyDepthChange(true);
  }

  protected subdivide(): void {
    /* PRE:
    *     + Node is unbalanced, size > 4
    */
    // Partition the list of new points into the quadrants
    let [ne, nw, sw, se] = [
      new Array<[IPoint2D, T]>(),
      new Array<[IPoint2D, T]>(),
      new Array<[IPoint2D, T]>(),
      new Array<[IPoint2D, T]>()
    ];
    const center = this.getCenter();
    for (const pd of this.points) {
      const p = pd[0];
      if (p.x <= center.x) {
        if (p.y <= center.y) {
          // South West
          sw.push(pd);
        } else {
          // North West
          nw.push(pd);
        }
      } else {
        if (p.y <= center.y) {
          // South East
          se.push(pd);
        } else {
          ne.push(pd);
        }
      }
    }

    // If the class methods behave, point leaves should only occur in null
    // quadrants.
    console.assert(
      this.northEast == null || ne.length === 0,
      "in QuadTree.subdivide: North east quadrant is non-null " +
        "yet failed to accept points.",
      this.northEast,
      ne
    );
    console.assert(
      this.northWest == null || nw.length === 0,
      "in QuadTree.subdivide: North west quadrant is non-null " +
        "yet failed to accept points.",
      this.northWest,
      nw
    );
    console.assert(
      this.southWest == null || sw.length === 0,
      "in QuadTree.subdivide: South west quadrant is non-null " +
        "yet failed to accept points.",
      this.southWest,
      sw
    );
    console.assert(
      this.southEast == null || se.length === 0,
      "in QuadTree.subdivide: South east quadrant is non-null " +
        "yet failed to accept points.",
      this.southEast,
      se
    );

    // loop through (at most 4 times) creating one quadrant which
    // absorbs the most points.
    let escape = 0;
    while (this.getNodeSize() > 4 && escape++ < 4) {
      const neLen = ne.length;
      const nwLen = nw.length;
      const swLen = sw.length;
      const seLen = se.length;
      const maxQuadSize = Math.max(neLen, nwLen, swLen, seLen);

      // Notice that each branch will only occur once.
      console.assert(
        maxQuadSize > 0,
        "in QuadTree.subdivide: maximum number of points per " +
          "quadrant is non-positive and yet node size is greater than 4.",
        maxQuadSize,
        this.getNodeSize()
      );
      if (neLen === maxQuadSize) {
        this.createNE();
        this.northEast.crudeInsert(ne, false);
        this.removePoints(ne);
        ne = [];
      } else if (nwLen === maxQuadSize) {
        this.createNW();
        this.northWest.crudeInsert(nw, false);
        this.removePoints(nw);
        nw = [];
      } else if (swLen === maxQuadSize) {
        this.createSW();
        this.southWest.crudeInsert(sw, false);
        this.removePoints(sw);
        sw = [];
      } else {
        // seLen == maxQuadSize
        this.createSE();
        this.southEast.crudeInsert(se, false);
        this.removePoints(se);
        se = [];
      }
    }

    // We should now be balanced.
    console.assert(
      this.getNodeSize() <= 4,
      "in QuadTree.subdivide: subdivide ended with node size " +
        "larger than 4",
      this.getNodeSize()
    );
  }

  protected prune(depthNotify: boolean): Array<[IPoint2D, T]> {
    // TODO
    const nodeSize = this.getNodeSize();
    let depthAltered = false;
    const pds = new Array<[IPoint2D, T]>();
    let escape = 0;
    let minQuadSize = this.defaultMapReduceQuads(
      Number.POSITIVE_INFINITY,
      q => q.size,
      Math.min
    );
    let numQuads = this.defaultMapReduceQuads(
      0,
      q => 1,
      (r1, r2, r3, r4) => r1 + r2 + r3 + r4
    );
    let numPoints = this.points.length;
    while (
      escape++ < 4 &&
      numQuads > 0 &&
      minQuadSize + numPoints + numQuads <= 5
    ) {
      if (this.northEast != null && minQuadSize === this.northEast.size) {
        const pds0 = this.northEast.prune(false);
        pds.push(...pds0);
        this.points.push(...pds0);
        this.northEast = null;
        depthAltered = true;
      } else if (
        this.northWest != null &&
        minQuadSize === this.northWest.size
      ) {
        const pds0 = this.northWest.prune(false);
        pds.push(...pds0);
        this.points.push(...pds0);
        this.northWest = null;
        depthAltered = true;
      } else if (
        this.southWest != null &&
        minQuadSize === this.southWest.size
      ) {
        const pds0 = this.southWest.prune(false);
        pds.push(...pds0);
        this.points.push(...pds0);
        this.southWest = null;
        depthAltered = true;
      } else if (
        this.southEast != null &&
        minQuadSize === this.southEast.size
      ) {
        const pds0 = this.southEast.prune(false);
        pds.push(...pds0);
        this.points.push(...pds0);
        this.southEast = null;
        depthAltered = true;
      }
      minQuadSize = this.defaultMapReduceQuads(
        Number.POSITIVE_INFINITY,
        q => q.size,
        Math.min
      );
      numQuads = this.defaultMapReduceQuads(
        0,
        q => 1,
        (r1, r2, r3, r4) => r1 + r2 + r3 + r4
      );
      numPoints = this.points.length;
    }
    if (depthAltered) {
      this.notifyDepthChange(depthNotify);
    }
    return pds;
  }

  protected crudeInsert(pds: Array<[IPoint2D, T]>, overwrite: boolean): number {
    /* PRE:
     *   + No duplicates in `pds` or common points with `this.points`
     */
    // Partition the new points into the quadrants
    let [ne, nw, sw, se] = [
      new Array<[IPoint2D, T]>(),
      new Array<[IPoint2D, T]>(),
      new Array<[IPoint2D, T]>(),
      new Array<[IPoint2D, T]>()
    ];
    const center = this.getCenter();
    for (const pd of pds) {
      const p = pd[0];
      if (!this.inBoundary(p)) {
        continue;
      }
      if (this.containsPoint(p)) {
        if (overwrite) {
          this.updatePoint(p, pd[1]);
        }
        continue;
      }
      if (p.x <= center.x) {
        if (p.y <= center.y) {
          // South West
          sw.push(pd);
        } else {
          // North West
          nw.push(pd);
        }
      } else {
        if (p.y <= center.y) {
          // South East
          se.push(pd);
        } else {
          // North East
          ne.push(pd);
        }
      }
    }

    let numPointsAdded = 0;

    // Create new quadrants if absolutely necessary.
    // Place new points into non-null quadrants.
    if (this.northEast != null || ne.length > 4) {
      if (this.northEast == null) {
        this.createNE();
      }
      if (ne.length > 0) {
        numPointsAdded += this.northEast.crudeInsert(ne, overwrite);
        ne = [];
      }
    }
    if (this.northWest != null || nw.length > 4) {
      if (this.northWest == null) {
        this.createNW();
      }
      if (nw.length > 0) {
        numPointsAdded += this.northWest.crudeInsert(nw, overwrite);
        nw = [];
      }
    }
    if (this.southWest != null || sw.length > 4) {
      if (this.southWest == null) {
        this.createSW();
      }
      if (sw.length > 0) {
        numPointsAdded += this.southWest.crudeInsert(sw, overwrite);
        sw = [];
      }
    }
    if (this.southEast != null || se.length > 4) {
      if (this.southEast == null) {
        this.createSE();
      }
      if (se.length > 0) {
        numPointsAdded += this.southEast.crudeInsert(se, overwrite);
        se = [];
      }
    }

    // Now there should be no more than 16 new points yet to be placed.
    console.assert(
      ne.length <= 4,
      "in QuadTree.crudeInsert: More than 4 points lie in " +
        "north east quadrant.",
      ne.length
    );
    console.assert(
      nw.length <= 4,
      "in QuadTree.crudeInsert: More than 4 points lie in " +
        "north west quadrant.",
      nw.length
    );
    console.assert(
      sw.length <= 4,
      "in QuadTree.crudeInsert: More than 4 points lie in " +
        "south west quadrant.",
      sw.length
    );
    console.assert(
      se.length <= 4,
      "in QuadTree.crudeInsert: More than 4 points lie in " +
        "south east quadrant.",
      se.length
    );

    // Make remaining points temporary leaves, and then call `subdivide`
    const newPoints = [...ne, ...nw, ...sw, ...se];
    // Overwrite any duplicates in the specified way
    // NOTE: we assumed there are no duplicates in the new points
    this.points.push(...newPoints);
    numPointsAdded += newPoints.length;
    if (this.getNodeSize() > 4) {
      this.subdivide();
    }
    this.size += numPointsAdded;
    return numPointsAdded;
  }
}
