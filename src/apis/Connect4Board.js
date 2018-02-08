// dp constants
const EMPTY = 0;
const RED = 1;
const BLACK = 2;
const PIECE = 0;
const STREAK = 1;
const MAX = 2;

/** function to check for match and increment streak / max
 * @param {number} piece - 0 e, 1 r, 2 b
 * @param {array} line - dp storage, [PIECE, STREAK, MAX]
 */
function helpEvalConnect4(board, row, col, line) {
  // verify row
  if (board[row] !== undefined) {
    const piece = board[row][col];
    // verify piece
    if (piece !== undefined) {
      // check piece
      if (piece === line[PIECE] && piece !== EMPTY) {
        // matches, increment streak and max if needed
        line[STREAK] += 1;
        line[MAX] = Math.max(line[STREAK], line[MAX]);
      } else {
        // doesn't match, restart streak
        line[PIECE] = piece;
        line[STREAK] = 1;
      }
    }
  }
}

//export
const Connect4Board = {
  // board for immutable reset
  newBoard: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  // board the game is played on
  board: [],
  turn: RED,
  /** immutably reset the board */
  getNewBoard: function() {
    this.board = this.newBoard.reduce((acc, row) => acc.push([...row]), []);
  },

  updateTurn: function() {
    this.turn = this.turn === RED ? BLACK : RED;
  },

  /** insert piece into the board */
  insert: function(col) {
    // check to see if there is an empty spot left
    if (!this.board[this.board.length - 1][col]) {
      let i = 0;
      // look for the lowest empty spot
      while (this.board[i][col] !== 0) {
        i += 1;
      }
      // insert element
      this.board[i][col] = this.turn;
      // update turn
      this.updateTurn();
    }
  },

  /** function to evaluate a connect 4 board based off the last piece played
   * NOTE: win condition will be within +-3 of the piece last played
   * @param {array} board - 6 x 7 matrix of spaces, 0 empty, 1 red, 2 black
   * @param {number} row - row location of play
   * @param {number} col - col location of play
   */
  evalConnect4: function(board, row, col) {
    // variables to track streaks
    let vertical = [0, 0, 0];
    let horizontal = [0, 0, 0];
    let diagDown = [0, 0, 0];
    let diagUp = [0, 0, 0];
    // win will be contained w/in +-3 of the token placed
    for (let i = -3; i <= 3; i += 1) {
      // check for streaks
      helpEvalConnect4(board, row + i, col, vertical);
      helpEvalConnect4(board, row, col + i, horizontal);
      helpEvalConnect4(board, row + i, col + i, diagDown);
      helpEvalConnect4(board, row - i, col + i, diagUp);
    }
    return (
      Math.max(vertical[MAX], horizontal[MAX], diagDown[MAX], diagUp[MAX]) >= 4
    );
  },

  /** function to evaluate a connect 4 board based off the last piece played
   * @param {array} board - 6 x 7 matrix of spaces, 0 empty, 1 red, 2 black
   */
  evalRawConnect4: function(board) {
    const len = Math.max(board.length, board[0].length);
    // variables to track streaks
    let line = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    // iterate over looking for 4 in a row
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < len; j += 1) {
        helpEvalConnect4(board, j, i, line[0]);
        helpEvalConnect4(board, i, j, line[1]);
        if (0 <= i && i <= 2) {
          helpEvalConnect4(board, i + j, j, line[2]);
          helpEvalConnect4(board, j, i + j + 1, line[3]);
          helpEvalConnect4(board, 3 + i - j, j, line[4]);
          helpEvalConnect4(board, board.length - 1 - j, 1 + j + i, line[5]);
        }
      }
    }
    return line.reduce((a, c) => c[MAX] >= 4, false);
  }
};

Connect4Board.getNewBoard();
