import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import GameBoard from './GameBoard';
import { Turn } from './types';
// Parents: Main

// dp constants
const PIECE = 0;
const STREAK = 1;
const MAX = 2;
const NEW_BOARD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

interface Connect4State {
  board: number[][];
  winner?: number;
  line: [number | undefined, [number, number][] | undefined, [number, number][] | undefined];
  turn: Turn;
}

/** start a new game */
const getNewGame = (): Connect4State => ({
  board: NEW_BOARD.reduce(
    (acc: number[][], row) => {
      acc.push([...row]);
      return acc;
    },
    [],
  ),
  winner: undefined,
  line: [undefined, undefined, undefined],
  turn: Turn.RED,
});

/* Connect4  ->  GameBoard  ->  Header  ->  Piece
 *                         |->  Board   ->  Piece */
export default class Connect4 extends Component<{}, Connect4State> {
  constructor(props: {}) {
    super(props);
    this.state = getNewGame();
  }

  /** start a new game
   * immutably reset the board and helper vars in state
   */
  newGame = (): void => {
    this.setState(getNewGame());
  };

  /** update turn, alternating red/black */
  updateTurn = (): void => {
    const { turn } = this.state;
    this.setState({ turn: turn === Turn.RED ? Turn.BLACK : Turn.RED });
  };

  /** insert piece into the board, piece falls to the bottom row every time */
  insert = (col: number): void => {
    const { board, turn, winner } = this.state;
    // check to see if there is an empty spot left
    if (!winner && !board[board.length - 1][col]) {
      let i = 0;
      // look for the lowest empty spot
      while (board[i][col] !== 0) {
        i += 1;
      }
      // insert element
      board[i][col] = turn;
      // update turn
      this.updateTurn();
      // check if win
      this.evalConnect4(i, col);
    }
  };

  /** function to check for match and increment streak / max
   * @param {array} line - dp storage, [PIECE, STREAK, MAX]
   */
  helpEvalConnect4 = (row: number, col: number, line: [number, [number, number][], [number, number][]]): void => {
    const { board } = this.state;
    // verify row
    if (board[row] !== undefined) {
      const piece = board[row][col];
      // verify piece
      if (piece !== undefined) {
        // check piece
        if (piece === line[PIECE] && piece !== Turn.EMPTY) {
          // matches, increment streak and max if needed
          line[STREAK].push([row, col]);
          // update max and Win row if needed
          if (line[STREAK].length > line[MAX].length) {
            line[MAX] = [...line[STREAK]];
          }
        } else {
          // doesn't match, restart streak
          line[PIECE] = piece;
          line[STREAK] = [[row, col]];
        }
      }
    }
  };

  /** function to evaluate a connect 4 board based off the last piece played
   * NOTE: win condition will be within +-3 of the piece last played - O(N)
   * updates state of winner and board for highlighting
   */
  evalConnect4 = (row: number, col: number): void => {
    // variables to track streaks
    const dp: [number, [number, number][], [number, number][]][] = [];
    for (let i = 0; i < 4; i += 1) {
      const a1: [number, number][] = [];
      const a2: [number, number][] = [];
      dp.push([0, a1, a2]);
    }

    // win will be contained w/in +-3 of the token placed
    for (let i = -3; i <= 3; i += 1) {
      // check for streaks
      // vertical
      this.helpEvalConnect4(row + i, col, dp[0]);
      // horizontal
      this.helpEvalConnect4(row, col + i, dp[1]);
      // diagonal down
      this.helpEvalConnect4(row + i, col + i, dp[2]);
      // diagonal up
      this.helpEvalConnect4(row - i, col + i, dp[3]);
    }

    dp.forEach((line) => {
      if (line[MAX].length >= 4) {
        const { board, turn } = this.state;
        line[MAX].forEach((t) => {
          board[t[0]][t[1]] = 3;
        });
        this.setState({ winner: turn, board });
      }
    });
  };

  /** function to evaluate a connect 4 board based off the last piece played
   * O(N^2) - is there a winner on the board?
   */
  isConnect4 = (): boolean => {
    const { board } = this.state;
    const numRows = board.length;
    const numCols = board[0].length;
    // variables to track streaks
    const dp: [number, [number, number][], [number, number][]][] = [];
    for (let i = 0; i < 6; i += 1) {
      const a1: [number, number][] = [];
      const a2: [number, number][] = [];
      dp.push([0, a1, a2]);
    }

    // iterate over looking for 4 in a row
    for (let i = 0; i < numCols; i += 1) {
      for (let j = 0; j < numCols; j += 1) {
        // vertical
        this.helpEvalConnect4(j, i, dp[0]);
        // horizontal
        this.helpEvalConnect4(i, j, dp[1]);
        if (i >= 0 && i <= 2) {
          // diagonal down top half
          this.helpEvalConnect4(i + j, j, dp[2]);
          // diagonal down bottom half
          this.helpEvalConnect4(j, i + j + 1, dp[3]);
          // diagonal up top half
          this.helpEvalConnect4(3 + i - j, j, dp[4]);
          // diagonal up bottom half
          this.helpEvalConnect4(numRows - 1 - j, 1 + j + i, dp[5]);
        }
      }
    }

    return dp.reduce(
      (acc: boolean, line: [number, [number, number][], [number, number][]]) => acc || line[MAX].length >= 4,
      false,
    );
  };

  render(): React.ReactNode {
    const { board, turn, winner } = this.state;
    return (
      <>
        <Typography variant="h2" gutterBottom>Welcome to Ken&apos;s Connect4 Game</Typography>
        <GameBoard
          board={board}
          insert={this.insert}
          newGame={this.newGame}
          turn={turn}
          winner={winner}
        />
      </>
    );
  }
}
