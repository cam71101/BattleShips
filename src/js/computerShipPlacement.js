const ComputerShipPlacement = (computerShips) => {
  let currentShip = "carrier";

  //functions
  const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);
  const prevChar = (c) => String.fromCharCode(c.charCodeAt(0) - 1);
  const compareComputerCoords = (coords) => {
    return Object.values(computerShips).some((value) => {
      return value.placement.some((e) => {
        return e === coords;
      });
    });
  };

  const toggleShip = () => {
    if (currentShip === "carrier") {
      currentShip = "battleship";
      generateRandomCoordinates();
    } else if (currentShip === "battleship") {
      currentShip = "cruiser";
      generateRandomCoordinates();
    } else if (currentShip === "cruiser") {
      currentShip = "submarine";
      generateRandomCoordinates();
    } else if (currentShip === "submarine") {
      currentShip = "destroyer";
      generateRandomCoordinates();
    } else {
      return;
    }
  };

  const generateRandomCoordinates = () => {
    //Generate random coordinates
    const randomNumber = Math.floor(Math.random() * (11 - 1) + 1);
    const randomLetter = String.fromCharCode(
      97 + Math.floor(Math.random() * 10)
    );
    const coord = randomLetter + randomNumber;

    let coords = [coord];

    // Check if coords are taken
    if (compareComputerCoords(coords)) {
      generateRandomCoordinates();
      return;
    } else {
      //Random selection between number and letter
      const randomChoice = Math.random() < 0.5 ? "letter" : "number";

      //Length of current ship
      const shipLength = computerShips[currentShip].length;

      if (randomChoice === "number") {
        let number = randomNumber;
        for (i = 0; i < shipLength; i++) {
          randomNumber < 6 ? ++number : --number;
          coords.push(randomLetter + number);
        }
      } else {
        let letter = randomLetter;
        for (i = 0; i < shipLength; i++) {
          if (
            !(
              randomLetter == "g" ||
              randomLetter == "h" ||
              randomLetter == "i" ||
              randomLetter == "j"
            )
          ) {
            letter = nextChar(letter);
          } else {
            letter = prevChar(letter);
          }
          coords.push(letter + randomNumber);
        }
      }
      const checkCoords = coords.some((e) => compareComputerCoords(e));

      if (checkCoords) {
        generateRandomCoordinates();
      } else {
        computerShips[currentShip].placement = coords;
        toggleShip();
      }
    }
  };

  generateRandomCoordinates();
};

exports.ComputerShipPlacement = ComputerShipPlacement;
