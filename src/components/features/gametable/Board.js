import React from 'react';
import PropTypes from 'prop-types';
import { Player } from './Player';
// Parents: GameTable

/* --------------------------------------------------
 * Board
 * -------------------------------------------------- */
export const Board = props => {
  const { players, turn, cardClickHandler } = props;

  const playerCode = players.map((player, i) => {
    return (
      <Player
        key={`player${i}`}
        turn={turn}
        player={player}
        playerNo={i}
        cardClickHandler={cardClickHandler}
      />
    );
  });

  return <div className="board">{playerCode}</div>;
};

Board.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  turn: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  cardClickHandler: PropTypes.func.isRequired
};
