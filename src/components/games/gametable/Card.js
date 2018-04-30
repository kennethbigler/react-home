import React from 'react';
import types from 'prop-types';
import * as colors from 'material-ui/styles/colors';
// Parents: Hand

/* --------------------------------------------------
 * Card
 * -------------------------------------------------- */
export const Card = props => {
  const { suit, name } = props;
  // handle click to for card
  const handleClick = () => {
    const { cardHandler, playerNo, handNo, cardNo } = props;
    cardHandler(playerNo, handNo, cardNo);
  };
  // checking color based off suits: ♣♦♥♠
  const cardColor = {
    color: suit === '♣' || suit === '♠' ? colors.black : colors.red500
  };

  const styles = {
    cardTitle: { textAlign: 'left' }
  };

  // display in view
  return (
    <div className="playingCard" style={cardColor} onClick={handleClick}>
      <div style={styles.cardTitle}>{name + suit}</div>
      <h2 className="suit">{suit}</h2>
    </div>
  );
};

Card.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  name: types.string.isRequired,
  suit: types.string.isRequired,
  playerNo: types.number.isRequired,
  handNo: types.number.isRequired,
  cardNo: types.number.isRequired,
  cardHandler: types.func
};
