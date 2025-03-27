import { Player } from './player.js';

export class ComputerPlayer extends Player {
  constructor() {
    super('Computer');
  }
  placeShip() {
    this.shipLengths.forEach((length) => {
      const coordinates = this.generateRandomCoordinates(length);
      super.placeShip(coordinates);
    });
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
  attack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    super.attack([x, y]);
  }
}
