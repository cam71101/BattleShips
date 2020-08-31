const { Gameboard } = require("./gameboard");

const RandomCoorinates = (function () {
  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * (11 - 1) + 1);
    const randomLetter = String.fromCharCode(
      97 + Math.floor(Math.random() * 10)
    );
    return randomLetter + randomNumber;
  };

  const generateRandomCoords = (player1Coords) => {
    coordsRef = [...player1Coords];
    let checkCoords = true;
    let coords = "";

    while (checkCoords === true) {
      coords = generateRandomNumber();
      checkCoords = coordsRef.some((coordinate) => {
        if (coords.length === 3) {
          return coordinate.substring(0, 3) === coords;
        } else {
          return coordinate.substring(0, 2) === coords;
        }
      });
    }

    return coords;
  };

  return {
    generateRandomCoords,
  };
})();

exports.RandomCoorinates = RandomCoorinates;
