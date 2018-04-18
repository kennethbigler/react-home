import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
// Parents: TicTacToe

/** ========================================
 * Header
 * ======================================== */
export const Header = props => {
  const { winner, turn, newGame } = props;
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
  // PropTypes = [string, object, bool, number, func, array].isRequired
  winner: PropTypes.string,
  turn: PropTypes.string.isRequired,
  newGame: PropTypes.func.isRequired
};
