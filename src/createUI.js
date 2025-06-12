let currentDraggedShipId = null;
let currentDragOrientation = 'vertical';
const createUI = {
  createDivs() {
    const gridWrapper = document.createElement('div');
    gridWrapper.classList.add('grid-wrapper');

    const boardWrapperPlayer = document.createElement('div');
    boardWrapperPlayer.classList.add('board-wrapper', 'player-board-div');

    const boardWrapperComputer = document.createElement('div');
    boardWrapperComputer.classList.add('board-wrapper', 'computer-board-div');

    const buttonDivs = document.createElement('div');
    buttonDivs.classList.add('utility-button-div');

    const player1Grid = document.createElement('div');
    player1Grid.classList.add('board');
    player1Grid.id = 'player-1-grid';

    const player2Grid = document.createElement('div');
    player2Grid.classList.add('board');
    player2Grid.id = 'player-2-grid';

    const dragWrapper = document.createElement('div');
    dragWrapper.classList.add('drag-wrapper');

    const content = document.querySelector('.content');
    boardWrapperPlayer.append(player1Grid);
    boardWrapperComputer.append(player2Grid);
    gridWrapper.append(boardWrapperPlayer, boardWrapperComputer);
    content.append(dragWrapper, gridWrapper, buttonDivs);
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
            if (game.isGameOver())
              this.showGameOverMessage(game.currentPlayer.name);
            else createUI.enableButtons();
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
  addShipDataAttributes(ships) {
    const shipCells = document.querySelectorAll('#player-1-grid .ship');
    shipCells.forEach((cell) => {
      delete cell.dataset.shipId;
      delete cell.dataset.orientation;
      cell.classList.remove('ship');
      cell.removeAttribute('draggable');
    });
    ships.forEach((ship) => {
      ship.coordinates.forEach(([x, y]) => {
        const cell = document.querySelector(
          `[data-row="${x}"][data-col="${y}"]`
        );
        if (cell) {
          cell.dataset.shipId = ship.id;
          cell.dataset.orientation = ship.orientation;
          cell.classList.add('ship');
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
  removeStartGameButton() {
    if (document.querySelector('.start-game-button'))
      document.querySelector('.start-game-button').remove();
  },
  removeShipsRemaining() {
    let shipsCountDisplays = document.querySelectorAll('.ships-remaining');
    if (shipsCountDisplays) {
      shipsCountDisplays.forEach((display) => {
        display.remove();
      });
    }
  },
  addUtilityButtons(game) {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'RESTART';
    restartButton.classList.add('utility-button', 'wrapped-button');
    restartButton.addEventListener('click', () => {
      game.restartGame(game);
      this.removeStartGameButton();
      this.removeShipsRemaining();
      this.removeExistingMessage();
      document.querySelectorAll('#player-1-grid .grid-cell').forEach((cell) => {
        cell.removeAttribute('data-ship-id');
        cell.removeAttribute('data-orientation');
        cell.removeAttribute('draggable');
        cell.style.removeProperty('opacity');
      });
      randomizeButton.disabled = false;
      orientationButton.textContent = 'VERTICAL';
      orientationButton.disabled = false;
    });
    const randomizeButton = document.createElement('button');
    randomizeButton.classList.add(
      'randomize-button',
      'utility-button',
      'wrapped-button'
    );
    randomizeButton.textContent = 'RANDOMIZE';

    randomizeButton.addEventListener('click', () => {
      game.player1.gameboard.resetBoard();
      this.removeStartGameButton();
      game.player1.placeShipsRandomly();
      this.addShipDataAttributes(game.player1.gameboard.ships);
      let draggableShips = document.querySelectorAll('.draggable-ship');
      draggableShips.forEach((ship) => {
        ship.classList.remove('draggable-ship');
        ship.removeAttribute('draggable');
      });
      this.addDragToPlayerBoardShips();
      this.addStartGameButton();
    });
    const orientationButton = document.createElement('button');
    orientationButton.textContent = 'VERTICAL';
    orientationButton.classList.add('orientation-button', 'utility-button');
    orientationButton.addEventListener('click', () => {
      const newOrientation =
        orientationButton.textContent === 'VERTICAL'
          ? 'horizontal'
          : 'vertical';

      // Update the button label
      orientationButton.textContent = newOrientation.toUpperCase();
      const allShipCells = [
        ...document.querySelectorAll('.drag-grid .draggable-ship'),
        ...document.querySelectorAll('.grid-cell.ship'),
      ];
      allShipCells.forEach((cell) => {
        cell.dataset.orientation = newOrientation;
      });

      currentDragOrientation = newOrientation;

      console.log(`All ships set to ${newOrientation}`);
    });
    const buttonDiv = document.querySelector('.utility-button-div');
    const dragDiv = document.querySelector('.drag-wrapper');

    buttonDiv.append(randomizeButton, restartButton);
    dragDiv.append(orientationButton);
  },
  addStartGameButton(player) {
    const startGame = document.createElement('button');
    startGame.classList.add('start-game-button');

    const gridWrapper = document.querySelector('.grid-wrapper');
    const secondChild = gridWrapper.children[1];
    if (!player || player?.areAllShipsPlaced()) {
      gridWrapper.insertBefore(startGame, secondChild); // adds in the middle
    }

    startGame.addEventListener('click', () => {
      this.enableButtons();
      document.querySelectorAll('#player-1-grid .grid-cell').forEach((cell) => {
        cell.removeAttribute('draggable');
      });
      document.querySelector('.randomize-button').disabled = true;
      document.querySelector('.orientation-button').disabled = true;
      this.addShipsRemainingDisplay();
      startGame.remove();
    });
  },
  addShipsRemainingDisplay() {
    if (document.querySelector('.ships-remaining')) return;

    const player1Text = document.createElement('div');
    player1Text.classList.add('ships-player1', 'ships-remaining');
    player1Text.textContent = 'Player 1 Ships Remaining: 5';

    const player2Text = document.createElement('div');
    player2Text.classList.add('ships-player2', 'ships-remaining');
    player2Text.textContent = 'Player 2 Ships Remaining: 5';

    const playerBoardDiv = document.querySelector('.player-board-div');
    const computerBoardDiv = document.querySelector('.computer-board-div');
    playerBoardDiv.append(player1Text);
    computerBoardDiv.append(player2Text);
  },
  updateShipsRemaining(game) {
    const p1Ships = game.player1.gameboard.ships.filter(
      (ship) => !ship.isSunk()
    ).length;
    const p2Ships = game.player2.gameboard.ships.filter(
      (ship) => !ship.isSunk()
    ).length;
    const player1Text = document.querySelector('.ships-player1');
    const player2Text = document.querySelector('.ships-player2');

    if (player1Text)
      player1Text.textContent = `Player 1 Ships Remaining: ${p1Ships}`;
    if (player2Text)
      player2Text.textContent = `Computer Ships Remaining: ${p2Ships}`;
  },
  createDragGrid() {
    if (document.querySelector('.drag-grid'))
      document.querySelector('.drag-grid').remove();
    const content = document.querySelector('.content');
    const dragWrapper = document.querySelector('.drag-wrapper');
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
    dragWrapper.append(dragGrid);
    content.prepend(dragWrapper);
  },
  handleDragStart(event) {
    // hide dragged cell
    const img = new Image();
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/58HAokBAtgDTF8AAAAASUVORK5CYII='; // 1x1 transparent pixel
    event.dataTransfer.setDragImage(img, 0, 0);
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
    let changePositionOnBoard = false;
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
    const oldShipCells = document.querySelectorAll(
      `.grid-cell.ship[data-ship-id="${shipId}"]`
    );
    let oldCoordinates = [];
    oldShipCells.forEach((cell) => {
      cell.classList.remove('ship');
      cell.removeAttribute('data-ship-id');
      cell.removeAttribute('data-orientation');
      cell.removeAttribute('draggable');
      cell.style.removeProperty('opacity');
      changePositionOnBoard = true;

      oldCoordinates.push([
        parseInt(cell.dataset.row),
        parseInt(cell.dataset.col),
      ]);
    });
    player.gameboard.removeShip(oldCoordinates);
    for (let i = 0; i < shipLength; i++) {
      let currentRow = orientation === 'vertical' ? row - i : row;
      let currentCol = orientation === 'horizontal' ? col + i : col;

      const cell = document.querySelector(
        `.grid-cell[data-row="${currentRow}"][data-col="${currentCol}"]`
      );
      if (cell) {
        cell.classList.add('ship');
        cell.dataset.shipId = shipId;
        cell.dataset.orientation = orientation;
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
        // this removes all other classes except drag-cells
        element.className = 'drag-cells';

        for (let i = element.attributes.length - 1; i >= 0; i--) {
          const attr = element.attributes[i];

          if (attr.name !== 'class') {
            element.removeAttribute(attr.name);
          }
        }
      });
    }
    player.gameboard.placeShip(coordinates, shipId, orientation);
    createUI.handleDragLeave(event);
    if (!changePositionOnBoard) this.addStartGameButton(player);
    currentDraggedShipId = null;
    this.addDragToPlayerBoardShips();
  },
  addDragToPlayerBoardShips() {
    document.querySelectorAll('.ship').forEach((ship) => {
      ship.setAttribute('draggable', 'true');
      ship.addEventListener('dragstart', createUI.handleDragStart);
      ship.addEventListener('dragend', createUI.handleDragEnd);
    });
  },
  showGameOverMessage(winnerName) {
    this.removeExistingMessage();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('game-over-message');
    messageDiv.textContent = `${winnerName} has won the game!`;

    document.body.appendChild(messageDiv);
  },
  removeExistingMessage() {
    const existingMessage = document.querySelector('.game-over-message');
    if (existingMessage) existingMessage.remove();
  },
};
export default createUI;
