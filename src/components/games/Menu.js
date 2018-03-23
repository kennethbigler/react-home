import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const Menu = props => {
  const { onItemClick } = props;
  const baseUrl = '/games';
  // navigation
  const home = () => onItemClick('/');
  const games = () => onItemClick(`${baseUrl}`);
  const blackjack = () => onItemClick(`${baseUrl}/blackjack`);
  const pokernight = () => onItemClick(`${baseUrl}/pokernight`);
  const murder = () => onItemClick(`${baseUrl}/murder`);
  const slots = () => onItemClick(`${baseUrl}/slots`);
  const tictactoe = () => onItemClick(`${baseUrl}/tictactoe`);
  const connect4 = () => onItemClick(`${baseUrl}/connect4`);
  const deal = () => onItemClick(`${baseUrl}/deal`);

  // const poker = () => onItemClick(`${baseUrl}/poker`);
  // const bingo = () => onItemClick(`${baseUrl}/bingo`);

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
