import React from 'react';
import PropTypes from 'prop-types';
import { Card } from './Card';
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
    cardClickHandler
  } = props;

  const bold =
    (isHandTurn && isMultiHand && isPlayerTurn) ||
    (!isMultiHand && isPlayerTurn)
      ? { fontWeight: 'bold' }
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
          cardClickHandler={cardClickHandler}
        />
      ))}
    </div>
  );
};

Hand.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  hand: PropTypes.object.isRequired,
  playerNo: PropTypes.number.isRequired,
  handNo: PropTypes.number.isRequired,
  isHandTurn: PropTypes.bool.isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  isMultiHand: PropTypes.bool.isRequired,
  cardClickHandler: PropTypes.func.isRequired
};
