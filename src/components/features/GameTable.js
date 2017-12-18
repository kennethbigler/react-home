import React from 'react';
import PropTypes from 'prop-types';
import { Board } from './gametable/Board';
import { ButtonGroup } from './gametable/ButtonGroup';
// Parents: BlackJack

/* MAP:
 *  GameTable ->  Board ->  Player  ->  Hand ->  Card
 *           |->  Button Group ->  Button
*/

export const GameTable = props => {
  const { turn, players, cardClickHandler, gameFunctions } = props;
  return (
    <div className="gameTable">
      <Board
        turn={turn}
        players={players}
        cardClickHandler={cardClickHandler}
      />
      <ButtonGroup gameFunctions={gameFunctions} />
    </div>
  );
};

GameTable.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  turn: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  cardClickHandler: PropTypes.func.isRequired,
  gameFunctions: PropTypes.array.isRequired
};
