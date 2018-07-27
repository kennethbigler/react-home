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
const Piece = (props) => {
  const { piece, enabled, onClick } = props;

  let color = null;
  switch (piece) {
    case undefined:
      color = null;
      break;
    case 0:
      color = null;
      break;
    case 1:
      color = red[500];
      break;
    case 2:
      color = 'black';
      break;
    default:
      color = lightGreen[600];
      break;
  }

  const style = { backgroundColor: color };

  return !enabled ? (
    <Button disabled mini style={style} variant="fab">
      <div />
    </Button>
  ) : (
    <Button mini onClick={onClick} style={style} variant="fab">
      <ContentAdd style={{ color: 'white' }} />
    </Button>
  );
};

Piece.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  enabled: types.bool,
  onClick: types.func,
  piece: types.number.isRequired,
};

export default Piece;
