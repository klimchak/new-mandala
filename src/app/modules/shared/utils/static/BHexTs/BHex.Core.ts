import {Drawing, Options, Point} from "./BHex.Drawing";
import {BinaryHeap} from "./BinaryHeap";

export class BHex {
  public _Axial: Axial | undefined;
  public _Cube: Cube | undefined;
  public _Hexagon: Hexagon | undefined;
  public _Grid: Grid | undefined;
  public _Drawing: Drawing | undefined;

  public setAxial(x: number, y: number): void {
    this._Axial = new Axial(x, y);
  };

  public setCube(x: number, y: number, z: number): void {
    this._Cube = new Cube(x, y, z);
  };

  public setHexagon(x: number, y: number, cost?: number, blocked?: boolean): void {
    this._Hexagon = new Hexagon(x, y, cost, blocked);
  };

  public setGrid(radius: number): void {
    this._Grid = new Grid(radius);
  };

  public setDrawing(grid: Grid, options: Options): void {
    this._Drawing = new Drawing(grid, options);
  };
}

export class Axial {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getKey(): string {
    return `${this.x}x${this.y}`;
  };

  public toCube(): Cube {
    return new Cube(this.x, -this.x - this.y, this.y);
  };

  public compareTo(other: Axial | Cube | Hexagon): boolean {
    return (this.x == other.x && this.y == other.y);
  };
}

export class Cube {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z || -x - y;
  }

  toAxial(): Axial {
    return new Axial(this.x, this.z);
  };

  round(): Cube {
    let cx = this.x,
      cy = this.y,
      cz = this.z;

    this.x = cx;
    this.y = cy;
    this.z = cz;

    let x_diff = Math.abs(this.x - cx),
      y_diff = Math.abs(this.y - cy),
      z_diff = Math.abs(this.z - cz);

    if (x_diff > y_diff && x_diff > z_diff)
      this.x = -this.y - this.z;
    else if (y_diff > z_diff)
      this.y = -this.x - this.z;
    else
      this.z = -this.x - this.y;

    return this;
  };
}

export class Hexagon {
  public x: number;
  public y: number;
  public blocked: boolean;
  public cost: number;
  public center: Point;
  public points: Point[] = [];

  constructor(x: number, y: number, cost?: number, blocked?: boolean) {
    this.x = x;
    this.y = y;
    this.cost = (cost) ? cost : 1;
    this.blocked = !!blocked;
    this.center = new Point(this.x, this.y);
  }
}

export class Grid {
  public radius: number;
  public hexes: any[];

  constructor(radius: number) {
    this.radius = radius || 0;
    this.hexes = [];
    for (let x = -radius; x <= radius; x++)
      for (let y = -radius; y <= radius; y++)
        for (let z = -radius; z <= radius; z++)
          if (x + y + z == 0)
            this.hexes.push(new Axial(x, y));
  }

  getHexAt(a: Axial): any {
    let hex;
    this.hexes.some((h) => {
      if (h.compareTo(a))
        return hex = h;
    });
    return hex;
  };

  getNeighbors(a: Axial): Hexagon[] {
    let grid = this;

    let neighbors: Hexagon[] = [],
      directions = [
        new Axial(a.x + 1, a.y), new Axial(a.x + 1, a.y - 1), new Axial(a.x, a.y - 1),
        new Axial(a.x - 1, a.y), new Axial(a.x - 1, a.y + 1), new Axial(a.x, a.y + 1)
      ];

    directions.forEach(function (d) {
      let h = grid.getHexAt(d)
      if (h) neighbors.push(h);
    });

    return neighbors;
  };

  getDistance(a: any, b: any): number {
    return (Math.abs(a.x - b.x)
        + Math.abs(a.x + a.y - b.x - b.y)
        + Math.abs(a.y - b.y))
      / 2
  };

  getLine(start: Axial, end: Axial): Hexagon[] {
    if (start.compareTo(end)) return [];

    let cube_lerp = function (a: Cube, b: Cube, t: number) {
        return new Cube(a.x + (b.x - a.x) * t,
          a.y + (b.y - a.y) * t,
          a.z + (b.z - a.z) * t);
      },

      N = this.getDistance(start, end),
      line1 = [],
      line2 = [],

      cStart = start.toCube(),
      cEnd1 = end.toCube(),
      cEnd2 = end.toCube();

    // Offset the ends slightly to get two lines, handling horizontal and vertical lines (in FlatTop and PointyTop respectively).
    cEnd1.x -= 1e-6;
    cEnd1.y -= 1e-6;
    cEnd1.z += 2e-6;
    cEnd2.x += 1e-6;
    cEnd2.y += 1e-6;
    cEnd2.z -= 2e-6;

    for (let i = 0; i <= N; i++) {
      let axial = cube_lerp(cStart, cEnd1, 1.0 / N * i).round().toAxial();

      let hex = this.getHexAt(axial);

      if (!start.compareTo(hex)) {
        if (!hex.blocked) {
          line1.push(hex);
        } else break;
      }
    }

    for (let i = 0; i <= N; i++) {
      let axial = cube_lerp(cStart, cEnd2, 1.0 / N * i).round().toAxial();

      let hex = this.getHexAt(axial);

      if (!start.compareTo(hex)) {
        if (!hex.blocked) {
          line2.push(hex);
        } else break;
      }
    }

    return (line1.length > line2.length) ? line1 : line2;
  };

