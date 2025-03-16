// import { Game } from './game.js';

const createUI = {
  createDivs() {
    const player1Grid = document.createElement('div');
    player1Grid.classList.add('board');
    player1Grid.id = 'player-1-grid';

    const player2Grid = document.createElement('div');
    player2Grid.id = 'player-2-grid';
    player2Grid.classList.add('board');

    const content = document.querySelector('.content');
    content.append(player1Grid, player2Grid);
    return [player1Grid, player2Grid];
  },
  createBoard(playerBoard, player) {
    player.gameboard.board.forEach((row) => {
      row.forEach(() => {
        const cell = document.createElement('button');
        cell.classList.add('grid-cell');
        playerBoard.append(cell);
      });
    });
  },
};
export default createUI;
