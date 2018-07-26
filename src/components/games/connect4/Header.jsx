import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Piece from './Piece';
// Parents: GameBoard

/* ========================================
 * Header
 * ======================================== */
const Header = (props) => {
  const { winner, turn, newGame } = props;
  // status text
  const status = winner ? 'Winner:' : 'Turn:';
  const piece = winner || turn;

  return (
    <Toolbar>
      <Typography color="inherit" style={{ marginRight: 10 }} variant="title">
        {status}
      </Typography>
      <Piece piece={piece} />
      <div style={{ flex: 1 }} />
      <Button
        color="primary"
        onClick={newGame}
        style={{ float: 'right' }}
        variant="raised"
      >
        Reset Game
      </Button>
    </Toolbar>
  );
};

Header.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  newGame: types.func.isRequired,
  turn: types.number.isRequired,
  winner: types.number,
};

export default Header;
