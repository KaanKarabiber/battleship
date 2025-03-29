import { Gameboard } from './gameboard.js';

export class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.opponent = null;
    this.shipLengths = [5, 4, 3, 3, 2];
  }
  setName(name) {
    this.name = name;
  }
  setOpponent(opponent) {
    this.opponent = opponent;
  }
  placeShip(coordinates) {
    return this.gameboard.placeShip(coordinates);
  }
  attack([x, y]) {
    if (this.opponent) {
      this.opponent.gameboard.receiveAttack([x, y]);
    }
  }
  hasShipsLeft() {
    return !this.gameboard.allShipsSunk();
  }
  areAllShipsPlaced() {
    return this.gameboard.ships.length === this.shipLengths.length;
  }
}
