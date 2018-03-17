import React from 'react';
import PropTypes from 'prop-types';
import { Hand } from './Hand';
import Slider from 'material-ui/Slider';
import * as colors from 'material-ui/styles/colors';
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
          min={minBet}
          max={maxBet}
          step={step}
          value={player.bet}
          onChange={onSliderChange}
          sliderStyle={{ marginBottom: 0 }}
          style={{ minWidth: '100px' }}
        />
      )}
      {player.id !== 0 && <h3>Bet: ${player.bet}</h3>}
      {player.hands.map((hand, i) => {
        const isHandTurn = !!turn && turn.hand === i;
        return (
          <div key={`hand${i}`}>
            {!hideHands && (
              <Hand
                hand={hand}
                playerNo={playerNo}
                handNo={i}
                isHandTurn={isHandTurn}
                isPlayerTurn={isPlayerTurn}
                isMultiHand={isMultiHand}
                cardHandler={cardHandler}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

Player.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  player: PropTypes.object.isRequired,
  playerNo: PropTypes.number.isRequired,
  hideHands: PropTypes.bool,
  turn: PropTypes.object,
  betHandler: PropTypes.func,
  cardHandler: PropTypes.func
};
