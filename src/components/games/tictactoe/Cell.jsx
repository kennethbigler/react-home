import React, { memo } from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import indigo from '@material-ui/core/colors/indigo';
// Parents: Board

/* ========================================
 * Cell
 * ======================================== */
const Cell = memo((props) => {
  const { value, winner, onClick } = props;
  // add attributes if cell is a winner
  const attr = winner ? { color: 'white', backgroundColor: indigo.A700 } : null;

  return (
    <Button onClick={onClick} style={attr}>
      {value || <br />}
    </Button>
  );
});

Cell.propTypes = {
  onClick: types.func.isRequired,
  value: types.string,
  winner: types.bool.isRequired,
};

export default Cell;
