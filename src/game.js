import { Player } from './player.js';
import { ComputerPlayer } from './computerPlayer.js';

export class Game {
  constructor() {
    this.player1 = new Player('Player 1');
    this.player2 = new ComputerPlayer('Computer');
    this.currentPlayer = this.player1; // Player 1 starts the game
  }

  switchTurn() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  playTurn(coordinates) {
    this.currentPlayer.attack(coordinates);
    const [x, y] = coordinates;
    const shot = this.currentPlayer.opponent.gameboard.receivedShots.find(
      (s) => s.coordinates[0] === x && s.coordinates[1] === y
    );
    // if the attack is a hit don't switch turns
    if (shot && shot.hit) {
      return;
    }
    this.switchTurn();
    if (this.currentPlayer.name === 'Computer') {
      let coordinates;
      let x, y;
      do {
        coordinates = this.currentPlayer.attack();
        [x, y] = coordinates;
        console.log(coordinates);
      } while (
        this.currentPlayer.opponent.gameboard.receivedShots.find(
          (s) =>
            s.coordinates[0] === x &&
            s.coordinates[1] === y &&
            this.currentPlayer.opponent.gameboard.receivedShots.find(
              (s) => s.coordinates[0] === x && s.coordinates[1] === y
            ).hit
        )
      );

      this.switchTurn();
    }
  }
  isGameOver() {
    return !this.player1.hasShipsLeft() || !this.player2.hasShipsLeft();
  }
}
