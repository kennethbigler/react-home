import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Player from './Player';
// Parents: GameTable

/* --------------------------------------------------
 * Board
 * -------------------------------------------------- */
const Board = (props) => {
  const {
    betHandler,
    cardHandler,
    cardsToDiscard,
    hideHands,
    isBlackJack,
    players,
    turn,
  } = props;

  return (
    <div>
      {map(players, (player, i) => (
        <Player
          key={`player${i}`}
          betHandler={betHandler}
          cardHandler={cardHandler}
          cardsToDiscard={cardsToDiscard}
          hideHands={hideHands}
          isBlackJack={isBlackJack}
          player={player}
          playerNo={i}
          turn={turn}
        />
      ))}
    </div>
  );
};

Board.propTypes = {
  betHandler: types.func,
  cardHandler: types.func,
  cardsToDiscard: types.arrayOf(types.number),
  hideHands: types.bool,
  isBlackJack: types.bool.isRequired,
  players: types.arrayOf(types.object).isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired,
  }),
};

export default Board;
