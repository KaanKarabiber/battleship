import { Player } from './player.js';
import { ComputerPlayer } from './computerPlayer.js';

export class Game {
  constructor() {
    this.player1 = new Player('Player 1');
    this.player2 = new ComputerPlayer('Computer');
    this.currentPlayer = this.player1; // Player 1 starts the game
  }

  // Method to switch turns
  switchTurn() {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else {
      this.currentPlayer = this.player1;
    }
  }

  playTurn(coordinates) {
    this.currentPlayer.attack(coordinates);
    this.switchTurn();
  }
  isGameOver() {
    return !this.player1.hasShipsLeft() || !this.player2.hasShipsLeft();
  }
}
