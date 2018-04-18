import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
// Parents: Header

export const Menu = props => {
  const { onItemClick } = props;
  const baseUrl = '/games';

  // internal routes
  const menu = [
    { name: 'Games Home', route: '' },
    { divider: true },
    { name: 'BlackJack', route: 'blackjack' },
    { name: 'Connect4', route: 'connect4' },
    { name: 'Deal or No Deal', route: 'deal' },
    { name: 'Slot Machine', route: 'slots' },
    { name: 'Tic-Tac-Toe', route: 'tictactoe' },
    // { name: 'Poker', route: 'poker' },
    // { name: 'Bingo', route: 'bingo' }
    { divider: true },
    { name: 'Poker Night Scores', route: 'pokernight' },
    { name: 'Murder Mystery', route: 'murder' }
  ].map(
    (item, index) =>
      item.divider ? (
        <Divider key={index} />
      ) : (
        <MenuItem
          key={item.name}
          onClick={() => onItemClick(`${baseUrl}/${item.route}`)}
          primaryText={item.name}
        />
      )
  );

  // navigation
  const home = () => onItemClick('/');

  // render menu
  return (
    <div>
      <MenuItem onClick={home} primaryText="Back to Resume" />
      {menu}
    </div>
  );
};

Menu.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  onItemClick: PropTypes.func
};
