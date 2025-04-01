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
    document.addEventListener('keydown', createUI.handleRightClickDuringDrag);
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
    });
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
  createDragGrid() {
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
          cell.dataset.shipId = shipId; // Assign the same ID for all parts of this ship
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
    let draggedShip = event.target;
    const shipId = draggedShip.getAttribute('data-ship-id');
    currentDraggedShipId = shipId;
  },
  handleDragEnd(event) {
    event.target.style.opacity = '1';
  },
  handleDragOver(event) {
    event.preventDefault(); // Allow dropping
    const targetCell = event.target;
    const row = targetCell.getAttribute('data-row');
    const column = targetCell.getAttribute('data-col');
    console.log(row, column);

    // Use the global variable for the ship ID
    const shipId = currentDraggedShipId;

    if (shipId === 'ship-0') createUI.highlightCells(5, row, column);

    if (shipId === 'ship-1') createUI.highlightCells(4, row, column);

    if (shipId === 'ship-2' || shipId === 'ship-3')
      createUI.highlightCells(3, row, column);

    if (shipId === 'ship-4') createUI.highlightCells(2, row, column);
  },
  highlightCells(length, row, column) {
    for (let index = 0; index < length; index++) {
      const newRow = parseInt(row) - index; // Calculate new row index
      const cell = document.querySelector(
        `.grid-cell[data-row="${newRow}"][data-col="${column}"]`
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
  handleRightClickDuringDrag(event) {
    if (
      (event.key === 'r' || event.key === 'R') &&
      currentDraggedShipId !== null
    ) {
      event.preventDefault();
      currentDragOrientation =
        currentDragOrientation === 'vertical' ? 'horizontal' : 'vertical';
    }
  },
  handleDrop(event, player) {
    event.preventDefault();
    let coordinates = [];
    // Get the ship ID from dataTransfer or fallback to the global variable
    const shipId =
      event.dataTransfer.getData('text/plain') || currentDraggedShipId;
    if (!shipId) return;

    // Map ship IDs to their lengths
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

    // Check that the ship fits within the grid (vertical placement upward)
    if (row - (shipLength - 1) < 0) {
      console.log('Ship does not fit vertically from this drop point.');
      return;
    }

    // Check for overlapping ships: ensure each cell in the intended placement is free
    let validPlacement = true;
    for (let i = 0; i < shipLength; i++) {
      const currentRow = row - i;
      const cell = document.querySelector(
        `.grid-cell[data-row="${currentRow}"][data-col="${col}"]`
      );
      if (!cell || cell.classList.contains('ship')) {
        validPlacement = false;
        break;
      }
    }

    if (!validPlacement) {
      return;
    }
    // Mark each cell as having the ship placed
    for (let i = 0; i < shipLength; i++) {
      const currentRow = row - i;
      const cell = document.querySelector(
        `.grid-cell[data-row="${currentRow}"][data-col="${col}"]`
      );
      if (cell) {
        cell.classList.add('ship');
        coordinates.push([currentRow, col]);
      }
    }

    console.log(
      `Ship ${shipId} placed starting at (${row}, ${col}) vertically with length ${shipLength}.`
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
    currentDraggedShipId = null;
  },
};
export default createUI;
