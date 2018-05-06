import React from 'react';
import types from 'prop-types';
import { Hand } from './Hand';
import Slider from 'material-ui/Slider';
import * as colors from 'material-ui/styles/colors';
import map from 'lodash/map';
// Parents: Board

/* --------------------------------------------------
 * Player
 * -------------------------------------------------- */
export const Player = props => {
  // get vars from props
  const { playerNo, turn, player, cardHandler, betHandler, hideHands } = props;
  // set booleans
  const isPlayerTurn = !!turn && playerNo === turn.player;
  const isMultiHand = player.hands.length > 1;
  const showSlider = !!hideHands && player.id !== 0 && !player.isBot;
  // set slider variables
  const minBet = Math.max(Math.min(player.money, 5), 0);
  const maxBet = Math.max(Math.min(player.money, 100), 10);
  const step = 5;
  const onSliderChange = (event, value) => betHandler(player.id, event, value);
  // set colors
  let color = isPlayerTurn
    ? { background: colors.cyan200 }
    : { background: colors.grey200 };
  let weight = isPlayerTurn ? { fontWeight: 'bold' } : { fontWeight: 'normal' };
  if (player.status === 'win') {
    color = { background: colors.green300 };
  }
  if (player.status === 'draw') {
    color = { background: colors.blueGrey300 };
  }
  if (player.status === 'lose') {
    color = { background: colors.red300 };
  }

  return (
    <div className="player" style={color}>
      <h2 style={{ ...weight, marginBottom: 0 }}>
        {player.name}: ${player.money}
      </h2>
      {showSlider && (
        <Slider
          max={maxBet}
          min={minBet}
          onChange={onSliderChange}
          sliderStyle={{ marginBottom: 0 }}
          step={step}
          style={{ minWidth: '100px' }}
          value={player.bet}
        />
      )}
      {player.id !== 0 && (
        <h3 style={{ marginBottom: 0 }}>Bet: ${player.bet}</h3>
      )}
      {map(player.hands, (hand, i) => {
        const isHandTurn = !!turn && turn.hand === i;
        return (
          <div key={`hand${i}`}>
            {!hideHands && (
              <Hand
                cardHandler={cardHandler}
                hand={hand}
                handNo={i}
                isHandTurn={isHandTurn}
                isMultiHand={isMultiHand}
                isPlayerTurn={isPlayerTurn}
                playerNo={playerNo}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

Player.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  betHandler: types.func,
  cardHandler: types.func,
  hideHands: types.bool,
  player: types.shape({
    hands: types.arrayOf(types.object).isRequired,
    id: types.number.isRequired,
    isBot: types.bool.isRequired,
    money: types.number.isRequired,
    status: types.string.isRequired,
    name: types.string.isRequired,
    bet: types.number.isRequired
  }).isRequired,
  playerNo: types.number.isRequired,
  turn: types.shape({
    player: types.number.isRequired,
    hand: types.number.isRequired
  })
};
