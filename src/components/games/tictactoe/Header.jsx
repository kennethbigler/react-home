import React, { memo } from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// Parents: TicTacToe

/* ========================================
 * Header
 * ======================================== */
const Header = memo((props) => {
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

Header.propTypes = {
  newGame: types.func.isRequired,
  turn: types.string.isRequired,
  winner: types.string,
};

export default Header;
