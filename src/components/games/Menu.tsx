import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

interface MenuProps {
  onItemClick?: Function;
}

const Menu: React.FC<MenuProps> = React.memo((props: MenuProps) => {
  const { onItemClick } = props;
  const baseUrl = '/games';

  // internal routes
  const menu = React.useMemo(() => [
    { name: 'Home - Games', route: '' },
    { divider: true },
    { name: 'BlackJack', route: 'blackjack' },
    { name: 'Connect4', route: 'connect4' },
    { name: 'Deal or No Deal', route: 'deal' },
    { name: 'Poker', route: 'poker' },
    { name: 'Slot Machine', route: 'slots' },
    { name: 'Tic-Tac-Toe', route: 'tictactoe' },
    { name: 'Yahtzee', route: 'yahtzee' },
  ].map((item, index) => (item.divider
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
  )), [onItemClick]);

  // navigation
  const home = React.useCallback(
    (): void => onItemClick && onItemClick('/'),
    [onItemClick],
  );

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