  getRange(start: any, movement: number) {
    let grid = this,

      openHeap = new BinaryHeap(),
      closedHexes = {},
      visitedNodes = {};

    openHeap.push(new Node(start, null, 0));

    while (openHeap.size() > 0) {
      // Get the item with the lowest score (current + heuristic).
      let current = openHeap.pop();

      // Close the hex as processed.
      // @ts-ignore
      closedHexes[current.hex.getKey()] = current.hex;

      // Get and iterate the neighbors.
      let neighbors = grid.getNeighbors(current.hex);

      neighbors.forEach((n) => {
        // Make sure the neighbor is not blocked and that we haven't already processed it.
        // @ts-ignore
        if (n.blocked || closedHexes[n.getKey()]) return;

        // Get the total cost of going to this neighbor.
        let g = current.G + n.cost,
          // @ts-ignore
          visited = visitedNodes[n.getKey()];

        // Is it cheaper the previously best path to get here?
        if (g <= movement && (!visited || g < visited.G)) {
          let h = 0;

          if (!visited) {
            // This was the first time we visited this node, add it to the heap.
            let nNode = new Node(n, current, g, h);
            // @ts-ignore
            visitedNodes[n.getKey()] = nNode;
            openHeap.push(nNode);
          } else {
            // We've visited this path before, but found a better path. Rescore it.
            visited.rescore(current, g, h);
            openHeap.rescoreElement(visited);
          }
        }
      });
    }

    let arr = [];
    for (let i in visitedNodes)
      if (visitedNodes.hasOwnProperty(i)) { // @ts-ignore
        arr.push(visitedNodes[i].hex);
      }

    return arr;
  };

  findPath(start: any, end: any) {
    let grid = this,
      openHeap = new BinaryHeap(),
      closedHexes = {},
      visitedNodes = {};

    openHeap.push(new Node(start, null, 0, grid.getDistance(start, end)));

    while (openHeap.size() > 0) {
      // Get the item with the lowest score (current + heuristic).
      let current = openHeap.pop();

      // SUCCESS: If this is where we're going, backtrack and return the path.
      if (current.hex.compareTo(end)) {
        let path = [];
        while (current.parent) {
          path.push(current);
          current = current.parent;
        }
        return path.map(function (x) {
          return x.hex;
        }).reverse();
      }

      // Close the hex as processed.
      // @ts-ignore
      closedHexes[current.hex.getKey()] = current;

      // Get and iterate the neighbors.
      let neighbors = grid.getNeighbors(current.hex);
      neighbors.forEach(function (n) {
        // Make sure the neighbor is not blocked and that we haven't already processed it.
        // @ts-ignore
        if (n.blocked || closedHexes[n.getKey()]) return;

        // Get the total cost of going to this neighbor.
        let g = current.G + n.cost,
          // @ts-ignore
          visited = visitedNodes[n.getKey()];

        // Is it cheaper the previously best path to get here?
        if (!visited || g < visited.G) {
          let h = grid.getDistance(n, end);

          if (!visited) {
            // This was the first time we visited this node, add it to the heap.
            let nNode = new Node(n, current, g, h);
            // @ts-ignore
            closedHexes[nNode.hex.getKey()] = nNode;
            openHeap.push(nNode);
          } else {
            // We've visited this path before, but found a better path. Rescore it.
            visited.rescore(current, g, h);
            openHeap.rescoreElement(visited);
          }
        }
      });
    }

    // Failed to find a path
    return [];
  };
}

export class Node {
  public hex!: any;
  public parent!: any | null;
  public G!: number | null;
  public H!: number | null;
  public F!: number | null;

  constructor(hex: any, parent: any | null, g: number, h?: number) {
    this.hex = hex;
    this.parent = this.G = this.H = this.F = null;
    this.rescore(parent, g, h);
  }

  rescore(parent: any | null, g: number, h?: number) {
    this.parent = parent;
    this.G = g;
    this.H = h || 0;
    this.F = this.G + this.H;
  };
}
