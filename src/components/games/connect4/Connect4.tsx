import { memo } from "react";
import { useAtom } from "jotai";
import Typography from "@mui/material/Typography";
import helpEvalConnect4 from "./eval-connect4";
import GameBoard from "./GameBoard";
import connect4Atom, {
  MAX,
  C4Turn,
  immutableBoardCopy,
  newConnect4Game,
} from "../../../jotai/connect4-atom";

/* Connect4  ->  GameBoard  ->  Header  ->  Piece
 *                         |->  Board   ->  Piece */
const Connect4 = memo(() => {
  const [{ turn, board, winner }, setState] = useAtom(connect4Atom);

  /** start a new game, reset the board and helper vars */
  const newGame = (): void => {
    setState(newConnect4Game());
  };

  /** function to evaluate a connect 4 board based off the last piece played
   * NOTE: win condition will be within +-3 of the piece last played - O(N)
   * updates state of winner and board for highlighting */
  const evalConnect4 = (
    row: number,
    col: number,
    evalBoard: number[][],
  ): void => {
    // variables to track streaks
    const dp: [C4Turn, [number, number][], [number, number][]][] = [];
    for (let i = 0; i < 4; i += 1) {
      const a1: [number, number][] = [];
      const a2: [number, number][] = [];
      dp.push([0, a1, a2]);
    }

    // win will be contained w/in +-3 of the token placed
    for (let i = -3; i <= 3; i += 1) {
      // check for streaks
      // vertical
      helpEvalConnect4(evalBoard, row + i, col, dp[0]);
      // horizontal
      helpEvalConnect4(evalBoard, row, col + i, dp[1]);
      // diagonal down
      helpEvalConnect4(evalBoard, row + i, col + i, dp[2]);
      // diagonal up
      helpEvalConnect4(evalBoard, row - i, col + i, dp[3]);
    }

    const tempBoard = evalBoard.reduce(immutableBoardCopy, []);

    dp.forEach((line) => {
      if (line[MAX].length >= 4) {
        line[MAX].forEach((t) => {
          tempBoard[t[0]][t[1]] = 3;
        });
        setState({
          turn,
          winner: turn,
          board: tempBoard,
        });
      }
    });
  };

  /** insert piece into the board, piece falls to the bottom row every time */
  const insert = (col: number) => {
    // check to see if there is an empty spot left
    if (!winner && !board[board.length - 1][col]) {
      let i = 0;
      // look for the lowest empty spot
      while (board[i][col] !== 0) {
        i += 1;
      }
      // insert element
      const tempBoard = board.reduce(immutableBoardCopy, []);
      tempBoard[i][col] = turn;
      setState({
        winner,
        turn: turn === C4Turn.RED ? C4Turn.BLACK : C4Turn.RED,
        board: tempBoard,
      });
      // check if win
      evalConnect4(i, col, tempBoard);
    }
  };

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Ken&apos;s Connect4 Game
      </Typography>
      <GameBoard
        board={board}
        insert={insert}
        newGame={newGame}
        turn={turn}
        winner={winner}
      />
    </>
  );
});

Connect4.displayName = "Connect4";

export default Connect4;
