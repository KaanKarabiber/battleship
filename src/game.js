import { Player } from './player.js';
import { ComputerPlayer } from './computerPlayer.js';
import createUI from './createUI.js';

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
    if (this.isGameOver()) console.log('end');
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
        if (this.isGameOver()) console.log('end');
        [x, y] = coordinates;
        createUI.addClass(coordinates, this.player1);
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
