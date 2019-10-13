import React from 'react';
import purple from '@material-ui/core/colors/purple';
import map from 'lodash/map';
import includes from 'lodash/includes';
import { Typography } from '@material-ui/core';
import Card from './card/Card';
import { DBHand } from '../../../../store/types';
// Parents: Player

interface HandProps {
  cardHandler?: Function;
  cardsToDiscard: number[];
  hand: DBHand;
  handNo: number;
  isBlackJack: boolean;
  isHandTurn: boolean;
  isMultiHand: boolean;
  isPlayerTurn: boolean;
  playerNo: number;
}

const Hand: React.FC<HandProps> = (props: HandProps) => {
  const {
    cardHandler, cardsToDiscard, hand, handNo,
    isBlackJack, isHandTurn, isMultiHand, isPlayerTurn,
    playerNo,
  } = props;

  const bold: React.CSSProperties = (isHandTurn && isMultiHand && isPlayerTurn)
    || (!isMultiHand && isPlayerTurn)
    ? { fontWeight: 'bold', color: purple[700] }
    : { fontWeight: 'normal' };

  const handWeight = hand.weight || false;

  return (
    <>
      <Typography variant="h4" style={{ ...bold, marginTop: '0.5em' }}>
        {isBlackJack
          && (handWeight > 21 ? 'Bust: ' : 'Hand Weight: ') + hand.weight}
      </Typography>
      {map(hand.cards, (card, i) => {
        const dropped: boolean = includes(cardsToDiscard, i);
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
