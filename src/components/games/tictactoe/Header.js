import React from 'react';
import types from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
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
      <ToolbarGroup>
        <ToolbarTitle text={status} />
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
  turn: types.string.isRequired,
  winner: types.string,
};
