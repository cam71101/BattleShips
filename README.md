<p align="center">
  <img src="https://res.cloudinary.com/dndp8567v/image/upload/v1608670264/logoCropped_60360d1e53.png">
</p>

<p align="center">
<img src="https://img.shields.io/badge/madeby-cam71101-green" />
<img src="https://img.shields.io/github/languages/top/cam71101/weather-app" />
<img src="https://img.shields.io/github/last-commit/cam71101/weather-app" />
<a href="https://twitter.com/d_fisherWebDev" alt="twitter">
<img src="https://img.shields.io/twitter/follow/d_fisherWebDev?style=social" />
</a>
</p>

<h2 align="center"><a  href="https://cam71101.github.io/weather-app/">Live Demo</a></h2>

## Description

<p align="center">
<img src="https://res.cloudinary.com/dndp8567v/image/upload/v1608669853/BattleShipsDesktop_3268476fcf.gif" />
</p>

<h2 align="center"><a  href="https://d-fisher.com/battleships">CLICK HERE FOR FULL PROJECT BREAKDOWN</a></h2>

This project is a recreation of the famous Battle Ships board game.

Drag and drop your ships, double click to rotate and get ready for battle!

## How to play

- Drag and drop the ships onto the grid. Rotate the ships by double-clicking on the end of the ship that wiggles (doesn't work on mobile)
- Alternatively, you can use the auto place button.
- Once the game start, click on the squares to attack the enemy ships.
- Winner is the first one to sink all of the enemies ships

## Tecnologies Used

- Javascript ES6
- HTML
- CSS

## Main Features

> Drag and drop

> Double click to rotate ships

> Random auto-place for mobile

> Smart AI

## Technical details

A snippet of code that's used for generating random coordinates for the AI. Full script <a href="https://github.com/cam71101/BattleShips/blob/master/src/js/randomShipPlacement.js"> here </a>.

```javascript
const makeCoordinates = (shipLength) => {
    let randomNumber = generaterRandomNumber();
    let randomLetter = generateRandomLetter();

    let newCoords = [randomLetter + randomNumber];
    const randomChoice = Math.random() < 0.5 ? 'letter' : 'number';

    if (randomChoice === 'number') {
      newCoords.length = 0;
      let number = randomNumber;
      for (let i = 0; i < shipLength + 1; i++) {
        randomNumber < 6 ? ++number : --number;
        newCoords.push(number);
      }
      newCoords.sort((a, b) => a - b);
      newCoords = newCoords.map((value) => {
        return randomLetter + value;
      });
    } else {
      let letter = randomLetter;
      for (let i = 0; i < shipLength; i++) {
        if (
          !(
            randomLetter == 'g' ||
            randomLetter == 'h' ||
            randomLetter == 'i' ||
            randomLetter == 'j'
          )
        ) {
          letter = nextChar(letter);
        } else {
          letter = prevChar(letter);
        }
        newCoords.push(letter + randomNumber);
      }
    }
```

Example of testing with Jest. Full script <a href="https://github.com/cam71101/BattleShips/blob/master/src/js/functions.test.js"> here </a>.

```javascript
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
```

## Responsive Design

<p align="center">
<img src="https://res.cloudinary.com/dndp8567v/image/upload/v1608671908/BattleShipsResponsive_1efa57c5ed.gif" />
</p>

## Installation

Clone this project locally and run:

```bash
npm install
```

## Tests

To run the tests use:

```bash
npm run test
```
