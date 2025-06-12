import './styles.css';
import { Game } from './game.js';
import createUI from './createUI.js';

// const modal = document.querySelector('#name-modal');
// const submitButton = document.querySelector('#submit-name');
// const inputField = document.querySelector('#player-name');
// function openModal() {
//   modal.style.display = 'block';
// }

// function closeModal() {
//   modal.style.display = 'none';
// }

// openModal();
// submitButton.addEventListener('click', () => {
//   const playerName = inputField.value.trim();
//   const game = new Game();
//   game.startGame(game, playerName);
//   createUI.createDragGrid();
//   closeModal();
// });

const game = new Game();
game.startGame(game, 'Player 1');
createUI.createDragGrid();
createUI.disableButtons();
