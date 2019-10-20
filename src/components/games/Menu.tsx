import React, { memo } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import map from 'lodash/map';

interface MenuProps {
  onItemClick?: Function;
}

const Menu: React.FC<MenuProps> = memo((props: MenuProps) => {
  const { onItemClick } = props;
  const baseUrl = '/games';

  // internal routes
  const menu = map(
    [
      { name: 'Home - Games', route: '' },
      { divider: true },
      { name: 'BlackJack', route: 'blackjack' },
      { name: 'Connect4', route: 'connect4' },
      { name: 'Deal or No Deal', route: 'deal' },
      { name: 'Dota 2 Picker', route: 'dota2' },
      { name: 'Poker', route: 'poker' },
      { name: 'Slot Machine', route: 'slots' },
      { name: 'Tic-Tac-Toe', route: 'tictactoe' },
      { name: 'Yahtzee', route: 'yahtzee' },
    ],
    (item, index) => (item.divider
      ? (
        <Divider key={index} />
      ) : (
        <MenuItem
          key={item.name}
          onClick={(): void => onItemClick && onItemClick(`${baseUrl}/${item.route}`)}
        >
          {item.name}
        </MenuItem>
      )
    ),
  );

  // navigation
  const home = (): void => onItemClick && onItemClick('/');

  // render menu
  return (
    <>
      <MenuItem onClick={home}>
        Back to Resume
      </MenuItem>
      {menu}
    </>
  );
});

export default Menu;
