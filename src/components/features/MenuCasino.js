import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const MenuCasino = props => {
  // navigation
  const home = () => props.onClick('/');
  const casino = () => props.onClick('/casino');
  const blackjack = () => props.onClick('/casino/blackjack');
  const pokernight = () => props.onClick('/casino/pokernight');
  const murder = () => props.onClick('/casino/murder');
  const slots = () => props.onClick('/casino/slots');
  const poker = () => props.onClick('/casino/poker');
  // render menu
  return (
    <div>
      <MenuItem onTouchTap={casino}>Casino</MenuItem>
      <MenuItem onTouchTap={blackjack}>BlackJack</MenuItem>
      <MenuItem onTouchTap={slots}>Slot Machine</MenuItem>
      <MenuItem onTouchTap={poker}>Poker</MenuItem>
      {/* <MenuItem onTouchTap={bingo}>Bingo</MenuItem> */}
      <Divider />
      <MenuItem onTouchTap={pokernight}>Poker Night Scores</MenuItem>
      <MenuItem onTouchTap={murder}>Murder Mystery</MenuItem>
      <Divider />
      <MenuItem onTouchTap={home}>Back to Resume</MenuItem>
    </div>
  );
};

MenuCasino.propTypes = {
  onClick: PropTypes.func.isRequired
};
