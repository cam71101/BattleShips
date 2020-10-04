import Gameboard from './gameboard';

const Player = (player1, computer) => {
  const makeAttack = (square, player) => {
    if (player === 'player1') {
      computer.receiveAttack(square.substring(22, 25));
    } else {
      const coords = player1.generateRandomCoords(player1.ships, player1.isHit);
      player1.receiveAttack(coords);
    }
  };

  return {
    makeAttack,
    ...Gameboard,
  };
};

export default Player;
