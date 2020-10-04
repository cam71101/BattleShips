import Gameboard from './gameboard';
import Player from './player';
import Ship from './ship';
import Render from './render';
import RandomShipPlacement from './randomShipPlacement';
import RandomCoordinates from './randomCoordinates';
import { pipe } from 'ramda';

const Game = (function () {
  const player1 = pipe(
    Ship,
    RandomShipPlacement,
    Gameboard,
    RandomCoordinates
  )();

  const computer = pipe(Ship, RandomShipPlacement, Gameboard)();

  computer.generateRandomCoordinates();

  const player = Player(player1, computer);

  const render = Render(player1, computer, player);

  const startBtn = document.querySelector('#start');
  const restartBtn = document.querySelector('#restart');
  const autoPlaceBtn = document.querySelector('#autoPlaceBtn');

  startBtn.addEventListener('click', render.startGame);
  restartBtn.addEventListener('click', render.restartGame);
  autoPlaceBtn.addEventListener('click', render.autoPlace);
})();
