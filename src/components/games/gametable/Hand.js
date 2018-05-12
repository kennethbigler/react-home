import React from 'react';
import types from 'prop-types';
import {Card} from './Card';
import {purple700} from 'material-ui/styles/colors';
import map from 'lodash/map';
// Parents: Player

/* --------------------------------------------------
 * Hand
 * -------------------------------------------------- */
export const Hand = (props) => {
  const {
    handNo,
    playerNo,
    isHandTurn,
    hand,
    isMultiHand,
    isPlayerTurn,
    cardHandler,
  } = props;

  const bold =
    (isHandTurn && isMultiHand && isPlayerTurn) ||
    (!isMultiHand && isPlayerTurn)
      ? {fontWeight: 'bold', color: purple700}
      : {fontWeight: 'normal'};

  return (
    <div className="hand">
      <h3 style={{...bold, marginTop: '0.5em'}}>
        {(hand.weight > 21 ? 'Bust: ' : 'Hand Weight: ') + hand.weight}
      </h3>
      {map(hand.cards, (card, i) => (
        <Card
          cardHandler={cardHandler}
          cardNo={i}
          handNo={handNo}
          key={card.name + card.suit}
          name={card.name}
          playerNo={playerNo}
          suit={card.suit}
        />
      ))}
    </div>
  );
};

Hand.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  cardHandler: types.func,
  hand: types.shape({
    weight: types.number.isRequired,
    cards: types.arrayOf(
      types.shape({
        name: types.string.isRequired,
        suit: types.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  handNo: types.number.isRequired,
  isHandTurn: types.bool.isRequired,
  isMultiHand: types.bool.isRequired,
  isPlayerTurn: types.bool.isRequired,
  playerNo: types.number.isRequired,
};
