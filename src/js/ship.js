const { ComputerShipPlacement } = require('./computerShipPlacement')

const Ship = (function() {

  const generateShipData = (() => {
    return ships = {
            carrier: {
              length: 4,
              hit: 0,
              sunk: false,
              placement: [],
              color: 'black'
            },
            battleship: {
              length: 3,
              hit: 0,
              sunk: false,
              placement: [],
              color: 'green'
            },
            cruiser: {
              length: 2,
              hit: 0,
              sunk: false,
              placement: [],
              color: 'red'
            },
            submarine: {
              length: 2,
              hit: 0,
              sunk: false,
              placement: [],
              color: 'orangered'
            },
            destroyer: {
              length: 1,
              hit: 0,
              sunk: false,
              placement: [],
              color: 'blue'
            },
          }
  })

  const restartShipData =  (() => {
    Object.values(player1Ships).map((e)=> {
      return e.placement.length = 0
    })
  })

  let player1Ships = generateShipData()
  let computerShips = generateShipData()

  const hit = (coords, player) => {
    if (player === 'player1') {
      const filter = Object.entries(player1Ships).filter((e) => {
        return e[1].placement.some(value => value === coords)
      })
      ++player1Ships[filter[0][0]].hit 
    } else {
      const filter = Object.entries(computerShips).filter((e) => {
        return e[1].placement.some(value => value === coords)
      })
      ++computerShips[filter[0][0]].hit 
    }
  }

  const isSunk = (player) => {
    if (player === 'player1') {
      Object.values(player1Ships).forEach(e => {
        if((e.length+1) === e.hit) {
          e.sunk = true
        }
      })
    } else {
      Object.values(computerShips).forEach(e => {
        if((e.length+1) === e.hit) {
          e.sunk = true
        }
      })
    }
  }

  const addPlayerShipCoords = (selectedShip, value) => {
    const shipLength = player1Ships[selectedShip.id].length + 1;
    const shipPlacement = player1Ships[selectedShip.id].placement
    shipPlacement.length = 0;
    let nextNumber = value.className.substr(21, 22);
    let nextCharLetter = value.className.charAt(20);
    let coords = nextCharLetter + nextNumber;

    if (selectedShip.className.includes("column")) {
      for (i = 0; i < shipLength; i++) {
        shipPlacement.push(coords);
        nextCharLetter = nextChar(nextCharLetter);
        coords = nextCharLetter + nextNumber;
      }
    } else {
      for (i = 0; i < shipLength; i++) {
        shipPlacement.push(coords);
        ++nextNumber;
        coords = nextCharLetter + nextNumber;
      }
    }
  };


  const isGameFinished = (player) => {
    if (player === 'player1') {
      return Object.values(player1Ships).every(e => {
        return e.sunk === true
      })
    } else {
      return Object.values(computerShips).every(e => {
        return e.sunk === true
      })
    }
  }

  const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);

  ComputerShipPlacement(computerShips)

  return {
    player1Ships,
    computerShips,
    hit,
    isSunk,
    restartShipData,
    isGameFinished,
    addPlayerShipCoords
  }
})()

exports.Ship = Ship


