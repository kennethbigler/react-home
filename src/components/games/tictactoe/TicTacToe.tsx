import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import History, { HistoryEntry } from './History';
import Board from './Board';
import { X, O, getTurn } from './constants';

interface TicTacToeState {
  history: HistoryEntry[];
  turn: string;
  step: number;
}

const EMPTY = undefined;

// constants and helper functions
const getNewGameVars = (): TicTacToeState => ({
  history: [{ board: Array(9).fill(EMPTY) }],
  turn: X,
  step: 0,
});

/** function to check if there are 3 in a row
 * @return {Object} value of winner and positions for winner
 */
function calculateWinner(board: string[] | undefined[]): { winner?: string; winRow: [number?, number?, number?] } {
  const lines: [number, number, number][] = [
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
    [2, 4, 6],
  ];
  // check each win condition
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    // if all 3 match and aren't empty
    if (board[a] !== EMPTY && board[a] === board[b] && board[a] === board[c]) {
      // return winner and winning positions
      return { winner: board[a], winRow: lines[i] };
    }
  }
  return { winner: undefined, winRow: []};
}

const paperStyles: React.CSSProperties = { width: 343, display: 'block', margin: 'auto' };

/* TicTacToe  ->  Header
 *           |->  Board  ->  Cell
 *           |->  History */
export default class TicTacToe extends Component<{}, TicTacToeState> {
  constructor(props: {}) {
    super(props);
    this.state = getNewGameVars();
  }

  /** function that modifies board with appropriate turn
   * @param {number} location - location of board click (row * 3 + col)
   */
  handleClick = (location: number): void => {
    const { turn, step, history } = this.state;
    const newHistory = history.slice(0, step + 1);
    const current = newHistory[step];
    const board = current.board.slice();

    // game is over or cell is full
    if (!calculateWinner(board).winner && board[location] === EMPTY) {
      // place marker, then update turn
      board[location] = turn;

      // update board state
      this.setState({
        history: newHistory.concat([{ board, location }]),
        step: newHistory.length,
        turn: turn === X ? O : X,
      });
    }
  };

  /** function that resets game back to it's initial state */
  newGame = (): void => {
    this.setState(getNewGameVars());
  };

  /** function that modifies board to go back to a previous point in history
   * @param {number} step - desired point in history
   */
  jumpToStep = (step: number): void => {
    const { step: stepNo, history } = this.state;
    const state: TicTacToeState = { step, turn: getTurn(step), history };
    // Double click will eliminate all other history if there is any
    if (step === stepNo) {
      state.history = history.slice(0, stepNo + 1);
    }
    // update board to previous state, non-permanent, history exists still
    this.setState(state);
  };

  render(): React.ReactNode {
    const { history, turn, step } = this.state;
    const current = history[step];
    const board = current.board.slice();
    const { winner, winRow } = calculateWinner(board);

    return (
      <>
        <Typography variant="h2" gutterBottom>Tic-Tac-Toe</Typography>
        <Paper elevation={2} style={paperStyles}>
          <Header newGame={this.newGame} turn={turn} winner={winner} />
          <Board
            board={board}
            onClick={this.handleClick}
            winRow={winRow}
          />
        </Paper>
        <History history={history} jumpToStep={this.jumpToStep} step={step} />
      </>
    );
  }
}
