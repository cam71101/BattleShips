const Gameboard = (ship) => {
  let coords = [];
  const isHit = { isHit: false };
  const getShipPlacementArray = (ships) => {
    const shipPlacement = [];
    Object.values(ships).forEach((e) => {
      e.placement.forEach((value) => {
        shipPlacement.push(value);
      });
    });
    return shipPlacement;
  };

  const isGameFinished = () => {
    return Object.values(ship.ships).every((e) => {
      return e.sunk === true;
    });
  };

  const receiveAttack = (coordinates) => {
    if (compareShipCoords(coordinates)) {
      ship.hit(coordinates);
      ship.isSunk();
      coords.push(coordinates + '_hit');
      isHit.isHit = true;
    } else {
      isHit.isHit = false;
      coords.push(coordinates);
    }
  };

  const compareShipCoords = (coords) =>
    getShipPlacementArray(ship.ships).some((coord) => coord === coords);

  const addShipPlacement = (
    charLetter,
    cordNumber,
    shipPlacement,
    shipLength,
    orientation
  ) => {
    shipPlacement.length = 0;
    let coords = charLetter + cordNumber;
    shipPlacement.push(coords);
    if (orientation === 'x') {
      for (let i = 1; i < shipLength; i++) {
        ++cordNumber;
        coords = charLetter + cordNumber;
        shipPlacement.push(coords);
      }
    } else {
      for (let i = 1; i < shipLength; i++) {
        charLetter = ship.nextChar(charLetter);
        coords = charLetter + cordNumber;
        shipPlacement.push(coords);
      }
    }
  };

  return {
    coords,
    isGameFinished,
    receiveAttack,
    addShipPlacement,
    getShipPlacementArray,
    isHit,
    ...ship,
  };
};

export default Gameboard;
