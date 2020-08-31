const { Ship } = require("./ship");
const { RandomCoorinates } = require("./randomCoordinates");

const Gameboard = (function () {

  const player1Ships = Ship.player1Ships;
  const computerShips = Ship.computerShips;

  let player1Coords = [];
  let computerCoords = [];

  const init = () => {
    createDOMS();
    bindEvents();
  };

  //cache DOM
  const shipContainer = document.querySelector(".ships");
  const playerGridSquares = document.querySelector(".grids__player-grid")
    .childNodes;
  const computerGridSquares = document.querySelector(".grids__computer-grid")
    .childNodes;
  const allShips = shipContainer.childNodes;
  const playerGrid = document.querySelector("#player-grid");
  const computerGrid = document.querySelector("#computer-grid");
  const carrier = document.querySelector(".carrier").firstElementChild;
  const battleship = document.querySelector(".battleship").firstElementChild;
  const cruiser = document.querySelector(".cruiser").firstElementChild;
  const submarine = document.querySelector(".submarine").firstElementChild;
  const destroyer = document.querySelector(".destroyer").firstElementChild;
  const grids = document.querySelector(".grids");

  const createDOMS = () => {
    createPlayerGridDOM();
    createComputerGridDOM();
  };

  const createPlayerGridDOM = () => {
    const coords = generateCoords();
    const newPlayerGrid = document.querySelector("#player-grid");
    const shipPlacement = getShipPlacementArray(player1Ships);

    coords.forEach((coord) => {
      const square = document.createElement("div");
      square.classList.add("grids__player-grid__" + coord);
      const shipPlacementCheck = checkCoordAgainstShipPlacement(
        shipPlacement,
        coord
      );
      shipPlacementCheck ? square.classList.add("grids--black") : null;

      player1Coords.forEach((playerCoord) => {
        if (playerCoord.includes("hit")) {
          if (playerCoord.length === 7) {
            if (playerCoord.substring(0, 3) === coord) {
              addCoordHit(square);
            }
          } else {
            if (playerCoord.substring(0, 2) === coord) {
              addCoordHit(square);
            }
          }
        } else {
          if (playerCoord === coord) {
            square.classList.add("grids__player-grid--missedHit");
          }
        }
      });

      newPlayerGrid.appendChild(square);
    });
  };

  const createComputerGridDOM = () => {
    const coords = generateCoords();
    const newComputerGrid = document.querySelector("#computer-grid");

    coords.forEach((coord) => {
      const square = document.createElement("div");
      square.classList.add("grids__computer-grid__" + coord);

      computerCoords.forEach((computerCoord) => {
        if (computerCoord.includes("hit")) {
          if (computerCoord.length === 7) {
            if (computerCoord.substring(0, 3) === coord) {
              square.classList.add("grids__computer-grid--hit");
            }
          } else {
            if (computerCoord.substring(0, 2) === coord) {
              square.classList.add("grids__computer-grid--hit");
            }
          }
        } else {
          if (computerCoord === coord) {
            square.classList.add("grids__computer-grid--missedHit");
          }
        }
      });
      newComputerGrid.appendChild(square);
    });
  };

  const createComputerGridContainer = () => {
    const grid = document.createElement("div");
    grid.classList.add("grids__computer-grid");
    grid.setAttribute("id", "computer-grid");
    grids.appendChild(grid);
  };

  const createPlayerGridContainer = () => {
    const grid = document.createElement("div");
    grid.classList.add("grids__player-grid");
    grid.classList.add("grids--opacity");
    grid.setAttribute("id", "player-grid");
    grids.prepend(grid);
  };

  const bindEvents = () => {
    allShips.forEach((ship) => {
      ship.addEventListener("dragstart", dragStart);
    });
    shipContainer.addEventListener("dragover", dragOver);
    shipContainer.addEventListener("dragenter", dragEnter);
    shipContainer.addEventListener("drop", dragDrop);
    playerGridSquares.forEach((square) => {
      square.addEventListener("dragover", dragOver);
      square.addEventListener("dragenter", dragEnter);
      square.addEventListener("drop", dragDrop);
    });
  };

  const startGameBindEvents = () => {
    computerGrid.classList.remove("grids--opacity");
    playerGrid.classList.add("grids--opacity");
    carrier.setAttribute("draggable", false);
    battleship.setAttribute("draggable", false);
    cruiser.setAttribute("draggable", false);
    submarine.setAttribute("draggable", false);
    destroyer.setAttribute("draggable", false);
  };

  const getShipPlacementArray = (ships) => {
    const shipPlacement = [];
    Object.values(ships).forEach((e) => {
      e.placement.forEach((value) => {
        shipPlacement.push(value);
      });
    });
    return shipPlacement;
  };

  const checkCoordAgainstShipPlacement = (shipPlacement, coord) => {
    return shipPlacement.some((e) => e === coord);
  };

  const addCoordHit = (square) => {
    square.classList.remove("grids--black");
    square.classList.add("grids__player-grid--hit");
  };

  const clearComputerDOM = () => {
    const newComputerGrid = document.querySelector("#computer-grid");
    newComputerGrid.remove();
  };

  const clearPlayerDOM = () => {
    const newPlayerGrid = document.querySelector("#player-grid");
    newPlayerGrid.remove();
  };

  const computerGridSquareBindEvents = () => {
    const newComputerGridSquares = document.querySelector("#computer-grid")
      .childNodes;
    newComputerGridSquares.forEach((square) => {
      if (square.className.includes("it")) {
        return;
      } else {
        square.addEventListener("click", attackFromPlayer);
        square.style.cursor = "pointer";
      }
    });
  };

  const startGame = () => {
    const shipPlacementArray = getShipPlacementArray(player1Ships);
    if (shipPlacementArray.length === 17) {
      startGameBindEvents();
      computerGridSquares.forEach((square) =>
        square.addEventListener("click", attackFromPlayer)
      );
    }
  };

  const restartGame = () => {
    location.reload();
  };

  function attackFromPlayer(event) {
    receiveAttack(event.target.className.substring(22, 25), "computer");
  }

  const gameFinished = (e) => {
    const newComputerGrid = document.querySelector("#computer-grid");
    const newComputerGridSquares = newComputerGrid.childNodes;
    newComputerGrid.classList.add("grids--opacity");
    newComputerGridSquares.forEach((square) => {
      square.removeEventListener("click", attackFromPlayer);
      square.style.cursor = "";
    });
    alert("Game has finished");
  };

  const receiveAttack = (coordinates, player) => {
    if (player === "player1") {
      if (comparePlayer1ShipCoords(coordinates)) {
        Ship.hit(coordinates, "player1");
        Ship.isSunk("player1");
        player1Coords.push(coordinates + "_hit");
        clearPlayerDOM();
        createPlayerGridContainer();
        createPlayerGridDOM();
        if (Ship.isGameFinished("player1")) {
          gameFinished();
          return;
        }
      } else {
        player1Coords.push(coordinates);
        clearPlayerDOM();
        createPlayerGridContainer();
        createPlayerGridDOM();
      }
    } else {
      if (compareComputerShipCoords(coordinates)) {
        Ship.hit(coordinates, "computer");
        Ship.isSunk("computer");
        computerCoords.push(coordinates + "_hit");
        clearComputerDOM();
        createComputerGridContainer();
        createComputerGridDOM();
        computerGridSquareBindEvents();
        if (Ship.isGameFinished("computer")) {
          gameFinished();
          return;
        }
      } else {
        computerCoords.push(coordinates);
        clearComputerDOM();
        createComputerGridContainer();
        createComputerGridDOM();
        computerGridSquareBindEvents();
      }
      computerTurn();
    }
  };

  const computerTurn = () => {
    const coords = RandomCoorinates.generateRandomCoords(player1Coords);
    receiveAttack(coords, "player1");
  };

  const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);

  const comparePlayer1ShipCoords = (coords) =>
    getShipPlacementArray(player1Ships).some((coord) => coord === coords);

  const compareComputerShipCoords = (coords) =>
    getShipPlacementArray(computerShips).some((coord) => coord === coords);

  clearData = () => {
    player1Coords.length = 0;
    computerCoords.length = 0;
  };

  const generateCoords = () => {
    let coords = [];
    let letter = "a";
    for (let i = 0; i < 10; i++) {
      for (let e = 1; e < 11; e++) {
        const coord = letter + e;
        coords.push(coord);
      }
      letter = nextChar(letter);
    }
    return coords;
  };

  checkEdgeGrid = (selectedShip, charNumber, charLetter, value) => {
    charNumber = parseInt(charNumber);
    if (!selectedShip.className.includes("column")) {
      if (checkHorizontal(selectedShip, charNumber)) {
        const select = document.querySelector(
          ".grids__player-grid__" +
            charLetter +
            (10 - player1Ships[selectedShip.id].length)
        );
        select.append(selectedShip);
        return;
      } else {
        value.append(selectedShip);
      }
    } else {
      if (checkVertical(selectedShip, charLetter)) {
        const newLetter = String.fromCharCode(
          "j".charCodeAt(0) - player1Ships[selectedShip.id].length
        );
        const select = document.querySelector(
          ".grids__player-grid__" + newLetter + charNumber
        );
        select.append(selectedShip);
      } else {
        value.append(selectedShip);
      }
    }
  };

  function dragStart(event) {
    event.dataTransfer.setData("text", this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragDrop(e) {
    const selectedShip = document.querySelector(
      "#" + e.dataTransfer.getData("text")
    );
    let charNumber = this.className.substr(21, 22);
    const charLetter = this.className.charAt(20);
    const shipPlacement = player1Ships[selectedShip.id].placement;
    const leadShip = selectedShip.firstElementChild;

    if (e.path[1].className === "grids__player-grid") {
      leadShip.addEventListener("dblclick", rotateShip);
      Ship.addPlayerShipCoords(selectedShip, this);
    } else {
      leadShip.removeEventListener("dblclick", rotateShip);
      shipPlacement.length = 0;
    }

    checkEdgeGrid(selectedShip, charNumber, charLetter, this);
  }

  const checkSpaceForRotation = (
    shipLenth,
    charLetter,
    coordNumber,
    orientation
  ) => {
    const shipPlacementArray = getShipPlacementArray(player1Ships);
    let coord = charLetter + coordNumber;
    const newCoords = [];
    if (orientation === "column") {
      for (let i = 1; i < shipLenth; i++) {
        ++coordNumber;
        coord = charLetter + coordNumber;
        newCoords.push(coord);
      }
    } else {
      for (let i = 1; i < shipLenth; i++) {
        charLetter = nextChar(charLetter);
        coord = charLetter + coordNumber;
        newCoords.push(coord);
      }
    }
    return newCoords.some((e) => {
      return shipPlacementArray.some((value) => {
        return e === value;
      });
    });
  };

  function rotateShip(e) {
    const selectedGrid = e.path[2];
    const selectedShip = e.path[1];
    let cordNumber = selectedGrid.className.substr(21, 22);
    cordNumber = parseInt(cordNumber);
    const charLetter = selectedGrid.className.charAt(20);
    const shipPlacement = player1Ships[selectedShip.id].placement;
    const shipLength = player1Ships[selectedShip.id].length + 1;

    if (selectedShip.className.includes("column")) {
      if (
        !checkSpaceForRotation(shipLength, charLetter, cordNumber, "column")
      ) {
        if (checkHorizontal(selectedShip, cordNumber)) {
          return;
        } else {
          selectedShip.className = selectedShip.className.replace(
            "--column",
            ""
          );
          addShipPlacement(
            charLetter,
            cordNumber,
            shipPlacement,
            shipLength,
            "x"
          );
        }
      }
    } else {
      if (!checkSpaceForRotation(shipLength, charLetter, cordNumber, "row")) {
        if (checkVertical(selectedShip, charLetter)) {
          return;
        } else {
          selectedShip.className = selectedShip.className + "--column";
          addShipPlacement(
            charLetter,
            cordNumber,
            shipPlacement,
            shipLength,
            "y"
          );
        }
      }
    }
  }

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
    if (orientation === "x") {
      for (i = 1; i < shipLength; i++) {
        ++cordNumber;
        coords = charLetter + cordNumber;
        shipPlacement.push(coords);
      }
    } else {
      for (i = 1; i < shipLength; i++) {
        charLetter = nextChar(charLetter);
        coords = charLetter + cordNumber;
        shipPlacement.push(coords);
      }
    }
  };

  const checkHorizontal = (selectedShip, cordNumber) => {
    const shipLength = 10 - player1Ships[selectedShip.id].length;
    return cordNumber > shipLength ? true : false;
  };

  const checkVertical = (selectedShip, charLetter) => {
    let check = false;
    for (let i = 0; i < player1Ships[selectedShip.id].length; i++) {
      charLetter = nextChar(charLetter);
      console.log(charLetter);
      if (charLetter === "k") {
        check = true;
        break;
      }
    }
    return check;
  };

  return {
    init,
    startGame,
    restartGame,
  };
})();

exports.Gameboard = Gameboard;
