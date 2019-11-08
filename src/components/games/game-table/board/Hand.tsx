import React from 'react';
import purple from '@material-ui/core/colors/purple';
import { Typography } from '@material-ui/core';
import Card from './card/Card';
import { DBHand } from '../../../../store/types';

const boldStyle: React.CSSProperties = { fontWeight: 'bold', marginTop: '0.5em' };
const normalStyle: React.CSSProperties = { fontWeight: 'normal', marginTop: '0.5em' };

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

  const styles = React.useMemo(() => (
    isPlayerTurn && (!isMultiHand || (isMultiHand && isHandTurn))
      ? { ...boldStyle, color: purple[700] } : normalStyle
  ),
  [isPlayerTurn, isMultiHand, isHandTurn]);
  const handWeight = hand.weight || 0;

  return (
    <>
      <Typography variant="h4" style={styles}>
        {isBlackJack && `${handWeight > 21 ? 'Bust' : 'Hand'}: ${handWeight}`}
      </Typography>
      {hand.cards.map((card, i) => {
        const dropped: boolean = cardsToDiscard.includes(i);
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
