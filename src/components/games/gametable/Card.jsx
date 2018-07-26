import React from 'react';
import types from 'prop-types';
import red from '@material-ui/core/colors/red';
// Parents: Hand

/* --------------------------------------------------
 * Card
 * -------------------------------------------------- */
const Card = (props) => {
  const { dropped, suit, name } = props;
  // handle click to for card
  const handleClick = () => {
    const {
      cardHandler, playerNo, handNo, cardNo,
    } = props;
    cardHandler(playerNo, handNo, cardNo);
  };
  // checking color based off suits: ♣♦♥♠
  const cardColor = {
    color: suit === '♣' || suit === '♠' ? 'black' : red[500],
    backgroundColor: dropped ? red[100] : 'white',
  };

  const styles = {
    cardTitle: { textAlign: 'left' },
  };

  // display in view
  return (
    <div className="playingCard" onClick={handleClick} style={cardColor}>
      <div style={styles.cardTitle}>
        {name + suit}
      </div>
      <h2 className="suit">
        {suit}
      </h2>
    </div>
  );
};

Card.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  cardHandler: types.func,
  cardNo: types.number.isRequired,
  dropped: types.bool,
  handNo: types.number.isRequired,
  name: types.string.isRequired,
  playerNo: types.number.isRequired,
  suit: types.string.isRequired,
};

export default Card;
