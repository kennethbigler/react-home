import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// Parents: TicTacToe

/* ========================================
 * Header
 * ======================================== */
export const Header = (props) => {
  const {winner, turn, newGame} = props;
  // status text
  let status = winner ? `Winner: ${winner}` : `Turn: ${turn}`;

  return (
    <Toolbar>
      <Typography color="inherit" style={{flex: 1}} variant="title">
        {status}
      </Typography>
      <Button color="primary" onClick={newGame} variant="raised">
        Reset Game
      </Button>
    </Toolbar>
  );
};

Header.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  newGame: types.func.isRequired,
  turn: types.string.isRequired,
  winner: types.string,
};
