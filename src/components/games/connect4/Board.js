import React from 'react';
import { Piece } from './Piece';
import types from 'prop-types';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeader,
  TableHeaderColumn
} from 'material-ui/Table';
// Parents: GameBoard

const styles = { cell: { padding: 1, textAlign: 'center' } };

/* --------------------------------------------------
* Board - for Connect4
* -------------------------------------------------- */
export const Board = props => {
  const { board, turn, insert } = props;
  // generate code for Connect4 Board
  const gameBoard = board
    .map((arr, i) => {
      const row = arr.map((piece, j) => (
        <TableRowColumn key={`c4c${i},${j}`} style={styles.cell}>
          <Piece piece={piece} />
        </TableRowColumn>
      ));
      return <TableRow key={`c4r${i}`}>{row}</TableRow>;
    })
    .reverse();
  // generate buttons to play pieces based off top board row
  const gameButtons = board[board.length - 1].map((piece, i) => (
    <TableHeaderColumn key={`c4h${i}`} style={styles.cell}>
      <Piece
        piece={!piece ? turn : 0}
        onClick={() => insert(i)}
        enabled={!piece}
      />
    </TableHeaderColumn>
  ));

  return (
    <Table selectable={false} fixedHeader>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>{gameButtons}</TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>{gameBoard}</TableBody>
    </Table>
  );
};

Board.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  board: types.arrayOf(types.arrayOf(types.number)).isRequired,
  turn: types.number.isRequired,
  insert: types.func.isRequired
};
