import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const MenuCasino = props => {
  // navigation
  const home = () => props.onTouchTap('/');
  const casino = () => props.onTouchTap('/casino');
  const blackjack = () => props.onTouchTap('/casino/blackjack');
  const pokernight = () => props.onTouchTap('/casino/pokernight');
  const murder = () => props.onTouchTap('/casino/murder');
  const slots = () => props.onTouchTap('/casino/slots');
  const poker = () => props.onTouchTap('/casino/poker');
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
  onTouchTap: PropTypes.func.isRequired
};
