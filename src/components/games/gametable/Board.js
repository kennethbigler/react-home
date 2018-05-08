import React from 'react';
import types from 'prop-types';
import {Player} from './Player';
import map from 'lodash/map';
// Parents: GameTable

/* --------------------------------------------------
 * Board
 * -------------------------------------------------- */
export const Board = (props) => {
  const {players, turn, cardHandler, betHandler, hideHands} = props;

  return (
    <div className="board">
      {map(players, (player, i) => (
        <Player
          betHandler={betHandler}
          cardHandler={cardHandler}
          hideHands={hideHands}
          key={`player${i}`}
          player={player}
          playerNo={i}
          turn={turn}
        />
      ))}
    </div>
  );
};

Board.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  betHandler: types.func,
  cardHandler: types.func,
  hideHands: types.bool,
  players: types.arrayOf(types.object).isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired,
  }),
};
