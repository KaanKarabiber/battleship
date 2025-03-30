import { Player } from './player.js';
import { ComputerPlayer } from './computerPlayer.js';
import createUI from './createUI.js';

// Helper function for creating a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  async playTurn(coordinates) {
    this.currentPlayer.attack(coordinates);
    const [x, y] = coordinates;
    const playerShot = this.currentPlayer.opponent.gameboard.receivedShots.find(
      (s) => s.coordinates[0] === x && s.coordinates[1] === y
    );
    if (this.isGameOver()) {
      createUI.addHitOrMissClass(playerShot);
      createUI.disableButtons();
      return;
    }

    createUI.addHitOrMissClass(playerShot);

    if (!playerShot || !playerShot.hit) {
      createUI.addHitOrMissClass(playerShot);
      this.switchTurn();

      if (this.currentPlayer.name === 'Computer') {
        const delay = 500;
        await sleep(delay);

        let compCoordinates;
        let hit = false;

        do {
          compCoordinates = this.currentPlayer.attack();

          if (this.isGameOver()) {
            createUI.addClass(compCoordinates, this.player1);
            createUI.disableButtons();
            return;
          }
          createUI.addClass(compCoordinates, this.player1);

          const [cx, cy] = compCoordinates;
          const shotResult =
            this.currentPlayer.opponent.gameboard.receivedShots.find(
              (s) => s.coordinates[0] === cx && s.coordinates[1] === cy
            );

          hit = shotResult && shotResult.hit;
          if (hit) {
            const hitDelay = 300;
            await sleep(hitDelay);
          }
        } while (hit);

        this.switchTurn();
      }
    }
  }

  isGameOver() {
    return !this.player1.hasShipsLeft() || !this.player2.hasShipsLeft();
  }
  startGame(game, player1Name) {
    game.player1.name = player1Name;
    game.player1.setOpponent(game.player2);
    game.player2.setOpponent(game.player1);
    game.player1.placeShipsRandomly();
    game.player2.placeShipsRandomly();
    const boards = createUI.createDivs();
    createUI.createBoard(boards[0], game.player1, game);
    createUI.createBoard(boards[1], game.player2, game);
    createUI.renderShips(game);
    createUI.addUtilityButtons(game);
  }
  restartGame(game) {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach((cell) => {
      const classes = Array.from(cell.classList);
      classes.forEach((cls) => {
        if (cls !== 'grid-cell') {
          cell.classList.remove(cls);
        }
      });
    });
    game.player1.gameboard.resetBoard();
    game.player2.gameboard.resetBoard();
    game.player1.placeShipsRandomly();
    game.player2.placeShipsRandomly();
    createUI.renderShips(game);
  }
}
