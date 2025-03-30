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

  disableButtons() {
    if (typeof document === 'undefined') return;
    const compBoardDiv = document.querySelector('#player-2-grid');
    const buttons = compBoardDiv.querySelectorAll('button');
    buttons.forEach((button) => {
      button.disabled = true;
    });
  },
  enableButtons() {
    if (typeof document === 'undefined') return;
    const compBoardDiv = document.querySelector('#player-2-grid');
    const buttons = compBoardDiv.querySelectorAll('button');
    buttons.forEach((button) => {
      button.disabled = false;
    });
  },
  async createBoard(playerBoard, player, game) {
    player.gameboard.board.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        const cell = document.createElement('button');
        cell.classList.add('grid-cell');
        playerBoard.append(cell);

        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;
        if (player === game.player2) {
          cell.addEventListener('click', async () => {
            createUI.disableButtons();
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            const attemptedShot =
              game.currentPlayer.opponent.gameboard.receivedShots.find(
                (s) => s.coordinates[0] === row && s.coordinates[1] === col
              );

            if (attemptedShot) {
              console.log(
                `Already shot at (${row}, ${col}) - it was a ${attemptedShot.hit ? 'hit' : 'miss'}`
              );
              createUI.enableButtons();
              return;
            }

            await game.playTurn([row, col]);
            createUI.enableButtons();
          });
        }
      });
    });
  },
  addHitOrMissClass(playerShot) {
    const [x, y] = playerShot.coordinates;
    const cell = document.querySelector(
      `#player-2-grid [data-row="${x}"][data-col="${y}"]`
    );
    if (playerShot && playerShot.hit) {
      cell.classList.add('hit');
    } else {
      cell.classList.add('miss');
    }
  },
  renderShips(game) {
    document.querySelectorAll('.ship').forEach((element) => {
      element.classList.remove('ship');
    });
    game.player1.gameboard.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell != null) {
          const shipPart = document.querySelector(
            `[data-row="${rowIndex}"][data-col="${colIndex}"]`
          );
          shipPart.classList.add('ship');
        }
      });
    });
  },
  addClass(coordinates, player) {
    if (typeof document === 'undefined') return;
    let [x, y] = coordinates;
    const cell = document.querySelector(`[data-row="${x}"][data-col="${y}"]`);
    const shot = player.gameboard.receivedShots.find(
      (s) => s.coordinates[0] === x && s.coordinates[1] === y
    );
    if (shot) cell.classList.add(shot.hit ? 'hit' : 'miss');
  },
  // add a logic to disable randomize if a game started
  addUtilityButtons(game) {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'RESTART';

    const randomizeButton = document.createElement('button');
    randomizeButton.textContent = 'RANDOMIZE';

    randomizeButton.addEventListener('click', () => {
      game.player1.gameboard.resetBoard();
      game.player1.placeShipsRandomly();
      this.renderShips(game);
    });

    const buttonDivs = document.createElement('div');
    buttonDivs.append(restartButton, randomizeButton);
    const content = document.querySelector('.content');
    content.append(buttonDivs);
  },
};
export default createUI;
