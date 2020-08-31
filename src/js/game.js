const { Gameboard } = require('./gameboard')


const Game = (function() {

  const startBtn = document.querySelector("#start");
  const restartBtn = document.querySelector('#restart')

  startBtn.addEventListener("click", Gameboard.startGame);
  restartBtn.addEventListener("click", Gameboard.restartGame);

  Gameboard.init()

    
})()
