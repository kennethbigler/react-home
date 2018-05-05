import React, { Component } from 'react';
import { GameBoard } from './GameBoard';
// Parents: Main

// dp constants
export const EMPTY = 0;
export const RED = 1;
export const BLACK = 2;
const PIECE = 0;
const STREAK = 1;
const MAX = 2;
const NEW_BOARD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

/** start a new game
 * @return {Object} new board, empty winner, empty win line, turn to red
 */
const getNewGame = () => ({
  board: NEW_BOARD.reduce((acc, row) => {
    acc.push([...row]);
    return acc;
  }, []),
  winner: null,
  line: [],
  turn: RED
});

export class Connect4 extends Component {
  constructor(props) {
    super(props);
    this.state = getNewGame();
  }

  /** start a new game
   * @return immutably reset the board and helper vars in state
   */
  newGame = () => {
    this.setState(getNewGame());
  };

  /** update turn, alternating red/black */
  updateTurn = () => {
    const { turn } = this.state;
    this.setState({ turn: turn === RED ? BLACK : RED });
  };

  /** insert piece into the board, piece falls to the bottom row every time
   * @param {number} - column number
   */
  insert = col => {
    let { board, turn, winner } = this.state;
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
   * @param {number} row - row of piece
   * @param {number} col - col of piece
   * @param {array} line - dp storage, [PIECE, STREAK, MAX]
   */
  helpEvalConnect4 = (row, col, line) => {
    const { board } = this.state;
    // verify row
    if (board[row] !== undefined) {
      const piece = board[row][col];
      // verify piece
      if (piece !== undefined) {
        // check piece
        if (piece === line[PIECE] && piece !== EMPTY) {
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
   * NOTE: win condition will be within +-3 of the piece last played
   * O(N)
   * @param {number} row - row location of play
   * @param {number} col - col location of play
   * @return - updates state of winner and board for highlighting
   */
  evalConnect4 = (row, col) => {
    // variables to track streaks
    let dp = [];
    for (let i = 0; i < 4; i += 1) {
      dp.push([0, [], []]);
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

    dp.forEach(line => {
      if (line[MAX].length >= 4) {
        let { board } = this.state;
        line[MAX].forEach(t => (board[t[0]][t[1]] = 3));
        this.setState({ winner: this.state.turn, board });
      }
    });
  };

  /** function to evaluate a connect 4 board based off the last piece played
   * O(N^2)
   * @return {boolean} - is there a winner on the board?
   */
  isConnect4 = () => {
    const numRows = this.state.board.length;
    const numCols = this.state.board[0].length;
    // variables to track streaks
    let dp = [];
    for (let i = 0; i < 6; i += 1) {
      dp.push([0, [], []]);
    }
    // iterate over looking for 4 in a row
    for (let i = 0; i < numCols; i += 1) {
      for (let j = 0; j < numCols; j += 1) {
        // vertical
        this.helpEvalConnect4(j, i, dp[0]);
        // horizontal
        this.helpEvalConnect4(i, j, dp[1]);
        if (0 <= i && i <= 2) {
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
    return dp.reduce((a, c) => a || c[MAX].length >= 4, false);
  };

  render() {
    const { board, turn, winner } = this.state;
    return (
      <GameBoard
        board={board}
        insert={this.insert}
        winner={winner}
        turn={turn}
        newGame={this.newGame}
      />
    );
  }
}
