import React from 'react';
import types from 'prop-types';
import { Card } from './Card';
import * as colors from 'material-ui/styles/colors';
// Parents: Player

/* --------------------------------------------------
 * Hand
 * -------------------------------------------------- */
export const Hand = props => {
  const {
    handNo,
    playerNo,
    isHandTurn,
    hand,
    isMultiHand,
    isPlayerTurn,
    cardHandler
  } = props;

  const bold =
    (isHandTurn && isMultiHand && isPlayerTurn) ||
    (!isMultiHand && isPlayerTurn)
      ? { fontWeight: 'bold', color: colors.red300 }
      : { fontWeight: 'normal' };

  return (
    <div className="hand">
      <h3 style={{ ...bold, marginTop: '0.5em' }}>
        {(hand.weight > 21 ? 'Bust: ' : 'Hand Weight: ') + hand.weight}
      </h3>
      {hand.cards.map((card, i) => (
        <Card
          key={card.name + card.suit}
          name={card.name}
          suit={card.suit}
          playerNo={playerNo}
          handNo={handNo}
          cardNo={i}
          cardHandler={cardHandler}
        />
      ))}
    </div>
  );
};

Hand.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  hand: types.shape({
    weight: types.number.isRequired,
    cards: types.arrayOf(
      types.shape({
        name: types.string.isRequired,
        suit: types.string.isRequired
      })
    ).isRequired
  }).isRequired,
  playerNo: types.number.isRequired,
  handNo: types.number.isRequired,
  isHandTurn: types.bool.isRequired,
  isPlayerTurn: types.bool.isRequired,
  isMultiHand: types.bool.isRequired,
  cardHandler: types.func
};
