let currentDraggedShipId = null;
let currentDragOrientation = 'vertical';
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
        if (player === game.player1) {
          cell.addEventListener('dragover', createUI.handleDragOver);
          cell.addEventListener('dragleave', createUI.handleDragLeave);
          cell.addEventListener('drop', (event) =>
            createUI.handleDrop(event, player)
          );
        }
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
            if (!game.isGameOver()) createUI.enableButtons();
          });
        }
      });
    });
  },
  addHitOrMissClass(playerShot) {
    if (typeof document === 'undefined') return;
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
    restartButton.addEventListener('click', () => {
      game.restartGame(game);
      if (document.querySelector('.start-game-button'))
        document.querySelector('.start-game-button').remove();
    });
    const randomizeButton = document.createElement('button');
    randomizeButton.textContent = 'RANDOMIZE';

    randomizeButton.addEventListener('click', () => {
      game.player1.gameboard.resetBoard();
      game.player1.placeShipsRandomly();
      this.renderShips(game);
      let draggableShips = document.querySelectorAll('.draggable-ship');
      draggableShips.forEach((ship) => {
        ship.classList.remove('draggable-ship');
        ship.draggable = false;
      });
      this.addStartGameButton();
    });
    const orientationButton = document.createElement('button');
    orientationButton.textContent = 'Vertical';
    orientationButton.addEventListener('click', () => {
      const newOrientation =
        orientationButton.textContent === 'Vertical'
          ? 'horizontal'
          : 'vertical';

      // Update the button label
      orientationButton.textContent =
        newOrientation.charAt(0).toUpperCase() + newOrientation.slice(1);

      const allShipCells = document.querySelectorAll(
        '.drag-grid .draggable-ship'
      );

      allShipCells.forEach((cell) => {
        cell.dataset.orientation = newOrientation;
      });

      currentDragOrientation = newOrientation;

      console.log(`All ships set to ${newOrientation}`);
    });

    const buttonDivs = document.createElement('div');
    buttonDivs.append(restartButton, randomizeButton, orientationButton);
    const content = document.querySelector('.content');
    content.append(buttonDivs);
  },
  addStartGameButton(player) {
    const startGame = document.createElement('button');
    startGame.classList.add('start-game-button');
    startGame.textContent = 'Start Game';

    const content = document.querySelector('.content');

    if (!player || player?.areAllShipsPlaced()) {
      content.append(startGame);
    }

    startGame.addEventListener('click', () => {
      this.enableButtons();
      startGame.remove();
    });
  },
  createDragGrid() {
    if (document.querySelector('.drag-grid'))
      document.querySelector('.drag-grid').remove();
    const content = document.querySelector('.content');
    const dragGrid = document.createElement('div');
    dragGrid.classList.add('drag-grid');

    const shipStructures = [
      {
        length: 5,
        positions: [
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ],
      },
      {
        length: 4,
        positions: [
          [6, 0],
          [7, 0],
          [8, 0],
          [9, 0],
        ],
      },
      {
        length: 3,
        positions: [
          [0, 2],
          [1, 2],
          [2, 2],
        ],
      },
      {
        length: 3,
        positions: [
          [4, 2],
          [5, 2],
          [6, 2],
        ],
      },
      {
        length: 2,
        positions: [
          [8, 2],
          [9, 2],
        ],
      },
    ];

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 3; y++) {
        const cell = document.createElement('button');
        cell.classList.add('drag-cells');

        let isShipCell = false;
        let shipId = null;

        shipStructures.forEach((ship, index) => {
          ship.positions.forEach(([shipX, shipY]) => {
            if (x === shipX && y === shipY) {
              isShipCell = true;
              shipId = `ship-${index}`; // Use the same ID for all parts of the ship
            }
          });
        });

        if (isShipCell) {
          cell.classList.add('draggable-ship');
          cell.dataset.shipId = shipId;
          cell.dataset.orientation = 'vertical';
          cell.setAttribute('draggable', 'true');
          cell.addEventListener('dragstart', createUI.handleDragStart);
          cell.addEventListener('dragend', createUI.handleDragEnd);
        }

        dragGrid.append(cell);
      }
    }
    content.prepend(dragGrid);
  },
  handleDragStart(event) {
    const shipId = event.target.dataset.shipId;

    const buttons = document.querySelectorAll(
      `button[data-ship-id="${shipId}"]`
    );
    buttons.forEach((cell) => {
      cell.style.opacity = '0.5';
    });

    currentDraggedShipId = shipId;
    const orientation = event.target.dataset.orientation;
    currentDragOrientation = orientation;

    const dragData = {
      shipId: shipId,
      orientation: orientation,
    };
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  },
  handleDragEnd(event) {
    const shipId = event.target.dataset.shipId;
    const buttons = document.querySelectorAll(
      `button[data-ship-id="${shipId}"]`
    );
    buttons.forEach((cell) => {
      cell.style.opacity = '1';
    });
  },
  handleDragOver(event) {
    event.preventDefault(); // Allow dropping
    const targetCell = event.target;
    const row = targetCell.getAttribute('data-row');
    const column = targetCell.getAttribute('data-col');

    const dataString = event.dataTransfer.getData('text/plain');
    let shipId, orientation;

    try {
      const data = JSON.parse(dataString);
      shipId = data.shipId;
      orientation = data.orientation;
    } catch {
      shipId = currentDraggedShipId;
      orientation = currentDragOrientation;
    }

    if (shipId === 'ship-0')
      createUI.highlightCells(5, row, column, orientation);

    if (shipId === 'ship-1')
      createUI.highlightCells(4, row, column, orientation);

    if (shipId === 'ship-2' || shipId === 'ship-3')
      createUI.highlightCells(3, row, column, orientation);

    if (shipId === 'ship-4')
      createUI.highlightCells(2, row, column, orientation);
  },
  highlightCells(length, row, column, orientation) {
    for (let i = 0; i < length; i++) {
      const newRow =
        orientation === 'vertical' ? parseInt(row) - i : parseInt(row);
      const newCol =
        orientation === 'horizontal' ? parseInt(column) + i : parseInt(column);
      const cell = document.querySelector(
        `.grid-cell[data-row="${newRow}"][data-col="${newCol}"]`
      );
      if (cell) {
        cell.classList.add('highlight');
      }
    }
  },
  handleDragLeave() {
    // Remove the highlight class from all cells
    document.querySelectorAll('.grid-cell.highlight').forEach((cell) => {
      cell.classList.remove('highlight');
    });
  },
  handleDrop(event, player) {
    event.preventDefault();
    let coordinates = [];

    const dataString = event.dataTransfer.getData('text/plain');
    let shipId, orientation;

    try {
      const data = JSON.parse(dataString);
      shipId = data.shipId;
      orientation = data.orientation;
    } catch {
      shipId = currentDraggedShipId;
      orientation = currentDragOrientation;
    }
    if (!dataString) return;

    const shipLengths = {
      'ship-0': 5,
      'ship-1': 4,
      'ship-2': 3,
      'ship-3': 3,
      'ship-4': 2,
    };
    const shipLength = shipLengths[shipId];
    if (!shipLength) return;

    const targetCell = event.target;
    const row = parseInt(targetCell.dataset.row);
    const col = parseInt(targetCell.dataset.col);

    if (orientation === 'vertical' && row - (shipLength - 1) < 0) {
      console.log('Ship does not fit vertically from this drop point.');
      createUI.handleDragLeave();
      return;
    }
    if (orientation === 'horizontal' && col + (shipLength - 1) > 9) {
      console.log('Ship does not fit horizontally from this drop point.');
      createUI.handleDragLeave();
      return;
    }

    let validPlacement = true;
    for (let i = 0; i < shipLength; i++) {
      let currentRow = orientation === 'vertical' ? row - i : row;
      let currentCol = orientation === 'horizontal' ? col + i : col;

      const cell = document.querySelector(
        `.grid-cell[data-row="${currentRow}"][data-col="${currentCol}"]`
      );
      if (!cell || cell.classList.contains('ship')) {
        validPlacement = false;
        break;
      }
    }

    if (!validPlacement) {
      createUI.handleDragLeave();
      return;
    }

    for (let i = 0; i < shipLength; i++) {
      let currentRow = orientation === 'vertical' ? row - i : row;
      let currentCol = orientation === 'horizontal' ? col + i : col;

      const cell = document.querySelector(
        `.grid-cell[data-row="${currentRow}"][data-col="${currentCol}"]`
      );
      if (cell) {
        cell.classList.add('ship');
        coordinates.push([currentRow, currentCol]);
      }
    }

    console.log(
      `Ship ${shipId} placed starting at (${row}, ${col}) ${orientation} with length ${shipLength}.`
    );

    const dragShipElement = document.querySelectorAll(
      `.draggable-ship[data-ship-id="${shipId}"]`
    );
    if (dragShipElement) {
      dragShipElement.forEach((element) => {
        for (let i = element.attributes.length - 1; i >= 0; i--) {
          const attr = element.attributes[i];
          if (attr.name !== 'drag-cell') {
            element.removeAttribute(attr.name);
          }
        }
      });
    }
    player.gameboard.placeShip(coordinates);
    createUI.handleDragLeave(event);
    this.addStartGameButton(player);
    currentDraggedShipId = null;
  },
};
export default createUI;
