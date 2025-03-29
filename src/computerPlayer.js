import { Player } from './player.js';

export class ComputerPlayer extends Player {
  constructor() {
    super('Computer');
  }
  attack() {
    let x, y;
    let validAttack = false;

    while (!validAttack) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      // Check if the computer has already attacked this spot
      const attemptedShot = this.opponent.gameboard.receivedShots.find(
        (s) => s.coordinates[0] === x && s.coordinates[1] === y
      );

      if (!attemptedShot) {
        validAttack = true;
      }
    }
    super.attack([x, y]);
    return [x, y];
  }
}
