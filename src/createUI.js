// import { Game } from './game.js';

const createUI = {
  createDivs() {
    const player1Grid = document.createElement('div');
    player1Grid.classList.add('board');
    player1Grid.id = 'player-1-grid';

    const player2Grid = document.createElement('div');
    player2Grid.classList.add('board');
    player2Grid.id = 'player-2-grid';

    const content = document.querySelector('.content');
    content.append(player1Grid, player2Grid);
    return [player1Grid, player2Grid];
  },
  createBoard(playerBoard, player) {
    player.gameboard.board.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        const cell = document.createElement('button');
        cell.classList.add('grid-cell');
        playerBoard.append(cell);

        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;

        cell.addEventListener('click', () => {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);

          console.log(`Cell clicked at coordinates: (${row}, ${col})`);
        });
      });
    });
  },
};
export default createUI;
