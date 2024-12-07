import { PIECE, STREAK, MAX, C4Turn } from "../../../jotai/connect4-atom";

/** function to check for match and increment streak / max
 * @param {array} line - dp storage, [PIECE, STREAK, MAX] */
const evalConnect4 = (
  board: number[][],
  row: number,
  col: number,
  line: [C4Turn, [number, number][], [number, number][]],
): void => {
  // verify row
  if (board[row] !== undefined) {
    const piece: C4Turn = board[row][col];
    // verify piece
    if (piece !== undefined) {
      // check piece
      if (piece === line[PIECE] && piece !== C4Turn.EMPTY) {
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

export default evalConnect4;
