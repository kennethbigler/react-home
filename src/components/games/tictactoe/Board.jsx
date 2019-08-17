import React from 'react';
import types from 'prop-types';
// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
// functions
import includes from 'lodash/includes';
import Cell from './Cell';
// Parents: TicTacToe

/* ========================================
 * Board
 * ======================================== */
const Board = (props) => {
  const { board, onClick, winRow } = props;
  const cells = [];
  // create 3 rows
  for (let i = 0; i < 3; i += 1) {
    // create 3 cells in a row
    const row = [];
    for (let j = 0; j < 3; j += 1) {
      const c = i * 3 + j;
      // check if winning position
      const winner = includes(winRow, c);
      row.push(
        <TableCell
          key={`${i},${j}`}
          style={{
            padding: 0,
            textAlign: 'center',
            border: `1px solid ${grey[400]}`,
          }}
        >
          <Cell onClick={() => onClick(c)} value={board[c]} winner={winner} />
        </TableCell>,
      );
    }
    const boardRow = (
      <TableRow key={`row${i}`}>
        {row}
      </TableRow>
    );
    // separate into rows
    cells.push(boardRow);
  }

  return (
    <Table>
      <TableBody>
        {cells}
      </TableBody>
    </Table>
  );
};

Board.propTypes = {
  board: types.arrayOf(types.string).isRequired,
  onClick: types.func.isRequired,
  winRow: types.arrayOf(types.number).isRequired,
};

export default Board;
