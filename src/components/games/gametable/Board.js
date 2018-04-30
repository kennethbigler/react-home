import React from 'react';
import types from 'prop-types';
import { Player } from './Player';
// Parents: GameTable

/* --------------------------------------------------
 * Board
 * -------------------------------------------------- */
export const Board = props => {
  const { players, turn, cardHandler, betHandler, hideHands } = props;

  return (
    <div className="board">
      {players.map((player, i) => (
        <Player
          key={`player${i}`}
          playerNo={i}
          player={player}
          turn={turn}
          hideHands={hideHands}
          betHandler={betHandler}
          cardHandler={cardHandler}
        />
      ))}
    </div>
  );
};

Board.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  players: types.arrayOf(types.object).isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired
  }),
  hideHands: types.bool,
  betHandler: types.func,
  cardHandler: types.func
};
