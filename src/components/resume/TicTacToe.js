import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

// constants and helper functions
const X = 'X';
const O = 'O';
const styles = { paper: { width: 343, display: 'block', margin: 'auto' } };
const getTurn = n => (n % 2 ? O : X);

/**
 * function to check if there are 3 in a row
 * @param {array} board - array for board, 3 cells per 3 rows (0-8)
 * @return {string} turn value for winner or null
 */
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
  // check each win condition
  for (let line of lines) {
    const [a, b, c] = line;
    // if all 3 match and aren't empty
    if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/** ========================================
 * Cell
 * ======================================== */
function Cell(props) {
  return (
    <FlatButton label={props.value} onTouchTap={() => props.onTouchTap()} />
  );
}
Cell.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  value: PropTypes.string.isRequired,
  onTouchTap: PropTypes.func.isRequired
};

/** ========================================
 * Board
 * ======================================== */
class Board extends Component {
  /** function to render the cells of the Board */
  renderCells = () => {
    const { board, onTouchTap } = this.props;
    let cells = [];
    // create 3 rows
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      let row = [];
      for (let j = 0; j < 3; j += 1) {
        let c = i * 3 + j;
        row.push(
          <td key={`${i},${j}`}>
            <Cell value={board[c]} onTouchTap={() => onTouchTap(c)} />
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
Board.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  board: PropTypes.array.isRequired,
  onTouchTap: PropTypes.func.isRequired
};

/** ========================================
 * TicTacToe Game Logic
 * ======================================== */
export class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      history: [{ board: Array(9).fill(' ') }],
      turn: X,
      step: 0,
      ascend: true
    };
  }

  /**
   * function that modifies board with appropriate turn
   * @param {number} i - locaiton of board click (row * 3 + col)
   */
  handleTouchTap = i => {
    let { turn, step } = this.state;
    const history = this.state.history.slice(0, step + 1);
    const current = history[step];
    const board = current.board.slice();

    // game is over or cell is full
    if (calculateWinner(board) || board[i] !== ' ') {
      return;
    }

    // place marker, then update turn
    board[i] = turn;

    // update board state
    this.setState({
      history: history.concat([{ board: board, location: i }]),
      step: history.length,
      turn: turn === X ? O : X
    });
  };

  /** function that resets game back to it's initial state */
  newGame = () => {
    this.setState({
      history: [{ board: Array(9).fill(' ') }],
      turn: X,
      step: 0
    });
  };

  /**
   * function that modifies board to go back to a previous point in history
   * @param {number} stepNo - desired point in history
   */
  jumpToStep = stepNo => {
    const { step } = this.state;
    const turn = getTurn(stepNo);
    // Double click will eliminate all other history if there is any
    if (step === stepNo) {
      const history = this.state.history.slice(0, step + 1);
      this.setState({ history, step: stepNo, turn });
    } else {
      // update board to previous state, non-permanent, history exists still
      this.setState({ step: stepNo, turn });
    }
  };

  /**
   * function that generates text for the history tracker
   * @param {Object} round - contains board and click location for turn
   * @param {number} move - just index tracking
   */
  getHistoryText = (round, move) => {
    const { step } = this.state;
    // generate description text
    const description = !move
      ? 'Game Start (Turn, Col, Row)'
      : `Move #${move} (${getTurn(move - 1)}, ` +
        `${Math.floor(round.location / 3)}, ${round.location % 3})`;
    // highlight current turn displayed on board
    const style = step === move ? { fontWeight: 'bold' } : {};
    return (
      <li key={move}>
        <a style={style} onTouchTap={() => this.jumpToStep(move)}>
          {description}
        </a>
      </li>
    );
  };

  /** function that toggles asc vs. desc */
  handleMoveOrderToggle = () => {
    const { ascend } = this.state;
    this.setState({ ascend: !ascend });
  };

  render() {
    const { history, turn, step, ascend } = this.state;
    const current = history[step];
    const board = current.board.slice();
    const winner = calculateWinner(board);

    // status text
    let status = winner ? `Winner: ${winner}` : `Turn: ${turn}`;
    // move history
    const moves = history.map(this.getHistoryText);
    // asc vs. desc
    const buttonLabel = ascend ? 'Asc' : 'Desc';
    !ascend && moves.reverse();

    return (
      <div>
        <Paper style={styles.paper} zDepth={2}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={status} />
            </ToolbarGroup>
            <ToolbarGroup lastChild>
              <RaisedButton
                label="Reset Game"
                onTouchTap={this.newGame}
                primary
              />
            </ToolbarGroup>
          </Toolbar>
          <Board board={board} onTouchTap={i => this.handleTouchTap(i)} />
        </Paper>
        <RaisedButton
          label={buttonLabel}
          onTouchTap={this.handleMoveOrderToggle}
        />
        <ul>{moves}</ul>
      </div>
    );
  }
}

// When someone wins, highlight the three squares that caused the win.
