import { Player } from '../player.js';
import { Gameboard } from '../gameboard.js';

describe('Player class', () => {
  let player;

  beforeEach(() => {
    player = new Player('Player 1');
  });

  test('should have a name and a gameboard', () => {
    expect(player.name).toBe('Player 1');
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test('should be able to set an opponent', () => {
    const opponent = new Player('Player 2');
    player.setOpponent(opponent);
    expect(player.opponent).toBe(opponent);
  });

  test('should be able to place a ship', () => {
    const coordinates = [
      [0, 0],
      [0, 1],
    ];
    const ship = player.placeShip(coordinates);
    expect(ship).toBeDefined();
  });

  test('should be able to attack an opponent', () => {
    const opponent = new Player('Player 2');
    player.setOpponent(opponent);
    const attackSpy = jest.spyOn(opponent.gameboard, 'receiveAttack');
    player.attack([0, 0]);
    expect(attackSpy).toHaveBeenCalledWith([0, 0]);
  });

  test('should check if the player has ships left', () => {
    player.placeShip([[0, 0]]);
    expect(player.hasShipsLeft()).toBe(true);
  });
});
