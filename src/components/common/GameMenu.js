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
  const tictactoe = () => props.onTouchTap('/games/tictactoe');
  const connect4 = () => props.onTouchTap('/games/connect4');
  const deal = () => props.onTouchTap('/games/deal');

  // const poker = () => props.onTouchTap('/games/poker');
  // const bingo = () => props.onTouchTap('/games/bingo');

  // render menu
  return (
    <div>
      <MenuItem onTouchTap={games} primaryText="Games Home" />
      <Divider />
      <MenuItem onTouchTap={blackjack} primaryText="BlackJack" />
      <MenuItem onTouchTap={connect4} primaryText="Connect4" />
      <MenuItem onTouchTap={deal} primaryText="Deal or No Deal" />
      <MenuItem onTouchTap={slots} primaryText="Slot Machine" />
      <MenuItem onTouchTap={tictactoe} primaryText="Tic-Tac-Toe" />
      {/* <MenuItem onTouchTap={poker} primaryText="Poker" /> */}
      {/* <MenuItem onTouchTap={bingo} primaryText="Bingo" /> */}
      <Divider />
      <MenuItem onTouchTap={pokernight} primaryText="Poker Night Scores" />
      <MenuItem onTouchTap={murder} primaryText="Murder Mystery" />
      <Divider />
      <MenuItem onTouchTap={home} primaryText="Back to Resume" />
    </div>
  );
};

GameMenu.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onTouchTap: PropTypes.func.isRequired
};
