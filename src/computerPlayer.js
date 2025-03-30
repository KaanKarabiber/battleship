import { Player } from './player.js';

export class ComputerPlayer extends Player {
  constructor() {
    super('Computer');
    this.lastHit = null;
    this.targetQueue = [];
  }
  attack() {
    let x, y;
    let validAttack = false;

    if (Array.isArray(this.targetQueue) && this.targetQueue.length > 0) {
      [x, y] = this.targetQueue.shift();
      validAttack = true;
    }

    while (!validAttack) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      const attemptedShot = this.opponent.gameboard.receivedShots.find(
        (s) => s.coordinates[0] === x && s.coordinates[1] === y
      );

      if (!attemptedShot) {
        validAttack = true;
      }
    }

    super.attack([x, y]);
    // Get the last attack result
    const lastShot =
      this.opponent.gameboard.receivedShots[
        this.opponent.gameboard.receivedShots.length - 1
      ];

    if (lastShot.hit) {
      this.lastHit = [x, y];
      this.queueAdjacentShots(x, y); // Queue adjacent squares for next attack
    }

    return [x, y];
  }
  queueAdjacentShots(x, y) {
    const possibleMoves = [
      [x - 1, y], // Left
      [x + 1, y], // Right
      [x, y - 1], // Up
      [x, y + 1], // Down
    ];

    for (const [newX, newY] of possibleMoves) {
      if (
        newX >= 0 &&
        newX < 10 &&
        newY >= 0 &&
        newY < 10 &&
        !this.opponent.gameboard.receivedShots.find(
          (s) => s.coordinates[0] === newX && s.coordinates[1] === newY
        )
      ) {
        this.targetQueue.push([newX, newY]);
      }
    }
    while (this.targetQueue.length > 5) this.targetQueue.shift();
  }
}
