import React from 'react';
import PropTypes from 'prop-types';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { black, red500, indigoA700 } from 'material-ui/styles/colors';
// Parents: Board, Header

/* --------------------------------------------------
* Board - for Connect4
* -------------------------------------------------- */
export const Piece = props => {
  const { piece, enabled, onTouchTap } = props;
  const color = !piece
    ? null
    : piece === 1 ? red500 : piece === 2 ? black : indigoA700;

  return !enabled ? (
    <FloatingActionButton disabledColor={color} mini disabled />
  ) : (
    <FloatingActionButton backgroundColor={color} onTouchTap={onTouchTap} mini>
      <ContentAdd />
    </FloatingActionButton>
  );
};

Piece.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  piece: PropTypes.number.isRequired,
  enabled: PropTypes.bool,
  onTouchTap: PropTypes.func
};
