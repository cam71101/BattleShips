import Gameboard from './gameboard';
import Ship from './ship';
import RandomShipPlacement from './randomShipPlacement';
import RandomCoordinates from './randomCoordinates';
import { pipe } from 'ramda';

const player = pipe(Ship, RandomShipPlacement, Gameboard, RandomCoordinates)();

afterEach(() => {
  player.clearCoords();
  player.clearShipPlacement();
  player.placeShip('submarine', ['a1', 'a4', 'a3']);
  player.placeShip('carrier', ['e1', 'e2', 'e3']);
  player.placeShip('battleship', ['d1', 'd2', 'd3']);
  player.placeShip('cruiser', ['c1', 'c2', 'c3']);
  player.placeShip('destroyer', ['b1', 'b2', 'b3']);
});

test('Player has missed shot', () => {
  player.receiveAttack('a2');
  expect(player.coords).toEqual(['a2']);
});

test('Player is hit', () => {
  player.receiveAttack('a1', 'player1');
  expect(player.ships.submarine.hit).toEqual(1);
});

test('Player ship is sunk', () => {
  player.ships.submarine.hit = 3;
  player.isSunk();
  expect(player.ships.submarine.sunk).toEqual(true);
});

test('Player ship is not sunk', () => {
  player.ships.submarine.hit = 2;
  player.isSunk();
  expect(player.ships.submarine.sunk).toEqual(false);
});

test('Place ship', () => {
  player.clearShipPlacement();
  player.addPlayerShipCoords('submarine', 1, 'a', 'submarine');
  expect(player.ships.submarine.placement).toEqual(['a1', 'a2', 'a3']);
});

test('Is game finished, return true', () => {
  player.ships.submarine.hit = 3;
  player.ships.carrier.hit = 5;
  player.ships.battleship.hit = 4;
  player.ships.cruiser.hit = 3;
  player.ships.destroyer.hit = 2;
  player.isSunk();
  expect(player.isGameFinished()).toEqual(true);
});

test('Is game finished, return false', () => {
  player.ships.submarine.hit = 3;
  player.ships.carrier.hit = 5;
  player.ships.battleship.hit = 4;
  player.isSunk();
  expect(player.isGameFinished()).toEqual(false);
});
