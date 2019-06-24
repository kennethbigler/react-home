import React from 'react';
import types from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import Piece from './Piece';
// Parents: GameBoard

/* --------------------------------------------------
* Board - for Connect4
* -------------------------------------------------- */
const Board = (props) => {
  const { board, turn, insert } = props;
  // styles
  const styles = { padding: 1, textAlign: 'center' };
  // generate code for Connect4 Board
  const gameBoard = map(board, (arr, i) => {
    const row = map(arr, (piece, j) => (
      <TableCell key={`c4c${i},${j}`} style={styles}>
        <Piece piece={piece} />
      </TableCell>
    ));
    return (
      <TableRow key={`c4r${i}`}>
        {row}
      </TableRow>
    );
  }).reverse();
  // generate buttons to play pieces based off top board row
  const gameButtons = map(board[board.length - 1], (piece, i) => (
    <TableCell key={`c4h${i}`} style={styles}>
      <Piece
        enabled={!piece}
        onClick={() => insert(i)}
        piece={!piece ? turn : 0}
      />
    </TableCell>
  ));

  return (
    <Table>
      <TableHead>
        <TableRow>
          {gameButtons}
        </TableRow>
      </TableHead>
      <TableBody>
        {gameBoard}
      </TableBody>
    </Table>
  );
};

Board.propTypes = {
  board: types.arrayOf(types.arrayOf(types.number)).isRequired,
  insert: types.func.isRequired,
  turn: types.number.isRequired,
};

export default Board;
