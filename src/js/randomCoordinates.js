const RandomCoordinates = (Gameboard) => {
  const hitCoords = [];
  let hitStatus = null;
  let attemptedHits = [];
  let skipRandomCoord = false;
  let prevCoords = null;
  let surroundingCoords = [];
  let direction = null;
  let missedHit = 0;
  let shipHit = null;

  const nextChar = Gameboard.nextChar;
  const prevChar = Gameboard.prevChar;

  const generateSquareRandomCoordinate = (letter, maxNumber) => {
    const randomNumber = Math.floor(Math.random() * 5 + maxNumber);
    const randomLetter = String.fromCharCode(
      letter + Math.floor(Math.random() * 5)
    );
    return randomLetter + randomNumber;
  };

  const generateSurroundingCoords = (randomLetter, randomNumber) => {
    const surroundingCoords = [];
    randomNumber = parseInt(randomNumber);

    if (randomNumber !== 1) {
      const minusRandomNumber = randomNumber - 1;
      surroundingCoords.push(randomLetter + minusRandomNumber);
    }

    if (randomNumber !== 10) {
      const plusRandomNumber = randomNumber + 1;
      surroundingCoords.push(randomLetter + plusRandomNumber);
    }

    if (randomLetter !== 'a') {
      const prevRandomLetter = prevChar(randomLetter);
      surroundingCoords.push(prevRandomLetter + randomNumber);
    }

    if (randomLetter !== 'j') {
      const nextRandomLetter = nextChar(randomLetter);
      surroundingCoords.push(nextRandomLetter + randomNumber);
    }
    console.log(surroundingCoords);
    return surroundingCoords;
  };

  const checkCoordinates = (coordsRef, coords) => {
    return coordsRef.some((coordinate) => {
      return coordinate.substring(0, 3) === coords;
    });
  };

  const updateCoords = (coords) => {
    coords = surroundingCoords[0];
    attemptedHits.push(coords);
    surroundingCoords.shift();
    return coords;
  };

  const nextNumber = (coordsNumber) => {
    coordsNumber = coordsNumber + 1;
    const string = coordsNumber.toString();
    const coords = hitCoords[0].substring(0, 1) + string;
    return coords;
  };

  const prevNumber = (coordsNumber) => {
    coordsNumber = coordsNumber - 1;
    const string = coordsNumber.toString();
    const coords = hitCoords[0].substring(0, 1) + string;
    return coords;
  };

  const prevCharacter = () => {
    return (
      prevChar(prevCoords[0].substring(0, 1)) + hitCoords[0].substring(1, 3)
    );
  };

  const nextCharacter = () => {
    return (
      nextChar(prevCoords[0].substring(0, 1)) + hitCoords[0].substring(1, 3)
    );
  };

  const resetSearch = () => {
    skipRandomCoord = false;
    hitStatus = null;
    shipHit = null;
    missedHit = 0;
    surroundingCoords.length = 0;
    hitCoords.length = 0;
  };

  const oppositeDirectionCoords = () => {
    let coordsNumber = parseInt(hitCoords[0].substring(1, 3));
    let coords;
    if (direction === 'prev numb') {
      coords = nextNumber(coordsNumber);
    } else if (direction === 'next numb') {
      coords = prevNumber(coordsNumber);
    } else if (direction === 'prev char') {
      coords =
        nextChar(hitCoords[0].substring(0, 1)) + hitCoords[0].substring(1, 3);
    } else {
      coords =
        prevChar(hitCoords[0].substring(0, 1)) + hitCoords[0].substring(1, 3);
    }
    return coords;
  };

  const checkCoordsInsideGrid = (coords) => {
    const availableCoords = generateCoords();
    const coordsCheck = availableCoords.some((value) => value === coords);
    return coordsCheck;
  };

  const generateRandomCoords = (ships, isHit) => {
    let coordsRef = [...Gameboard.coords];
    let coords = '';

    if (hitStatus === 'first hit') {
      const coordLetter = hitCoords[0].substring(0, 1);
      const coordNumber = hitCoords[0].substring(1, 3);

      surroundingCoords = generateSurroundingCoords(coordLetter, coordNumber);
      const cooordinateCheck = true;
      coords = updateCoords(coords);
      while (checkCoordinates(coordsRef, coords)) {
        coords = updateCoords(coords);
      }

      skipRandomCoord = true;
      hitStatus = 1;
      prevCoords = coords;
    } else if (typeof hitStatus == 'number') {
      isHit.isHit === true && ++hitStatus;
      if (hitStatus < shipHit) {
        if (!isHit.isHit) {
          if (hitStatus < 2) {
            coords = updateCoords(coords);
            while (checkCoordinates(coordsRef, coords)) {
              coords = updateCoords(coords);
            }
          } else {
            ++missedHit;
            if (missedHit === 1) {
              coords = oppositeDirectionCoords();
              if (checkCoordinates(coordsRef, coords)) {
                resetSearch();
              }
            } else {
              resetSearch();
            }
          }
          const coordsCheck = checkCoordsInsideGrid(coords);
          coordsCheck ? (prevCoords = coords) : (skipRandomCoord = false);
        } else {
          hitCoords.push(prevCoords);
          let coordsNumber = parseInt(prevCoords.substring(1, 3));
          if (
            hitCoords[0].substring(0, 1).includes(prevCoords.substring(0, 1))
          ) {
            const firstHitNumber = parseInt(hitCoords[0].substring(1, 3));
            if (firstHitNumber > coordsNumber) {
              coords = prevNumber(coordsNumber);
              direction = 'prev numb';
            } else {
              coords = nextNumber(coordsNumber);
              direction = 'next numb';
            }
          } else {
            if (hitCoords[0].substring(0, 1) > prevCoords.substring(0, 1)) {
              coords = prevCharacter();
              direction = 'prev char';
            } else {
              coords = nextCharacter();
              direction = 'next char';
            }
          }
          if (missedHit === 0) {
            if (
              checkCoordinates(coordsRef, coords) ||
              !checkCoordsInsideGrid(coords)
            ) {
              coords = oppositeDirectionCoords();
              missedHit = 1;
            }
          }
          if (checkCoordinates(coordsRef, coords)) {
            resetSearch();
          } else {
            const coordsCheck = checkCoordsInsideGrid(coords);
            coordsCheck ? (prevCoords = coords) : (skipRandomCoord = false);
          }
        }
      } else {
        hitCoords.push(prevCoords);
        resetSearch();
      }
    }

    const filterSquares = (square) => {
      return square.filter((value) => {
        return coordsRef.some((coords) => {
          return coords.substring(0, 3) === value;
        });
      });
    };

    if (!skipRandomCoord) {
      let checkCoords = true;
      const firstSquare = generateSquare('a', 1, 5);
      const secondSquare = generateSquare('f', 6, 10);
      const thirdSquare = generateSquare('a', 6, 10);
      const fourthSquare = generateSquare('f', 1, 5);
      const firstSquareFiltered = filterSquares(firstSquare);
      const secondSquareFiltered = filterSquares(secondSquare);
      const thirdSquareFiltered = filterSquares(thirdSquare);
      const fourthSquareFiltered = filterSquares(fourthSquare);

      firstSquare.length;

      const squares = {
        firstSquareFiltered: {
          length: firstSquareFiltered.length,
          letter: 97,
          maxNumber: 1,
        },
        secondSquareFiltered: {
          length: secondSquareFiltered.length,
          letter: 102,
          maxNumber: 6,
        },
        thirdSquareFiltered: {
          length: thirdSquareFiltered.length,
          letter: 97,
          maxNumber: 6,
        },
        fourthSquareFiltered: {
          length: fourthSquareFiltered.length,
          letter: 102,
          maxNumber: 1,
        },
      };

      const lengths = [
        firstSquareFiltered.length,
        secondSquareFiltered.length,
        thirdSquareFiltered.length,
        fourthSquareFiltered.length,
      ];

      lengths.sort((a, b) => a - b);

      const lowestSquare = Object.values(squares).filter((key) => {
        return lengths[0] === key.length;
      });

      while (checkCoords) {
        coords = generateSquareRandomCoordinate(
          lowestSquare[0].letter,
          lowestSquare[0].maxNumber
        );
        checkCoords = coordsRef.some((coordinate) => {
          if (coords.length === 3) {
            return coordinate.substring(0, 3) === coords;
          } else {
            return coordinate.substring(0, 2) === coords;
          }
        });
      }
    }

    if (!hitStatus) {
      const shipPlacement = Gameboard.getShipPlacementArray(ships);

      const coordsCheck = shipPlacement.some((value) => coords === value);

      if (coordsCheck) {
        hitStatus = 'first hit';
        hitCoords.push(coords);

        Object.entries(Gameboard.ships).forEach((ship) => {
          ship[1].placement.forEach((placement) => {
            if (placement === coords) {
              shipHit = ship[1].length + 1;
            }
          });
        });
      }
    }

    return coords;
  };

  const generateSquare = (letter, minNumber, maxNumber) => {
    let coords = [];
    for (let i = minNumber; i < maxNumber + 1; i++) {
      for (let e = minNumber; e < maxNumber + 1; e++) {
        const coord = letter + e;
        coords.push(coord);
      }
      letter = nextChar(letter);
    }
    return coords;
  };

  const generateCoords = () => {
    let coords = [];
    let letter = 'a';
    for (let i = 0; i < 10; i++) {
      for (let e = 1; e < 11; e++) {
        const coord = letter + e;
        coords.push(coord);
      }
      letter = nextChar(letter);
    }
    return coords;
  };

  return {
    generateRandomCoords,
    ...Gameboard,
  };
};

export default RandomCoordinates;
