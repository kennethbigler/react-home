import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const GameMenu = props => {
  // navigation
  const home = () => props.onTouchTap('/');
  const games = () => props.onTouchTap('/games');
  const blackjack = () => props.onTouchTap('/games/blackjack');
  const pokernight = () => props.onTouchTap('/games/pokernight');
  const murder = () => props.onTouchTap('/games/murder');
  const slots = () => props.onTouchTap('/games/slots');
  const poker = () => props.onTouchTap('/games/poker');
  const tictactoe = () => props.onTouchTap('/games/tictactoe');
  // render menu
  return (
    <div>
      <MenuItem onTouchTap={games}>Games Home</MenuItem>
      <MenuItem onTouchTap={blackjack}>BlackJack</MenuItem>
      <MenuItem onTouchTap={slots}>Slot Machine</MenuItem>
      <MenuItem onTouchTap={poker}>Poker</MenuItem>
      <MenuItem onTouchTap={tictactoe}>Tic-Tac-Toe</MenuItem>
      {/* <MenuItem onTouchTap={bingo}>Bingo</MenuItem> */}
      <Divider />
      <MenuItem onTouchTap={pokernight}>Poker Night Scores</MenuItem>
      <MenuItem onTouchTap={murder}>Murder Mystery</MenuItem>
      <Divider />
      <MenuItem onTouchTap={home}>Back to Resume</MenuItem>
    </div>
  );
};

GameMenu.propTypes = {
  onTouchTap: PropTypes.func.isRequired
};
