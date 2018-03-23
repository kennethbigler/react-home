import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const Menu = props => {
  const { onItemClick } = props;
  // navigation
  const home = () => onItemClick('/');
  const games = () => onItemClick('/games');
  const blackjack = () => onItemClick('/games/blackjack');
  const pokernight = () => onItemClick('/games/pokernight');
  const murder = () => onItemClick('/games/murder');
  const slots = () => onItemClick('/games/slots');
  const tictactoe = () => onItemClick('/games/tictactoe');
  const connect4 = () => onItemClick('/games/connect4');
  const deal = () => onItemClick('/games/deal');

  // const poker = () => onItemClick('/games/poker');
  // const bingo = () => onItemClick('/games/bingo');

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

Menu.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onItemClick: PropTypes.func
};
