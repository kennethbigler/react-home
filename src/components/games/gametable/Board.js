import React from 'react';
import PropTypes from 'prop-types';
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
  // PropTypes = [string, object, bool, number, func, array].isRequired
  players: PropTypes.array.isRequired,
  turn: PropTypes.object,
  hideHands: PropTypes.bool,
  betHandler: PropTypes.func,
  cardHandler: PropTypes.func
};
