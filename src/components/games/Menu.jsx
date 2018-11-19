import React from 'react';
import types from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import map from 'lodash/map';
// Parents: Header

const Menu = (props) => {
  const { onItemClick } = props;
  const baseUrl = '/games';

  // internal routes
  const menu = map(
    [
      { name: 'Home - Games', route: '' },
      { divider: true },
      // { name: 'Bingo', route: 'bingo' }
      { name: 'BlackJack', route: 'blackjack' },
      { name: 'Connect4', route: 'connect4' },
      { name: 'Deal or No Deal', route: 'deal' },
      { name: 'Poker', route: 'poker' },
      { name: 'Slot Machine', route: 'slots' },
      { name: 'Tic-Tac-Toe', route: 'tictactoe' },
      { name: 'Yatzee', route: 'yatzee' },
    ],
    (item, index) => (item.divider
      ? (
        <Divider key={index} />
      ) : (
        <MenuItem
          key={item.name}
          onClick={() => onItemClick(`${baseUrl}/${item.route}`)}
        >
          {item.name}
        </MenuItem>
      )
    ),
  );

  // navigation
  const home = () => onItemClick('/');

  // render menu
  return (
    <div>
      <MenuItem onClick={home}>
        Back to Resume
      </MenuItem>
      {menu}
    </div>
  );
};

Menu.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  onItemClick: types.func,
};

export default Menu;
