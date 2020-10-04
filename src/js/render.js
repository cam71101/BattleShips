const Render = (player1, computer, player) => {
  const player1Ships = player1.ships;
  const computerCoords = computer.coords;
  const player1Coords = player1.coords;

  const init = () => {
    createDOMS();
    bindEvents();
  };

  // DOM Selectors
  const shipContainer = document.querySelector('.ships');
  const playerGridSquares = document.querySelector('.grids__player-grid')
    .childNodes;
  const computerGridSquares = document.querySelector('#computer-grid')
    .childNodes;
  const allShips = shipContainer.childNodes;
  const computerGrid = document.querySelector('#computer-grid');
  const grids = document.querySelector('.grids');

  const bindEvents = () => {
    allShips.forEach((ship) => {
      ship.addEventListener('dragstart', dragStart);
    });
    shipContainer.addEventListener('dragover', dragOver);
    shipContainer.addEventListener('dragenter', dragEnter);
    shipContainer.addEventListener('drop', dragDrop);
    playerGridSquares.forEach((square) => {
      square.addEventListener('dragover', dragOver);
      square.addEventListener('dragenter', dragEnter);
      square.addEventListener('drop', dragDrop);
    });
  };

  const createDOMS = () => {
    createGridDOM('player');
    createGridDOM('computer');
  };

  const checkCoordAgainstShipPlacement = (shipPlacement, coord) => {
    return shipPlacement.some((e) => e === coord);
  };

  const startGame = () => {
    const shipPlacementArray = player1.getShipPlacementArray(player1Ships);
    if (shipPlacementArray.length === 17) {
      startGameBindEvents();
      computerGridSquares.forEach((square) =>
        square.addEventListener('click', attackFromPlayer)
      );
    }
  };

  function attackFromPlayer(event) {
    player.makeAttack(event.target.className, 'player1');
    renderDOM('computer');
    computerGridSquareBindEvents();
    if (computer.isGameFinished()) {
      gameFinished('computer');
      return;
    }
    attackFromComputer();
  }

  function attackFromComputer() {
    player.makeAttack();
    renderDOM('player');
    if (player1.isGameFinished()) {
      gameFinished('player1');
      return;
    }
  }

  const renderDOM = (player) => {
    clearDOM(player);
    createGridContainer(player);
    createGridDOM(player);
    updateComputerFleet();
  };

  // background: $gradient - top;

  const updateComputerFleet = () => {
    Object.entries(computer.ships).forEach((ship) => {
      if (ship[1].hit) {
        const selectedShip = document.querySelector('#computer-' + ship[0]);
        let i = 0;
        selectedShip.childNodes.forEach((value) => {
          if (!value.data && i < ship[1].hit) {
            value.style.backgroundColor = '#ea3546ff';
            i++;
          }
        });
      }
    });
  };

  const gameFinished = (player) => {
    const newComputerGrid = document.querySelector('#computer-grid');
    const newComputerGridSquares = newComputerGrid.childNodes;

    newComputerGridSquares.forEach((square) => {
      square.removeEventListener('click', attackFromPlayer);
      square.style.cursor = '';
    });

    const instructions = document.querySelector('.instructions');
    if (player === 'computer') {
      instructions.textContent = 'Player wins!';
      document.querySelector('#player-grid').classList.add('grids--opacity');
    } else {
      instructions.textContent = 'Computer wins!';
      newComputerGrid.classList.add('grids--opacity');
    }
    instructions.style.display = 'inline';
  };

  const autoPlace = () => {
    player1.clearShipPlacement();
    player1.generateRandomCoordinates();

    Object.entries(player1Ships).forEach((e) => {
      const square = document.querySelector(
        '.grids__player-grid__' + e[1].placement[0]
      );
      const container = document.querySelector('#' + e[0]);

      container.firstElementChild.addEventListener('dblclick', rotateShip);
      container.firstElementChild.classList.add('shake');

      container.childNodes.forEach((square) =>
        !square.data ? (square.style.border = 'none') : null
      );

      if (container.className.includes(container.id + '--column')) {
        if (e[1].placement[1].includes(e[1].placement[0].substring(0, 1))) {
          container.className = container.className.replace(
            container.id + '--column',
            ''
          );
        }
      } else {
        if (!e[1].placement[1].includes(e[1].placement[0].substring(0, 1))) {
          container.classList.add(container.id + '--column');
        }
      }
      square.appendChild(container);
    });
  };

  const clearDOM = (player) => {
    const newGrid = document.querySelector('#' + player + '-grid');
    newGrid.remove();
  };

  const computerGridSquareBindEvents = () => {
    const newComputerGridSquares = document.querySelector('#computer-grid')
      .childNodes;
    newComputerGridSquares.forEach((square) => {
      if (!square.className.includes('it')) {
        square.addEventListener('click', attackFromPlayer);
        square.style.cursor = 'pointer';
      }
    });
  };

  const createGridDOM = (player) => {
    const coords = generateCoords();
    const newGrid = document.querySelector('#' + player + '-grid');
    const shipPlacement = player1.getShipPlacementArray(player1Ships);

    coords.forEach((coord) => {
      const square = document.createElement('div');
      square.classList.add('grids__' + player + '-grid__' + coord);
      const shipPlacementCheck = checkCoordAgainstShipPlacement(
        shipPlacement,
        coord
      );

      let selectedPlayer;

      if (player === 'player') {
        shipPlacementCheck && square.classList.add('grids--ship');
        selectedPlayer = player1Coords;
      } else {
        selectedPlayer = computerCoords;
      }

      selectedPlayer.forEach((playerCoord) => {
        if (playerCoord.includes('hit')) {
          if (playerCoord.length === 7) {
            playerCoord.substring(0, 3) === coord && addCoordHit(square);
          } else {
            playerCoord.substring(0, 2) === coord && addCoordHit(square);
          }
        } else {
          if (playerCoord === coord) {
            square.classList.add('grids__player-grid--missedHit');
          }
        }
      });
      newGrid.appendChild(square);
    });
  };

  const addCoordHit = (square) => {
    square.classList.remove('grids--ship');
    square.classList.add('grids__player-grid--hit');
  };

  const createGridContainer = (player) => {
    const grid = document.createElement('div');
    grid.classList.add('grids__' + player + '-grid');
    grid.setAttribute('id', player + '-grid');
    if (player === 'player') {
      grid.classList.add('grids--small');
      grids.prepend(grid);
    } else {
      grids.appendChild(grid);
    }

    // background: $gradient - top;
  };

  const generateCoords = () => {
    let coords = [];
    let letter = 'a';
    for (let i = 0; i < 10; i++) {
      for (let e = 1; e < 11; e++) {
        const coord = letter + e;
        coords.push(coord);
      }
      letter = player1.nextChar(letter);
    }
    return coords;
  };

  function dragStart(event) {
    event.dataTransfer.setData('text', this.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  const predictedCoords = (
    coords,
    charNumber,
    charLetter,
    selectedShip,
    player1Ships,
    shipLength
  ) => {
    let selectedShipPlacement = [coords];
    let coordNumber = charNumber;
    let newCharLetter = charLetter;
    let newCoords = coords;
    if (player1Ships[selectedShip.id].orientation === 'hor') {
      for (let i = 1; i < shipLength; i++) {
        ++coordNumber;
        newCoords = charLetter + coordNumber;
        selectedShipPlacement.push(newCoords);
      }
    } else {
      for (let i = 1; i < shipLength; i++) {
        newCharLetter = player1.nextChar(newCharLetter);
        newCoords = newCharLetter + coordNumber;
        selectedShipPlacement.push(newCoords);
      }
    }
    return selectedShipPlacement;
  };

  function dragDrop(e) {
    if (isNaN(e.dataTransfer.getData('text'))) {
      const selectedShip = document.querySelector(
        '#' + e.dataTransfer.getData('text')
      );
      let charNumber = this.className.substr(21, 22);
      let charLetter = this.className.charAt(20);
      const shipPlacement = player1Ships[selectedShip.id].placement;
      const leadShip = selectedShip.firstElementChild;

      let selectedSquare = this;
      player1Ships[selectedShip.id].placement.length = 0;
      const shipsArray = player1.getShipPlacementArray(player1Ships);
      let coords = charLetter + charNumber;

      let pathName = e.path[1].className;

      let shipLength = player1Ships[selectedShip.id].length + 1;

      if (selectedShip.className.includes('column')) {
        player1Ships[selectedShip.id].orientation = 'ver';
      } else {
        player1Ships[selectedShip.id].orientation = 'hor';
      }

      let selectedShipPlacement = predictedCoords(
        coords,
        charNumber,
        charLetter,
        selectedShip,
        player1Ships,
        shipLength
      );

      let compareShipPlacement = shipsArray.some((coord) => {
        return selectedShipPlacement.some((value) => value === coord);
      });

      while (compareShipPlacement) {
        pathName = 'grids__player-grid';
        const ship = Object.values(player1Ships).filter((value) => {
          return value.placement.some((coord) => {
            return selectedShipPlacement.some(
              (shipPlacement) => shipPlacement === coord
            );
          });
        });
        if (ship[0].orientation === 'ver') {
          if (player1Ships[selectedShip.id].orientation === 'ver') {
            if (ship[0].placement[0].substring(1, 3) < 5) {
              ++charNumber;
            } else {
              --charNumber;
            }
          } else {
            if (ship[0].placement[0].substring(1, 3) < 5) {
              ++charNumber;
            } else {
              charNumber = --charNumber;
            }
          }
        } else {
          if (player1Ships[selectedShip.id].orientation === 'ver') {
            if (ship[0].placement[0].substring(1, 3) < 5) {
              ++charNumber;
            } else {
              charNumber =
                charNumber - (player1Ships[selectedShip.id].length + 1);
            }
          } else {
            if (ship[0].placement[0].substring(0, 1) < 'j') {
              charLetter = player1.nextChar(charLetter);
            } else {
              while (compareShipPlacement) {
                charLetter = player1.prevChar(charLetter);
                coords = charLetter + charNumber;
                compareShipPlacement = shipsArray.some(
                  (coord) => coord === coords
                );
              }
            }
          }
        }
        selectedSquare = document.querySelector(
          '.' + selectedSquare.className.substr(0, 20) + charLetter + charNumber
        );
        coords = charLetter + charNumber;

        selectedShipPlacement = predictedCoords(
          coords,
          charNumber,
          charLetter,
          selectedShip,
          player1Ships,
          shipLength
        );
        compareShipPlacement = shipsArray.some((coord) => {
          return selectedShipPlacement.some((value) => value === coord);
        });
      }

      const select = checkEdgeGrid(
        selectedShip,
        charNumber,
        charLetter,
        selectedSquare
      );

      if (pathName === 'grids__player-grid') {
        leadShip.addEventListener('dblclick', rotateShip);
        leadShip.classList.add('shake');
        player1.addPlayerShipCoords(selectedShip, select);
        selectedShip.childNodes.forEach((square) => {
          if (!square.data) {
            square.style.border = 'none';
          }
        });
      } else {
        leadShip.removeEventListener('dblclifck', rotateShip);
        shipPlacement.length = 0;
      }
    }
  }

  const startGameBindEvents = () => {
    computerGrid.style.display = 'flex';
    document.querySelector('.ships').style.display = 'none';
    document.querySelector('#start').style.display = 'none';
    document.querySelector('#autoPlaceBtn').style.display = 'none';
    document.querySelector('.computer-fleet').style.display = 'flex';
    document.querySelector('.instructions').style.display = 'none';
    renderDOM('player');
  };

  const checkEdgeGrid = (selectedShip, charNumber, charLetter, value) => {
    charNumber = parseInt(charNumber);
    let select = value;
    if (!selectedShip.className.includes('column')) {
      if (checkHorizontal(selectedShip, charNumber)) {
        select = document.querySelector(
          '.grids__player-grid__' +
            charLetter +
            (10 - player1Ships[selectedShip.id].length)
        );
        select.append(selectedShip);
      } else {
        value.append(selectedShip);
      }
    } else {
      if (checkVertical(selectedShip, charLetter)) {
        const newLetter = String.fromCharCode(
          'j'.charCodeAt(0) - player1Ships[selectedShip.id].length
        );
        select = document.querySelector(
          '.grids__player-grid__' + newLetter + charNumber
        );
        select.append(selectedShip);
      } else {
        value.append(selectedShip);
      }
    }
    return select;
  };

  const checkVertical = (selectedShip, charLetter) => {
    let check = false;
    for (let i = 0; i < player1Ships[selectedShip.id].length; i++) {
      charLetter = player1.nextChar(charLetter);
      if (charLetter === 'k') {
        check = true;
        break;
      }
    }
    return check;
  };

  const checkHorizontal = (selectedShip, cordNumber) => {
    const shipLength = 10 - player1Ships[selectedShip.id].length;
    return cordNumber > shipLength ? true : false;
  };

  const checkSpaceForRotation = (
    shipLenth,
    charLetter,
    coordNumber,
    orientation
  ) => {
    const shipPlacementArray = player1.getShipPlacementArray(player1Ships);
    let coord = charLetter + coordNumber;
    const newCoords = [];
    if (orientation === 'column') {
      for (let i = 1; i < shipLenth; i++) {
        ++coordNumber;
        coord = charLetter + coordNumber;
        newCoords.push(coord);
      }
    } else {
      for (let i = 1; i < shipLenth; i++) {
        charLetter = player1.nextChar(charLetter);
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

  const restartGame = () => {
    location.reload();
  };

  function rotateShip(e) {
    const selectedGrid = e.path[2];
    const selectedShip = e.path[1];
    let cordNumber = selectedGrid.className.substr(21, 22);
    cordNumber = parseInt(cordNumber);
    const charLetter = selectedGrid.className.charAt(20);
    const shipPlacement = player1Ships[selectedShip.id].placement;
    const shipLength = player1Ships[selectedShip.id].length + 1;

    selectedShip.id;

    if (selectedShip.className.includes('column')) {
      if (
        !checkSpaceForRotation(shipLength, charLetter, cordNumber, 'column')
      ) {
        if (!checkHorizontal(selectedShip, cordNumber)) {
          selectedShip.className = selectedShip.className.replace(
            '--column',
            ''
          );
          player1Ships[selectedShip.id].orientation = 'hor';
          player1.addShipPlacement(
            charLetter,
            cordNumber,
            shipPlacement,
            shipLength,
            'x'
          );
        }
      }
    } else {
      if (!checkSpaceForRotation(shipLength, charLetter, cordNumber, 'row')) {
        if (!checkVertical(selectedShip, charLetter)) {
          selectedShip.classList.add(selectedShip.id + '--column');
          player1Ships[selectedShip.id].orientation = 'ver';
          player1.addShipPlacement(
            charLetter,
            cordNumber,
            shipPlacement,
            shipLength,
            'y'
          );
        }
      }
    }
  }

  init();

  return {
    startGame,
    restartGame,
    attackFromPlayer,
    autoPlace,
  };
};

export default Render;
