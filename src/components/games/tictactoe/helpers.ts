import { O, X, EMPTY } from "../../../jotai/tic-tac-toe-atom";

export const getTurn = (n: number): string => (n % 2 ? O : X);

/** function to check if there are 3 in a row
 * @return value of winner and positions for winner */
export function calculateWinner(board: string[] | null[]): {
  winner: string | null;
  winRow: [number?, number?, number?];
} {
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
  return { winner: null, winRow: [] };
}

export default getTurn;
