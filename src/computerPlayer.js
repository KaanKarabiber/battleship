import { Player } from './player.js';

export class ComputerPlayer extends Player {
  constructor(name) {
    super(name);
  }
  placeShip() {
    const randomCoordinates = this.generateRandomCoordinates();
    return super.placeShip(randomCoordinates);
  }
  generateRandomCoordinates() {
    let coordinates = [];
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    coordinates.push([x, y]);

    // Add a few more coordinates to form a ship (random length between 2 and 4)
    const length = Math.floor(Math.random() * 3) + 2;
    for (let i = 1; i < length; i++) {
      coordinates.push([x + i, y]); // Horizontally place the ship (could be improved)
    }

    return coordinates;
  }
  attack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    super.attack([x, y]);
  }
}
