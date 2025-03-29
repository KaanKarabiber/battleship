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
  placeShipsRandomly() {
    this.shipLengths.forEach((length) => {
      const coordinates = this.generateRandomCoordinates(length);
      this.placeShip(coordinates);
    });
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
  generateRandomCoordinates(length) {
    let coordinates;
    const isHorizontal = Math.random() < 0.5; // Randomly decide direction
    let x, y;

    do {
      coordinates = [];
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      for (let i = 0; i < length; i++) {
        let newX = isHorizontal ? x + i : x;
        let newY = isHorizontal ? y : y + i;

        // Ensure it stays within the board
        if (newX >= 10 || newY >= 10) {
          coordinates = [];
          break; // Restart if out of bounds
        }

        coordinates.push([newX, newY]);
      }
    } while (
      coordinates.length !== length ||
      !this.gameboard.isValidPlacement(coordinates)
    );

    return coordinates;
  }
}
