import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { white, indigoA700 } from 'material-ui/styles/colors';

// constants and helper functions
const X = 'X';
const O = 'O';
const getTurn = n => (n % 2 ? O : X);
const getNewGameVars = () => {
  return { history: [{ board: Array(9).fill(' ') }], turn: X, step: 0 };
};

/**
 * function to check if there are 3 in a row
 * @param {array} board - array for board, 3 cells per 3 rows (0-8)
 * @return {Object} value of winner and positions for winner
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
      // return winner and winning positions
      return { winner: board[a], winRow: line };
    }
  }
  return { winner: null, winRow: [] };
}

/** ========================================
 * Cell
 * ======================================== */
function Cell(props) {
  const { value, winner, onTouchTap } = props;
  // add attributes if cell is a winner
  const attr = winner
    ? {
        style: { color: white },
        backgroundColor: indigoA700,
        hoverColor: indigoA700,
        rippleColor: indigoA700
      }
    : null;

  return <FlatButton label={value} {...attr} onTouchTap={() => onTouchTap()} />;
}
Cell.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  value: PropTypes.string.isRequired,
  winner: PropTypes.bool.isRequired,
  onTouchTap: PropTypes.func.isRequired
};

/** ========================================
 * Board
 * ======================================== */
class Board extends Component {
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
Board.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  winRow: PropTypes.array.isRequired,
  board: PropTypes.array.isRequired,
  onTouchTap: PropTypes.func.isRequired
};

/** ========================================
 * Header
 * ======================================== */
function Header(props) {
  const { winner, turn, newGame } = props;
  // status text
  let status = winner ? `Winner: ${winner}` : `Turn: ${turn}`;

  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarTitle text={status} />
      </ToolbarGroup>
      <ToolbarGroup lastChild>
        <RaisedButton label="Reset Game" onTouchTap={newGame} primary />
      </ToolbarGroup>
    </Toolbar>
  );
}
Header.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  winner: PropTypes.string,
  turn: PropTypes.string.isRequired,
  newGame: PropTypes.func.isRequired
};

/** ========================================
 * History
 * ======================================== */
class History extends Component {
  constructor(props) {
    super(props);
    this.state = { ascend: true };
  }

  /** function that toggles asc vs. desc */
  handleMoveOrderToggle = () => {
    this.setState({ ascend: !this.state.ascend });
  };

  /**
   * function that generates text for the history tracker
   * @param {Object} round - contains board and click location for turn
   * @param {number} move - just index tracking
   */
  getHistoryText = (round, move) => {
    const { step, jumpToStep } = this.props;
    // generate description text
    const description = !move
      ? 'Game Start (Turn, Col, Row)'
      : `Move #${move} (${getTurn(move - 1)}, ` +
        `${Math.floor(round.location / 3)}, ${round.location % 3})`;
    // highlight current turn displayed on board
    const style = step === move ? { fontWeight: 'bold' } : {};
    return (
      <li key={move}>
        <a style={style} onTouchTap={() => jumpToStep(move)}>
          {description}
        </a>
      </li>
    );
  };

  render() {
    const { ascend } = this.state;
    const { history } = this.props;
    // move history
    const moves = history.map(this.getHistoryText);
    // asc vs. desc
    const buttonLabel = ascend ? 'Asc' : 'Desc';
    !ascend && moves.reverse();

    return (
      <div>
        <RaisedButton
          label={buttonLabel}
          onTouchTap={this.handleMoveOrderToggle}
        />
        <ul>{moves}</ul>
      </div>
    );
  }
}
History.propTypes = {
  //  PropTypes = [string, object, bool, number, func, array].isRequired
  step: PropTypes.number.isRequired,
  history: PropTypes.array.isRequired,
  jumpToStep: PropTypes.func.isRequired
};

/** ========================================
 * TicTacToe Game Logic
 * ======================================== */
export class TicTacToe extends Component {
  constructor() {
    super();
    this.state = getNewGameVars();
    this.styles = { paper: { width: 343, display: 'block', margin: 'auto' } };
  }

  /**
   * function that modifies board with appropriate turn
   * @param {number} location - locaiton of board click (row * 3 + col)
   */
  handleTouchTap = location => {
    let { turn, step, history } = this.state;
    const newHistory = history.slice(0, step + 1);
    const current = newHistory[step];
    const board = current.board.slice();

    // game is over or cell is full
    if (!calculateWinner(board).winner && board[location] === ' ') {
      // place marker, then update turn
      board[location] = turn;

      // update board state
      this.setState({
        history: newHistory.concat([{ board, location }]),
        step: newHistory.length,
        turn: turn === X ? O : X
      });
    }
  };

  /** function that resets game back to it's initial state */
  newGame = () => {
    this.setState(getNewGameVars());
  };

  /**
   * function that modifies board to go back to a previous point in history
   * @param {number} step - desired point in history
   */
  jumpToStep = step => {
    const { step: stepNo, history } = this.state;
    const state = { step, turn: getTurn(step) };
    // Double click will eliminate all other history if there is any
    if (step === stepNo) {
      state['history'] = history.slice(0, stepNo + 1);
    }
    // update board to previous state, non-permanent, history exists still
    this.setState(state);
  };

  render() {
    const { history, turn, step } = this.state;
    const current = history[step];
    const board = current.board.slice();
    const { winner, winRow } = calculateWinner(board);

    return (
      <div>
        <Paper style={this.styles.paper} zDepth={2}>
          <Header winner={winner} turn={turn} newGame={this.newGame} />
          <Board
            board={board}
            winRow={winRow}
            onTouchTap={i => this.handleTouchTap(i)}
          />
        </Paper>
        <History step={step} history={history} jumpToStep={this.jumpToStep} />
      </div>
    );
  }
}
