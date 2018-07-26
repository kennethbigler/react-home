import React from 'react';
import types from 'prop-types';
import purple from '@material-ui/core/colors/purple';
import map from 'lodash/map';
import includes from 'lodash/includes';
import Card from './Card';
// Parents: Player

/* --------------------------------------------------
 * Hand
 * -------------------------------------------------- */
const Hand = (props) => {
  const {
    cardHandler,
    cardsToDiscard,
    hand,
    handNo,
    isBlackJack,
    isHandTurn,
    isMultiHand,
    isPlayerTurn,
    playerNo,
  } = props;

  const bold = (isHandTurn && isMultiHand && isPlayerTurn)
    || (!isMultiHand && isPlayerTurn)
    ? { fontWeight: 'bold', color: purple[700] }
    : { fontWeight: 'normal' };

  return (
    <div className="hand">
      <h3 style={{ ...bold, marginTop: '0.5em' }}>
        {isBlackJack
          && (hand.weight > 21 ? 'Bust: ' : 'Hand Weight: ') + hand.weight}
      </h3>
      {map(hand.cards, (card, i) => {
        const dropped = includes(cardsToDiscard, i);
        return (
          <Card
            key={card.name + card.suit}
            cardHandler={cardHandler}
            cardNo={i}
            dropped={dropped}
            handNo={handNo}
            name={card.name}
            playerNo={playerNo}
            suit={card.suit}
          />
        );
      })}
    </div>
  );
};

Hand.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  cardHandler: types.func,
  cardsToDiscard: types.arrayOf(types.number),
  hand: types.shape({
    weight: types.number,
    cards: types.arrayOf(
      types.shape({
        name: types.string.isRequired,
        suit: types.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  handNo: types.number.isRequired,
  isBlackJack: types.bool.isRequired,
  isHandTurn: types.bool.isRequired,
  isMultiHand: types.bool.isRequired,
  isPlayerTurn: types.bool.isRequired,
  playerNo: types.number.isRequired,
};

export default Hand;
