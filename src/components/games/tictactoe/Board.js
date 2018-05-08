import React, {Component} from 'react';
import types from 'prop-types';
import {Cell} from './Cell';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {grey400} from 'material-ui/styles/colors';
import includes from 'lodash/includes';
// Parents: TicTacToe

/* ========================================
 * Board
 * ======================================== */
export class Board extends Component {
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    board: types.arrayOf(types.string).isRequired,
    onClick: types.func.isRequired,
    winRow: types.arrayOf(types.number).isRequired,
  };

  /* function to render the cells of the Board */
  renderCells = () => {
    const {board, onClick, winRow} = this.props;
    let cells = [];
    // create 3 rows
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      let row = [];
      for (let j = 0; j < 3; j += 1) {
        const c = i * 3 + j;
        // check if winning position
        const winner = includes(winRow, c);
        row.push(
          <TableRowColumn
            key={`${i},${j}`}
            style={{
              padding: 0,
              textAlign: 'center',
              border: `1px solid ${grey400}`,
            }}
          >
            <Cell onClick={() => onClick(c)} value={board[c]} winner={winner} />
          </TableRowColumn>
        );
      }
      // separate into rows
      cells.push(
        <TableRow displayBorder key={`row${i}`}>
          {row}
        </TableRow>
      );
    }
    // return wrapped element
    return <TableBody displayRowCheckbox={false}>{cells}</TableBody>;
  };

  render() {
    return <Table>{this.renderCells()}</Table>;
  }
}
