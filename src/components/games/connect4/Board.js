import React from 'react';
import {Piece} from './Piece';
import types from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
// Parents: GameBoard

const styles = {cell: {padding: 1, textAlign: 'center'}};

/* --------------------------------------------------
* Board - for Connect4
* -------------------------------------------------- */
export const Board = (props) => {
  const {board, turn, insert} = props;
  // generate code for Connect4 Board
  const gameBoard = map(board, (arr, i) => {
    const row = map(arr, (piece, j) => (
      <TableCell key={`c4c${i},${j}`} style={styles.cell}>
        <Piece piece={piece} />
      </TableCell>
    ));
    return <TableRow key={`c4r${i}`}>{row}</TableRow>;
  }).reverse();
  // generate buttons to play pieces based off top board row
  const gameButtons = map(board[board.length - 1], (piece, i) => (
    <TableCell key={`c4h${i}`} style={styles.cell}>
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
        <TableRow>{gameButtons}</TableRow>
      </TableHead>
      <TableBody>{gameBoard}</TableBody>
    </Table>
  );
};

Board.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  board: types.arrayOf(types.arrayOf(types.number)).isRequired,
  insert: types.func.isRequired,
  turn: types.number.isRequired,
};
