import React from 'react';
import types from 'prop-types';
import {Board} from './Board';
import {ButtonGroup} from './ButtonGroup';
// Parents: BlackJack

/*
 * MAP:
 * GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button
 */
export const GameTable = (props) => {
  const {
    betHandler,
    cardClickHandler,
    cardsToDiscard,
    gameFunctions,
    hideHands,
    isBlackJack,
    players,
    turn,
  } = props;

  // move game buttons to make turn more obvious and support mobile
  const played = players.slice(0, turn.player + 1);
  const future = players.slice(turn.player + 1);
  // pass common props
  const passProps = {
    betHandler,
    cardsToDiscard,
    isBlackJack,
    cardHandler: cardClickHandler,
  };
  return (
    <div className="gameTable">
      {hideHands ? (
        <div>
          <Board hideHands={hideHands} players={players} {...passProps} />
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
  // types = [array, bool, func, number, object, string, symbol].isRequired
  betHandler: types.func,
  cardClickHandler: types.func,
  cardsToDiscard: types.arrayOf(types.number),
  gameFunctions: types.arrayOf(types.object).isRequired,
  hideHands: types.bool,
  isBlackJack: types.bool,
  players: types.arrayOf(types.object).isRequired,
  turn: types.shape({
    player: types.number.isRequired,
  }).isRequired,
};

GameTable.defaultProps = {
  isBlackJack: true,
};
