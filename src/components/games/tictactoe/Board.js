import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cell } from './Cell';
// Parents: TicTacToe

/** ========================================
 * Board
 * ======================================== */
export class Board extends Component {
  static propTypes = {
    // PropTypes = [string, object, bool, number, func, array].isRequired
    winRow: PropTypes.array.isRequired,
    board: PropTypes.array.isRequired,
    onTouchTap: PropTypes.func.isRequired
  };

  /** function to render the cells of the Board */
  renderCells = () => {
    const { board, onTouchTap, winRow } = this.props;
    let cells = [];
    // create 3 rows
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      let row = [];
      for (let j = 0; j < 3; j += 1) {
        const c = i * 3 + j;
        // check if winning position
        const winner = winRow.indexOf(c) !== -1;
        row.push(
          <td key={`${i},${j}`}>
            <Cell
              value={board[c]}
              winner={winner}
              onTouchTap={() => onTouchTap(c)}
            />
          </td>
        );
      }
      // separate into rows
      cells.push(<tr key={`row${i}`}>{row}</tr>);
    }
    // return wrapped element
    return <tbody>{cells}</tbody>;
  };

  render() {
    return <table className="table table-bordered">{this.renderCells()}</table>;
  }
}
