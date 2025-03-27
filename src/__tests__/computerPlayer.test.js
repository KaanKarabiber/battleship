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

  test('should generate valid random coordinates for all ship lengths', () => {
    computerPlayer.shipLengths.forEach((shipLength) => {
      const coordinates = computerPlayer.generateRandomCoordinates(shipLength);

      // Check that coordinates is an array
      expect(Array.isArray(coordinates)).toBe(true);

      // Ensure the correct number of coordinates is generated
      expect(coordinates.length).toBe(shipLength);

      coordinates.forEach(([x, y]) => {
        expect(typeof x).toBe('number');
        expect(typeof y).toBe('number');
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(10);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThan(10);
      });

      expect(computerPlayer.gameboard.isValidPlacement(coordinates)).toBe(true);
    });
  });

  test('should be able to place a ship at random coordinates', () => {
    // Call placeShip, which internally generates random coordinates
    computerPlayer.placeShip();

    // Check if a ship is placed on the gameboard
    expect(computerPlayer.gameboard.ships.length).toBeGreaterThan(0); // Ensure at least one ship is placed
  });

  test('should attack randomly', () => {
    const attackSpy = jest.spyOn(computerPlayer, 'attack');
    computerPlayer.attack();
    expect(attackSpy).toHaveBeenCalled();
  });
});
