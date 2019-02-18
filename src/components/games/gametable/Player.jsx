import React from 'react';
import types from 'prop-types';
import Slider from '@material-ui/lab/Slider';
import cyan from '@material-ui/core/colors/cyan';
import green from '@material-ui/core/colors/green';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Hand from './Hand';
// Parents: Board

const styles = {
  player: {
    borderRadius: 5,
    display: 'inline-block',
    margin: 10,
    padding: 20,
  },
  width: { minWidth: '100px' },
};

/* --------------------------------------------------
 * Player
 * -------------------------------------------------- */
const Player = (props) => {
  // get vars from props
  const {
    betHandler,
    cardHandler,
    cardsToDiscard,
    hideHands,
    isBlackJack,
    player,
    playerNo,
    turn,
  } = props;
  // set booleans
  const isPlayerTurn = !!turn && playerNo === turn.player;
  const isMultiHand = player.hands.length > 1;
  const showSlider = !!hideHands && isBlackJack && player.id !== 0 && !player.isBot;
  // set slider variables
  const minBet = Math.max(Math.min(player.money, 5), 0);
  const maxBet = Math.max(Math.min(player.money, 100), 10);
  const step = 5;
  const onSliderChange = (event, value) => betHandler(player.id, event, value);
  // set colors
  let color = isPlayerTurn ? { background: cyan[200] } : {};
  const weight = isPlayerTurn ? { fontWeight: 'bold' } : { fontWeight: 'normal' };
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
        {player.name}
        : $
        {player.money}
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
        const isHandTurn = !!turn && turn.hand === i;
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

Player.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  betHandler: types.func,
  cardHandler: types.func,
  cardsToDiscard: types.arrayOf(types.number),
  hideHands: types.bool,
  isBlackJack: types.bool.isRequired,
  player: types.shape({
    hands: types.arrayOf(types.object).isRequired,
    id: types.number.isRequired,
    isBot: types.bool.isRequired,
    money: types.number.isRequired,
    status: types.string.isRequired,
    name: types.string.isRequired,
    bet: types.number.isRequired,
  }).isRequired,
  playerNo: types.number.isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired,
  }),
};

export default Player;
