import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { Board } from './Board';
import { Header } from './Header';
// Parents: Connect4

const styles = {
  paper: { maxWidth: 900, minWidth: 300, display: 'block', margin: 'auto' }
};

/* --------------------------------------------------
* Slot Machine
* -------------------------------------------------- */
export const GameBoard = props => {
  const { board, insert, winner, turn, newGame } = props;
  return (
    <div>
      <h1>Welcome to Ken's Connect4 Game</h1>
      <Paper style={styles.paper} zDepth={2}>
        <Header winner={winner} turn={turn} newGame={newGame} />
        <Board board={board} turn={turn} insert={insert} />
      </Paper>
    </div>
  );
};

GameBoard.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  board: PropTypes.array.isRequired,
  insert: PropTypes.func.isRequired,
  winner: PropTypes.number,
  turn: PropTypes.number.isRequired,
  newGame: PropTypes.func.isRequired
};
