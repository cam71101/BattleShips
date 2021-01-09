const RandomShipPlacement = (ships) => {
  const theShips = ships.ships;

  const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);
  const prevChar = (c) => String.fromCharCode(c.charCodeAt(0) - 1);

  const compareComputerCoords = (coords) => {
    return Object.values(ships.ships).some((value) => {
      return value.placement.some((e) => {
        return e === coords;
      });
    });
  };

  const generateRandomCoordinates = () => {
    Object.values(ships.ships).forEach((value) => {
      const shipLength = value.length;
      value.placement = randomCoords(shipLength);
    });
  };

  const generaterRandomNumber = () => Math.floor(Math.random() * (11 - 1) + 1);
  const generateRandomLetter = () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 10));


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

    let surroundingCoords = [
      ...newCoords,
      ...generateSurroundingCoords(
        newCoords[0].substring(0, 1),
        newCoords[0].substring(1, 3)
      ),

      ...generateSurroundingCoords(
        newCoords[shipLength].substring(0, 1),
        newCoords[shipLength].substring(1, 3)
      ),
    ];
    return [surroundingCoords, newCoords];
  };

  const generateSurroundingCoords = (randomLetter, randomNumber) => {
    const surroundingCoords = [];
    randomNumber = parseInt(randomNumber);
    const plusRandomNumber = randomNumber + 1;
    surroundingCoords.push(randomLetter + plusRandomNumber);
    let minusRandomNumber = 1;
    if (randomNumber !== 1) {
      minusRandomNumber = randomNumber - 1;
    }
    surroundingCoords.push(randomLetter + minusRandomNumber);
    const nextRandomLetter = nextChar(randomLetter);
    surroundingCoords.push(nextRandomLetter + randomNumber);
    const prevRandomLetter = prevChar(randomLetter);
    surroundingCoords.push(prevRandomLetter + randomNumber);
    surroundingCoords.push(nextRandomLetter + plusRandomNumber);
    surroundingCoords.push(prevRandomLetter + plusRandomNumber);
    surroundingCoords.push(nextRandomLetter + minusRandomNumber);
    surroundingCoords.push(prevRandomLetter + minusRandomNumber);
    return surroundingCoords;
  };

  const randomCoords = (shipLength) => {
    let [surroundingCoords, newCoords] = makeCoordinates(shipLength);

    if (shipLength === 1 || shipLength === 2) {
      const sortCoords = [...surroundingCoords];
      sortCoords.sort();
      const sortNewCoords = [newCoords];
      sortNewCoords.sort();
    }

    while (surroundingCoords.some((value) => compareComputerCoords(value))) {
      [surroundingCoords, newCoords] = makeCoordinates(shipLength);
    }

    !newCoords[1].includes(newCoords[0].substring(0, 1)) && newCoords.sort();
    return newCoords;
  };

  return {
    prevChar,
    nextChar,
    generateRandomCoordinates,
    ...ships,
  };
};

export default RandomShipPlacement;
