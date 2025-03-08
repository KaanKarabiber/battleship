import { Gameboard } from './gameboard.js';

export class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.opponent = null;
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
}
