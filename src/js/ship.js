const Ship = () => {
  const ships = {
    carrier: {
      length: 4,
      hit: 0,
      sunk: false,
      placement: [],
      orientation: null,
    },
    battleship: {
      length: 3,
      hit: 0,
      sunk: false,
      placement: [],
      orientation: null,
    },
    cruiser: {
      length: 2,
      hit: 0,
      sunk: false,
      placement: [],
      orientation: null,
    },
    submarine: {
      length: 2,
      hit: 0,
      sunk: false,
      placement: [],
      orientation: null,
    },
    destroyer: {
      length: 1,
      hit: 0,
      sunk: false,
      placement: [],
      orientation: null,
    },
  };

  const hit = (coords) => {
    const filter = Object.entries(ships).filter((e) => {
      return e[1].placement.some((value) => value === coords);
    });
    ++ships[filter[0][0]].hit;
  };

  const isSunk = () => {
    Object.values(ships).forEach((e) => {
      if (e.length + 1 === e.hit) {
        e.sunk = true;
      }
    });
  };

  const addPlayerShipCoords = (selectedShip, value) => {
    const shipLength = ships[selectedShip.id].length + 1;
    const shipPlacement = ships[selectedShip.id].placement;
    shipPlacement.length = 0;
    let nextNumber = value.className.substr(21, 22);
    let nextCharLetter = value.className.charAt(20);
    let coords = nextCharLetter + nextNumber;

    if (selectedShip.className.includes('column')) {
      for (let i = 0; i < shipLength; i++) {
        shipPlacement.push(coords);
        nextCharLetter = nextChar(nextCharLetter);
        coords = nextCharLetter + nextNumber;
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        shipPlacement.push(coords);
        ++nextNumber;
        coords = nextCharLetter + nextNumber;
      }
    }
  };

  const clearShipPlacement = () => {
    Object.values(ships).forEach((e) => {
      return (e.placement.length = 0);
    });
  };

  const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);

  return {
    ships,
    hit,
    isSunk,
    addPlayerShipCoords,
    nextChar,
    clearShipPlacement,
  };
};

export default Ship;
