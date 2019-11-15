import React from 'react';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Piece from './Piece';
import { C4Turn } from '../../../store/types';

interface HeaderProps {
  newGame: React.MouseEventHandler;
  turn: C4Turn;
  winner?: number;
}

const Header: React.FC<HeaderProps> = React.memo((props: HeaderProps) => {
  const { winner, turn, newGame } = props;
  // status text
  const status = winner ? 'Winner:' : 'Turn:';
  const piece = winner || turn;

  return (
    <Toolbar>
      <div className="flex-container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography style={{ marginRight: 10 }} variant="h6">
            {status}
          </Typography>
          <Piece piece={piece} />
        </div>
        <Button color="primary" onClick={newGame} variant="contained">
          Reset Game
        </Button>
      </div>
    </Toolbar>
  );
});

export default Header;
