import React from 'react';
import PropTypes from 'prop-types';
import * as colors from 'material-ui/styles/colors';
import { Hand } from './Hand';
// Parents: Board

/* --------------------------------------------------
 * Player
 * -------------------------------------------------- */
export const Player = props => {
  // get vars from props
  const { playerNo, turn, player, cardClickHandler } = props;
  // set booleans
  const isPlayerTurn = playerNo === turn.player;
  const isMultiHand = player.hands.length > 1;
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

  // code rendered per hand
  const handCode = player.hands.map((hand, i) => {
    return (
      <div key={`hand${i}`}>
        <h2 style={{ ...weight, marginBottom: 0 }}>{player.name}</h2>
        <Hand
          hand={hand}
          playerNo={playerNo}
          handNo={i}
          isHandTurn={turn.hand === i}
          isPlayerTurn={isPlayerTurn}
          isMultiHand={isMultiHand}
          cardClickHandler={cardClickHandler}
        />
      </div>
    );
  });

  return (
    <div className="player" style={color}>
      {handCode}
    </div>
  );
};

Player.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  turn: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerNo: PropTypes.number.isRequired,
  cardClickHandler: PropTypes.func.isRequired
};
