import React from 'react';
import types from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { white, indigoA700 } from 'material-ui/styles/colors';
// Parents: Board

/** ========================================
 * Cell
 * ======================================== */
export const Cell = props => {
  const { value, winner, onClick } = props;
  // add attributes if cell is a winner
  const attr = winner
    ? {
        style: { color: white },
        backgroundColor: indigoA700,
        hoverColor: indigoA700,
        rippleColor: indigoA700
      }
    : null;

  return <FlatButton label={value} {...attr} onClick={() => onClick()} />;
};

Cell.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  value: types.string.isRequired,
  winner: types.bool.isRequired,
  onClick: types.func.isRequired
};
