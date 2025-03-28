import { Ship } from './ship.js';
export class Gameboard {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));
    this.receivedShots = [];
    this.ships = [];
  }
  placeShip(coordinates) {
    if (!this.isValidPlacement(coordinates)) return false;
    let ship = new Ship(coordinates.length);

    coordinates.forEach(([x, y]) => {
      this.board[x][y] = ship;
    });
    this.ships.push(ship);
    return ship;
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
}
