import React from 'react';
import purple from '@material-ui/core/colors/purple';
import map from 'lodash/map';
import includes from 'lodash/includes';
import { Typography } from '@material-ui/core';
import Card from './Card';
// Parents: Player

interface DataCard {
  name: string;
  suit: string;
}
interface DataHand {
  weight: number;
  cards: DataCard[];
}
interface Hand {
  cardHandler: Function;
  cardsToDiscard: number[];
  hand: DataHand;
  handNo: number;
  isBlackJack: boolean;
  isHandTurn: boolean;
  isMultiHand: boolean;
  isPlayerTurn: boolean;
  playerNo: number;
}

/* --------------------------------------------------
 * Hand
 * -------------------------------------------------- */
const Hand: React.SFC<Hand> = (props: Hand) => {
  const {
    cardHandler, cardsToDiscard, hand, handNo,
    isBlackJack, isHandTurn, isMultiHand, isPlayerTurn,
    playerNo,
  } = props;

  const bold: React.CSSProperties = (isHandTurn && isMultiHand && isPlayerTurn)
    || (!isMultiHand && isPlayerTurn)
    ? { fontWeight: 'bold', color: purple[700] }
    : { fontWeight: 'normal' };

  return (
    <>
      <Typography variant="h4" style={{ ...bold, marginTop: '0.5em' }}>
        {isBlackJack
          && (hand.weight > 21 ? 'Bust: ' : 'Hand Weight: ') + hand.weight}
      </Typography>
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
    </>
  );
};

export default Hand;
