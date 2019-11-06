import React, { memo } from 'react';
import red from '@material-ui/core/colors/red';
import { Typography } from '@material-ui/core';
import styles from './Card.styles';
// Parents: Hand

interface CardProps {
  cardHandler?: Function;
  cardNo: number;
  dropped: boolean;
  handNo: number;
  name: string;
  playerNo: number;
  suit: string;
}

const Card = memo((props: CardProps) => {
  const { dropped, suit, name } = props;
  // handle click to for card
  const handleClick = (): void => {
    const {
      cardHandler, playerNo, handNo, cardNo,
    } = props;
    cardHandler && cardHandler(playerNo, handNo, cardNo);
  };
  // checking color based off suits: ♣♦♥♠
  const cardColor: React.CSSProperties = {
    color: suit === '♣' || suit === '♠' ? 'black' : red[500],
    backgroundColor: dropped ? red[100] : 'white',
  };

  // display in view
  return (
    <div style={{ ...styles.cardFace, ...cardColor }} onClick={handleClick} role="main">
      <div style={styles.cardTitle}>
        {name + suit}
      </div>
      <Typography variant="h4" style={{ ...styles.suit, ...cardColor }}>
        {suit}
      </Typography>
    </div>
  );
});

export default Card;
