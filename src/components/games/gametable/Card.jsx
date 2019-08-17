import React, { memo } from 'react';
import types from 'prop-types';
import red from '@material-ui/core/colors/red';
import { Typography } from '@material-ui/core';
import styles from './Card.styles';
// Parents: Hand

/* --------------------------------------------------
 * Card
 * -------------------------------------------------- */
const Card = memo((props) => {
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

  // display in view
  return (
    <div style={{ ...styles.cardFace, ...cardColor }} onClick={handleClick} role="main">
      <div style={styles.cardTitle}>
        {name + suit}
      </div>
      <Typography variant="h3" style={{ ...styles.suit, ...cardColor }}>
        {suit}
      </Typography>
    </div>
  );
});

Card.propTypes = {
  cardHandler: types.func,
  cardNo: types.number.isRequired,
  dropped: types.bool,
  handNo: types.number.isRequired,
  name: types.string.isRequired,
  playerNo: types.number.isRequired,
  suit: types.string.isRequired,
};

export default Card;
