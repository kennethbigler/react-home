import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const MenuCasino = props => {
  return (
    <div>
      <MenuItem onTouchTap={() => props.onClick('/casino')}>Casino</MenuItem>
      <MenuItem onTouchTap={() => props.onClick('/casino/blackjack')}>
        BlackJack
      </MenuItem>
      <MenuItem onTouchTap={() => props.onClick('/casino/poker')}>
        Poker
      </MenuItem>
      <Divider />
      <MenuItem onTouchTap={() => props.onClick('/')}>Resume</MenuItem>
    </div>
  );
};

MenuCasino.propTypes = {
  onClick: PropTypes.func.isRequired
};
