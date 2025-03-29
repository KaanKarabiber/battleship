import './styles.css';
import { Game } from './game.js';
import createUI from './createUI.js';

const game = new Game();
game.player1.setOpponent(game.player2);
game.player2.setOpponent(game.player1);

game.player1.placeShipsRandomly();
game.player2.placeShipsRandomly();
const boards = createUI.createDivs();
createUI.createBoard(boards[0], game.player1, game);
createUI.createBoard(boards[1], game.player2, game);
createUI.renderShips(game);
