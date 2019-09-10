import React, { Fragment } from 'react';
import types from 'prop-types';
import Board from './Board';
import ButtonGroup from './ButtonGroup';
// Parents: BlackJack

/*
 * MAP:
 * GameTable ->  Board -> Player -> Hand -> Card
 *          |->  Button Group  ->  Button
 */
const GameTable = (props) => {
  const {
    betHandler,
    cardClickHandler,
    cardsToDiscard,
    gameFunctions,
    gameOver,
    hideHands,
    isBlackJack,
    players,
    turn,
  } = props;

  // move game buttons to make turn more obvious and support mobile
  const played = players.slice(0, turn.player + 1);
  const future = players.slice(turn.player + 1);
  const playersToDisplay = !hideHands && gameOver === false
    ? players.slice(turn.player, turn.player + 1)
    : players;
  // pass common props
  const passProps = {
    betHandler,
    cardsToDiscard,
    hideHands,
    isBlackJack,
    turn,
    cardHandler: cardClickHandler,
  };
  return (
    <Fragment>
      {isBlackJack && !hideHands
        ? (
          <Fragment>
            <Board players={played} {...passProps} />
            <ButtonGroup gameFunctions={gameFunctions} />
            <Board players={future} {...passProps} />
          </Fragment>
        ) : (
          <Fragment>
            <Board players={playersToDisplay} {...passProps} />
            <ButtonGroup gameFunctions={gameFunctions} />
          </Fragment>
        )}
    </Fragment>
  );
};

GameTable.propTypes = {
  betHandler: types.func,
  cardClickHandler: types.func,
  cardsToDiscard: types.arrayOf(types.number),
  gameFunctions: types.arrayOf(types.object).isRequired,
  gameOver: types.bool,
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

export default GameTable;
