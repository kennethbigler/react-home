import React from 'react';
import types from 'prop-types';
import ContentAdd from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import lightGreen from '@material-ui/core/colors/lightGreen';
// Parents: Board, Header

/* --------------------------------------------------
* Board - for Connect4
* -------------------------------------------------- */
export const Piece = (props) => {
  const {piece, enabled, onClick} = props;
  const color = {
    backgroundColor: !piece
      ? null
      : piece === 1 ? red[500] : piece === 2 ? 'black' : lightGreen[600],
  };

  return !enabled ? (
    <Button disabled mini style={color} variant="fab">
      <div />
    </Button>
  ) : (
    <Button mini onClick={onClick} style={color} variant="fab">
      <ContentAdd style={{color: 'white'}} />
    </Button>
  );
};

Piece.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  enabled: types.bool,
  onClick: types.func,
  piece: types.number.isRequired,
};
