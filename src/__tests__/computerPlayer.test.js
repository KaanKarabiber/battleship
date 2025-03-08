import { ComputerPlayer } from '../computerPlayer.js';
import { Player } from '../player.js';

describe('ComputerPlayer class', () => {
  let computerPlayer;

  beforeEach(() => {
    computerPlayer = new ComputerPlayer('Computer');
  });

  test('should inherit from Player', () => {
    expect(computerPlayer).toBeInstanceOf(Player);
  });

  test('should generate random coordinates for placing ships', () => {
    const coordinates = computerPlayer.generateRandomCoordinates();

    expect(Array.isArray(coordinates)).toBe(true);

    expect(coordinates.length).toBeGreaterThanOrEqual(2);
    expect(coordinates.length).toBeLessThanOrEqual(4);

    coordinates.forEach((coord) => {
      expect(coord).toHaveLength(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  test('should be able to place a ship at random coordinates', () => {
    const coordinates = computerPlayer.generateRandomCoordinates();
    const ship = computerPlayer.placeShip(coordinates);
    expect(ship).toBeDefined();
  });

  test('should attack randomly', () => {
    const attackSpy = jest.spyOn(computerPlayer, 'attack');
    computerPlayer.attack();
    expect(attackSpy).toHaveBeenCalled();
  });
});
