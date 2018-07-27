import React from 'react';
import types from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Board from './Board';
import Header from './Header';
// Parents: Connect4

/* --------------------------------------------------
* Slot Machine
* -------------------------------------------------- */
const GameBoard = (props) => {
  const {
    board, insert, winner, turn, newGame,
  } = props;
  return (
    <div>
      <h1>
        Welcome to Ken&apos;s Connect4 Game
      </h1>
      <Paper
        elevation={2}
        style={{
          maxWidth: 900,
          minWidth: 300,
          display: 'block',
          margin: 'auto',
          paddingBottom: 5,
        }}
      >
        <Header newGame={newGame} turn={turn} winner={winner} />
        <Board board={board} insert={insert} turn={turn} />
      </Paper>
    </div>
  );
};

GameBoard.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  board: types.arrayOf(types.array).isRequired,
  insert: types.func.isRequired,
  newGame: types.func.isRequired,
  turn: types.number.isRequired,
  winner: types.number,
};

export default GameBoard;
