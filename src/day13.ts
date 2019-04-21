import "./collection";
import * as util from "./util";

enum Orientation {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

enum TurnDirection {
  LEFT,
  STRAIGHT,
  RIGHT
}

interface Position {
  X: number;
  Y: number;
}

class Cart {
  constructor(
    readonly pos: Position,
    private orientation: Orientation,
    private turnDirection = TurnDirection.LEFT
  ) {}

  public move(): void {
    this.goStraight();
  }

  public goStraight(): void {
    switch (this.orientation) {
      case Orientation.UP:
        this.pos.Y -= 1;
        break;
      case Orientation.DOWN:
        this.pos.Y += 1;
        break;
      case Orientation.LEFT:
        this.pos.X -= 1;
        break;
      case Orientation.RIGHT:
        this.pos.X += 1;
        break;
    }
  }

  public turnLeft(): void {
    switch (this.orientation) {
      case Orientation.UP:
        this.orientation = Orientation.LEFT;
        break;
      case Orientation.DOWN:
        this.orientation = Orientation.RIGHT;
        break;
      case Orientation.LEFT:
        this.orientation = Orientation.DOWN;
        break;
      case Orientation.RIGHT:
        this.orientation = Orientation.UP;
        break;
    }
  }

  public turnRight(): void {
    switch (this.orientation) {
      case Orientation.UP:
        this.orientation = Orientation.RIGHT;
        break;
      case Orientation.DOWN:
        this.orientation = Orientation.LEFT;
        break;
      case Orientation.LEFT:
        this.orientation = Orientation.UP;
        break;
      case Orientation.RIGHT:
        this.orientation = Orientation.DOWN;
        break;
    }
  }

  public decideDirectionAtIntersection(): void {
    switch (this.turnDirection) {
      case TurnDirection.LEFT:
        this.turnLeft();
        this.turnDirection = TurnDirection.STRAIGHT;
        break;
      case TurnDirection.RIGHT:
        this.turnRight();
        this.turnDirection = TurnDirection.LEFT;
        break;
      case TurnDirection.STRAIGHT:
        this.turnDirection = TurnDirection.RIGHT;
        break;
    }
  }

  public decideDirectionAtUpRightCurve(): void {
    /// Decide direction when meet '/' curve
    switch (this.orientation) {
      case Orientation.LEFT:
      case Orientation.RIGHT:
        this.turnLeft();
        break;
      case Orientation.UP:
      case Orientation.DOWN:
        this.turnRight();
        break;
    }
  }

  public decideDirectionAtUpLeftCurve(): void {
    /// Decide direction at '\' curve
    switch (this.orientation) {
      case Orientation.LEFT:
      case Orientation.RIGHT:
        this.turnRight();
        break;
      case Orientation.UP:
      case Orientation.DOWN:
        this.turnLeft();
        break;
    }
  }
}

class Track {
  constructor(private trackData: string[]) {}

  public getRayAtPos(position: Position): string {
    return this.trackData[position.Y].charAt(position.X);
  }
}

class System {
  public track: Track;
  public carts: Map<string, Cart>;

  constructor(trackData: string[]) {
    this.carts = new Map();
    const newData: string[] = [];

    for (const [index, row] of trackData.entries()) {
      for (let i = 0; i < row.length; i++) {
        const position: Position = { X: i, Y: index };
        let cart: Cart;
        switch (row[i]) {
          case ">":
            cart = new Cart(position, Orientation.RIGHT);
            this.carts.set(JSON.stringify(position), cart);
            break;
          case "<":
            cart = new Cart(position, Orientation.LEFT);
            this.carts.set(JSON.stringify(position), cart);
            break;
          case "^":
            cart = new Cart(position, Orientation.UP);
            this.carts.set(JSON.stringify(position), cart);
            break;
          case "v":
            cart = new Cart(position, Orientation.DOWN);
            this.carts.set(JSON.stringify(position), cart);
            break;
        }
      }

      newData.push(row.replace(/\^|v/g, "|").replace(/<|>/g, "-"));
    }

    this.track = new Track(newData);
  }

  public run(): void {
    while (this.carts.size > 1) {
      this.takeOneTurn();
    }
    console.log("last cart at", this.carts.keys().next());
  }

  private takeOneTurn(): void {
    this.sortCarts();
    const newCarts: Map<string, Cart> = new Map();
    for (const [pos, cart] of this.carts) {
      newCarts.set(pos, cart);
    }

    for (const [pos, cart] of this.carts) {
      if (!newCarts.has(pos)) {
        continue;
      }
      newCarts.delete(pos);
      this.takeOneTurnForCart(cart);

      const newPos = JSON.stringify(cart.pos);
      if (newCarts.has(newPos)) {
        console.log(`collision at ${newPos}`);
        newCarts.delete(newPos);
      } else {
        newCarts.set(newPos, cart);
      }
    }

    this.carts = newCarts;
  }

  private sortCarts(): void {
    this.carts = new Map(
      [...this.carts.entries()].sort(([posA, a], [posB, b]) =>
        a.pos.Y === b.pos.Y ? a.pos.X - b.pos.X : a.pos.Y - b.pos.Y
      )
    );
  }

  private takeOneTurnForCart(cart: Cart): void {
    cart.goStraight();
    switch (this.track.getRayAtPos(cart.pos)) {
      case "\\":
        cart.decideDirectionAtUpLeftCurve();
        break;
      case "/":
        cart.decideDirectionAtUpRightCurve();
        break;
      case "+":
        cart.decideDirectionAtIntersection();
        break;
    }
  }
}

const lines = util.readInputForDay(13);
const system = new System(lines);
try {
  system.run();
} catch (e) {
  console.log(e.message);
}
