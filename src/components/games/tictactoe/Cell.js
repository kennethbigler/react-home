import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import indigo from '@material-ui/core/colors/indigo';
// Parents: Board

/* ========================================
 * Cell
 * ======================================== */
export const Cell = (props) => {
  const {value, winner, onClick} = props;
  // add attributes if cell is a winner
  const attr = winner ? {color: 'white', backgroundColor: indigo.A700} : null;

  return (
    <Button onClick={onClick} style={attr}>
      {value}
    </Button>
  );
};

Cell.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  onClick: types.func.isRequired,
  value: types.string.isRequired,
  winner: types.bool.isRequired,
};
