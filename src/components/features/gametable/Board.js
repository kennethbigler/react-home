import React from 'react';
import PropTypes from 'prop-types';
import { Player } from './Player';
// Parents: GameTable

/* --------------------------------------------------
 * Board
 * -------------------------------------------------- */
export const Board = props => {
  const { players, turn, cardClickHandler } = props;

  return (
    <div className="board">
      {players.map((player, i) => {
        return (
          <Player
            key={`player${i}`}
            turn={turn}
            player={player}
            playerNo={i}
            cardClickHandler={cardClickHandler}
          />
        );
      })}
    </div>
  );
};

Board.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  turn: PropTypes.object,
  players: PropTypes.array.isRequired,
  cardClickHandler: PropTypes.func.isRequired
};
