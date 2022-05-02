import {Axial, Grid, Hexagon} from "./BHex.Core";

export class Drawing {
  public grid: Grid;
  public options: Options;

  constructor(grid: Grid, options: Options) {
    this.grid = grid;
    this.options = options;

    this.grid.hexes.forEach((hex) => {
      hex.center = this.getCenter(hex, options);
      hex.points = this.getCorners(hex.center, options);
    });
  }

  public getCorners(center: Point, options: Options): Point[] {
    let points = [];

    for (let i = 0; i < 6; i++) {
      points.push(this.getCorner(center, options, i));
    }
    return points;
  };

  public getCorner(center: Point, options: Options, corner: number): Point {
    let offset = (options.orientation === Orientation.PointyTop) ? 90 : 0,
      angle_deg = 60 * corner + offset,
      angle_rad = Math.PI / 180 * angle_deg;
    return new Point(center.x + options.size * Math.cos(angle_rad),
      center.y + options.size * Math.sin(angle_rad));
  };

  getCenter(axial: Axial, options: Options): Point {
    let x = 0, y = 0, c = axial.toCube();

    if (options.orientation == Orientation.FlatTop) {
      x = c.x * options.width * 3 / 4;
      y = (c.z + c.x / 2) * options.height;

    } else {
      x = (c.x + c.z / 2) * options.width;
      y = c.z * options.height * 3 / 4;
    }

    return new Point(x, y);
  };

  getHexAt(p: Point): Hexagon {
    let x: number, y: number;

    if (this.options.orientation == Orientation.FlatTop) {
      x = p.x * 2 / 3 / this.options.size;
      y = (-p.x / 3 + Math.sqrt(3) / 3 * p.y) / this.options.size;
    } else {
      x = (p.x * Math.sqrt(3) / 3 - p.y / 3) / this.options.size;
      y = p.y * 2 / 3 / this.options.size;
    }

    let a = new Axial(x, y).toCube().round().toAxial();

    return this.grid.getHexAt(a);
  };
}

export class Options {
  public size: number;
  public orientation: Orientation;
  public center: Point;
  public width: number;
  public height: number;

  constructor(side: number, orientation: Orientation, center: Point) {
    this.size = side;
    this.orientation = orientation || Orientation.FlatTop;
    this.center = center || new Point(0, 0);

    if (this.orientation == Orientation.FlatTop) {
      this.width = side * 2;
      this.height = Math.sqrt(3) / 2 * this.width;
    } else {
      this.height = side * 2;
      this.width = Math.sqrt(3) / 2 * this.height;
    }
  }
}

export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export enum Orientation {
  FlatTop = 1,
  PointyTop
}
