import React from "react";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  newGame,
  updateTurn,
  updateWinner,
  updateBoard,
  C4Turn,
  immutableBoardCopy,
} from "../../../store/modules/connect4";
import GameBoard from "./GameBoard";

// dp constants
const PIECE = 0;
const STREAK = 1;
const MAX = 2;

/** function to check for match and increment streak / max
 * @param {array} line - dp storage, [PIECE, STREAK, MAX] */
const helpEvalConnect4 = (
  board: number[][],
  row: number,
  col: number,
  line: [number, [number, number][], [number, number][]]
): void => {
  // verify row
  if (board[row] !== undefined) {
    const piece = board[row][col];
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

/* Connect4  ->  GameBoard  ->  Header  ->  Piece
 *                         |->  Board   ->  Piece */
const Connect4: React.FC = () => {
  const { board, turn, winner } = useAppSelector((state) => ({
    ...state.connect4,
  }));
  const dispatch = useAppDispatch();

  /** start a new game, reset the board and helper vars */
  const newC4Game = (): void => {
    dispatch(newGame());
  };

  /** function to evaluate a connect 4 board based off the last piece played
   * NOTE: win condition will be within +-3 of the piece last played - O(N)
   * updates state of winner and board for highlighting */
  const evalConnect4 = (
    row: number,
    col: number,
    evalBoard: number[][]
  ): void => {
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
        dispatch(updateWinner(turn));
        dispatch(updateBoard(tempBoard));
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
      dispatch(updateBoard(tempBoard));
      // update turn
      dispatch(updateTurn(turn === C4Turn.RED ? C4Turn.BLACK : C4Turn.RED));
      // check if win
      evalConnect4(i, col, tempBoard);
    }
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Welcome to Ken&apos;s Connect4 Game
      </Typography>
      <GameBoard
        board={board}
        insert={insert}
        newGame={newC4Game}
        turn={turn}
        winner={winner}
      />
    </>
  );
};

export default Connect4;
