import { Ship } from './ship.js';
export class Gameboard {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    this.receivedShots = [];
    this.ships = [];
  }
  placeShip(coordinates, id = null, orientation = null) {
    if (!this.isValidPlacement(coordinates)) return false;
    let ship = new Ship(coordinates.length, id, orientation, coordinates);

    coordinates.forEach(([x, y]) => {
      this.board[x][y] = ship;
    });
    this.ships.push(ship);
    return ship;
  }
  removeShip(coordinates) {
    if (!coordinates || coordinates.length === 0) return false;

    const [x0, y0] = coordinates[0];
    const shipToRemove = this.board[x0][y0];

    if (!(shipToRemove instanceof Ship)) {
      return false;
    }

    this.ships = this.ships.filter((ship) => ship !== shipToRemove);

    coordinates.forEach(([x, y]) => {
      if (this.board[x][y] === shipToRemove) {
        this.board[x][y] = null;
      }
    });

    return true;
  }

  isValidPlacement(coordinates) {
    return coordinates.every(
      ([x, y]) =>
        x >= 0 && x < 10 && y >= 0 && y < 10 && this.board[x][y] === null
    );
  }
  receiveAttack([x, y]) {
    const hit = this.board[x][y] instanceof Ship;
    if (hit) {
      this.board[x][y].hit();
    }
    this.receivedShots.push({ coordinates: [x, y], hit });
  }
  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
  resetBoard() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    this.receivedShots = [];
    this.ships = [];
  }
}
