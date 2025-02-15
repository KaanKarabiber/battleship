import { Ship } from './ship.js';

describe('Ship', () => {
  let ship;
  beforeEach(() => {
    ship = new Ship(3);
  });
  test('should have length', () => {
    expect(ship.length).toBe(3);
  });
  test('should not be sunk initially', () => {
    expect(ship.isSunk()).toBe(false);
  });
  test('should register a hit', () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });
  test('should be sunk when hits are equal to length', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
