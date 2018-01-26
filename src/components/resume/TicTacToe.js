import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

const X = 'X';
const O = 'O';
const styles = { button: { margin: 12 } };

/** function to check if there are 3 in a row */
function calculateWinner(board) {
  const lines = [
    // horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonal
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// ========================================
// Cell
// ========================================
function Cell(props) {
  return (
    <RaisedButton
      label={props.value}
      onTouchTap={() => props.onTouchTap()}
      style={styles.button}
    />
  );
}
Cell.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  value: PropTypes.string.isRequired,
  onTouchTap: PropTypes.func.isRequired
};

// ========================================
// Board
// ========================================
class Board extends Component {
  /** function to render the cells of the Board */
  renderCells = () => {
    const { board, onTouchTap } = this.props;
    const cells = [];
    // create 3 rows
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells
      for (let j = 0; j < 3; j += 1) {
        let c = i * 3 + j;
        cells.push(
          <Cell
            key={`${i},${j}`}
            value={board[c]}
            onTouchTap={() => onTouchTap(c)}
          />
        );
      }
      // separate into rows
      cells.push(<br key={`row${i}`} />);
    }
    // return wrapped element
    return <div>{cells}</div>;
  };
  render() {
    return <div>{this.renderCells()}</div>;
  }
}
Board.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  board: PropTypes.array.isRequired,
  onTouchTap: PropTypes.func.isRequired
};

// ========================================
// TicTacToe Game
// ========================================
export class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      board: Array(9).fill(' '),
      turn: X
    };
  }
  handleClick = i => {
    let { board, turn } = this.state;
    // game is over or square is full
    if (calculateWinner(board) || board[i] !== ' ') {
      return;
    }
    // place marker, then update turn
    board[i] = turn;
    turn = turn === X ? O : X;
    // update board state
    this.setState({ board, turn });
  };

  newGame = () => {
    const board = Array(9).fill(' ');
    const turn = X;
    this.setState({ board, turn });
  };

  render() {
    const { board, turn } = this.state;
    const winner = calculateWinner(board);

    let status = winner ? `Winner: ${winner}` : `Turn: ${turn}`;

    return (
      <div>
        <div>{status}</div>
        <Board board={board} onTouchTap={i => this.handleClick(i)} />
        <RaisedButton
          label="Reset Game"
          onTouchTap={this.newGame}
          style={styles.button}
        />
      </div>
    );
  }
}
