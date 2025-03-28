import { Game } from '../game.js';
import { Player } from '../player.js';
import { ComputerPlayer } from '../computerPlayer.js';

describe('Game class', () => {
  let game;

  beforeEach(() => {
    game = new Game();
    game.player1.opponent = game.player2;
    game.player2.opponent = game.player1;
  });

  test('should initialize with Player 1 and Computer as players', () => {
    expect(game.player1).toBeInstanceOf(Player);
    expect(game.player2).toBeInstanceOf(ComputerPlayer);
    expect(game.currentPlayer).toBe(game.player1);
  });

  test('should switch turns between players', () => {
    const initialPlayer = game.currentPlayer;
    game.switchTurn();
    expect(game.currentPlayer).not.toBe(initialPlayer);
  });

  test('should perform a turn and make an attack', () => {
    const attackSpy = jest.spyOn(game.currentPlayer, 'attack');
    game.playTurn([0, 0]);
    expect(attackSpy).toHaveBeenCalledWith([0, 0]);
  });

  test('should check if the game is over', () => {
    game.player1.placeShip([[0, 5]]);
    game.player2.placeShip();
    const gameOver = game.isGameOver();
    expect(gameOver).toBe(false);
  });
});
