import './styles.css';
import { Game } from './game.js';
import createUI from './createUI.js';

const game = new Game();
game.player1.setOpponent(game.player2);
game.player2.setOpponent(game.player1);
game.player1.placeShip([
  [0, 0],
  [0, 1],
  [0, 2],
]);
game.player1.placeShip([
  [0, 3],
  [0, 4],
  [0, 5],
]);
game.player1.placeShip([
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
]);
game.player2.placeShip();
const boards = createUI.createDivs();
createUI.createBoard(boards[0], game.player1, game);
createUI.createBoard(boards[1], game.player2, game);
createUI.renderShips(game);
