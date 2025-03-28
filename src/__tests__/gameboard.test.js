import { Gameboard } from '../gameboard.js';
import { Ship } from '../ship.js';

describe('Initial Gameboard', () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });
  test('should have 10x10 board', () => {
    expect(gameboard.board).toBeDefined();
    expect(gameboard.board.length).toBe(10);
    gameboard.board.forEach((row) => {
      expect(row.length).toBe(10);
    });
  });
  test('values should be null', () => {
    gameboard.board.forEach((row) => {
      row.forEach((element) => {
        expect(element).toBe(null);
      });
    });
  });
  test('can it place a ship', () => {
    gameboard.placeShip([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(gameboard.board[0][0]).toBeInstanceOf(Ship);
    expect(gameboard.board[0][1]).toBeInstanceOf(Ship);
    expect(gameboard.board[0][2]).toBeInstanceOf(Ship);
    expect(gameboard.ships.length).toBe(1);
  });
});
describe('Gameboard functionality', () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    gameboard.placeShip([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  test('can it receive attack', () => {
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 5]);
    expect(gameboard.board[0][0].hits).toBe(1);
    expect(gameboard.receivedShots.length).toBe(2);
  });
  test('can it detect all ships sunk', () => {
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);
    gameboard.receiveAttack([0, 2]);
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
test('cant place a ship where there is already a ship', () => {
  let gameboard = new Gameboard();
  gameboard.placeShip([[0, 0]]);
  gameboard.placeShip([[0, 0]]);
  expect(gameboard.ships.length).toBe(1);
});
