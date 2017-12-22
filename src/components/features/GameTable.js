import React from 'react';
import PropTypes from 'prop-types';
import { Board } from './gametable/Board';
import { ButtonGroup } from './gametable/ButtonGroup';
// Parents: BlackJack

/**
 * MAP:
 * GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button
 */
export const GameTable = props => {
  const {
    turn,
    players,
    cardClickHandler,
    gameFunctions,
    betHandler,
    hideHands
  } = props;

  // move game buttons to make turn more obvious and support mobile
  const played = players.slice(0, turn.player + 1);
  const future = players.slice(turn.player + 1);
  // pass common props
  const passProps = { betHandler, cardHandler: cardClickHandler };
  return (
    <div className="gameTable">
      {hideHands ? (
        <div>
          <Board players={players} hideHands={hideHands} {...passProps} />
          <ButtonGroup gameFunctions={gameFunctions} />
        </div>
      ) : (
        <div>
          <Board players={played} turn={turn} {...passProps} />
          <ButtonGroup gameFunctions={gameFunctions} />
          <Board players={future} {...passProps} />
        </div>
      )}
    </div>
  );
};

GameTable.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  turn: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  gameFunctions: PropTypes.array.isRequired,
  hideHands: PropTypes.bool,
  betHandler: PropTypes.func,
  cardClickHandler: PropTypes.func
};
