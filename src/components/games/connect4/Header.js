import React from 'react';
import types from 'prop-types';
import { Piece } from './Piece';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
// Parents: GameBoard

/** ========================================
 * Header
 * ======================================== */
export const Header = props => {
  const { winner, turn, newGame } = props;
  // status text
  let status = winner ? 'Winner: ' : 'Turn: ';
  let piece = winner ? winner : turn;

  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarTitle text={status} />
        <ToolbarTitle
          style={{ marginTop: '-16px' }}
          text={<Piece piece={piece} />}
        />
      </ToolbarGroup>
      <ToolbarGroup lastChild>
        <RaisedButton label="Reset Game" onClick={newGame} primary />
      </ToolbarGroup>
    </Toolbar>
  );
};

Header.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  newGame: types.func.isRequired,
  turn: types.number.isRequired,
  winner: types.number
};
