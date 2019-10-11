import React from 'react';
import Slider from '@material-ui/core/Slider';
import cyan from '@material-ui/core/colors/cyan';
import green from '@material-ui/core/colors/green';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Hand, { DBHand } from '../Hand';
import styles from './Player.styles';
// Parents: Board

export interface DBTurn {
  player: number;
  hand: number;
}
export interface DBPlayer {
  hands: DBHand[];
  id: number;
  isBot: boolean;
  money: number;
  status: string;
  name: string;
  bet: number;
}
interface PlayerProps {
  betHandler?: Function;
  cardHandler?: Function;
  cardsToDiscard?: number[];
  hideHands?: boolean;
  isBlackJack?: boolean;
  player: DBPlayer;
  playerNo: number;
  turn: DBTurn;
}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  // get vars from props
  const {
    betHandler, cardHandler, cardsToDiscard, hideHands,
    isBlackJack, player, playerNo, turn,
  } = props;
  // set booleans
  const isPlayerTurn: boolean = !!turn && playerNo === turn.player;
  const isMultiHand: boolean = player.hands.length > 1;
  const showSlider: boolean | undefined = !!hideHands && isBlackJack && player.id !== 0 && !player.isBot;
  // set slider variables
  const minBet: number = Math.max(Math.min(player.money, 5), 0);
  const maxBet: number = Math.max(Math.min(player.money, 100), 10);
  const step = 5;
  const onSliderChange = (event: React.ChangeEvent<{}>, value: number | number[]): void => {
    betHandler && betHandler(player.id, event, value);
  };
  // set colors
  let color: React.CSSProperties = isPlayerTurn ? { background: cyan[200] } : {};
  const weight: React.CSSProperties = isPlayerTurn ? { fontWeight: 'bold' } : { fontWeight: 'normal' };
  if (player.status === 'win') {
    color = { background: green[300] };
  }
  if (player.status === 'draw') {
    color = { background: blueGrey[300] };
  }
  if (player.status === 'lose') {
    color = { background: red[300] };
  }

  return (
    <Card style={{ ...styles.player, ...color }}>
      <Typography variant="h4" style={{ ...weight }}>
        {`${player.name}: $${player.money}`}
      </Typography>
      {showSlider && (
        <Slider
          max={maxBet}
          min={minBet}
          onChange={onSliderChange}
          step={step}
          style={styles.width}
          value={player.bet}
        />
      )}
      {isBlackJack
        && player.id !== 0 && (
          <Typography variant="h5">
            Bet: $
            {player.bet}
          </Typography>
      )}
      {map(player.hands, (hand, i) => {
        const isHandTurn: boolean = !!turn && turn.hand === i;
        return (
          <div key={`hand${i}`}>
            {!hideHands && (
              <Hand
                cardHandler={cardHandler}
                cardsToDiscard={cardsToDiscard}
                hand={hand}
                handNo={i}
                isBlackJack={isBlackJack}
                isHandTurn={isHandTurn}
                isMultiHand={isMultiHand}
                isPlayerTurn={isPlayerTurn}
                playerNo={playerNo}
              />
            )}
          </div>
        );
      })}
    </Card>
  );
};

export default Player;
