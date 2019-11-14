import React from 'react';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface HeaderProps {
  newGame: React.MouseEventHandler;
  turn: string;
  winner?: string;
}

const Header: React.FC<HeaderProps> = React.memo((props: HeaderProps) => {
  const { winner, turn, newGame } = props;
  // status text
  const status = winner ? `Winner: ${winner}` : `Turn: ${turn}`;

  return (
    <Toolbar>
      <Typography style={{ flex: 1 }} variant="h6">
        {status}
      </Typography>
      <Button color="primary" onClick={newGame} variant="contained">
        Reset Game
      </Button>
    </Toolbar>
  );
});

export default Header;
