import React from 'react';
import types from 'prop-types';
import ContentAdd from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
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

  return !enabled
    ? (
      <Fab disabled size="small" style={style}>
        <div />
      </Fab>
    ) : (
      <Fab size="small" onClick={onClick} style={style}>
        <ContentAdd style={{ color: 'white' }} />
      </Fab>
    );
};

Piece.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  enabled: types.bool,
  onClick: types.func,
  piece: types.number.isRequired,
};

export default Piece;
