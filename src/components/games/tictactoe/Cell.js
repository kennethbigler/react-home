import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { white, indigoA700 } from 'material-ui/styles/colors';
// Parents: Board

/** ========================================
 * Cell
 * ======================================== */
export const Cell = props => {
  const { value, winner, onTouchTap } = props;
  // add attributes if cell is a winner
  const attr = winner
    ? {
        style: { color: white },
        backgroundColor: indigoA700,
        hoverColor: indigoA700,
        rippleColor: indigoA700
      }
    : null;

  return <FlatButton label={value} {...attr} onTouchTap={() => onTouchTap()} />;
};

Cell.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  value: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired,
  onTouchTap: PropTypes.func.isRequired
};
