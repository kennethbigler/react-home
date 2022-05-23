import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  playTurn,
  newGame,
  TicTacToeState,
  X,
  O,
  EMPTY,
} from "../../../store/modules/ticTacToe";
import Header from "./Header";
import History from "./History";
import Board from "./Board";
import { getTurn, calculateWinner } from "./helpers";

const paperStyles: React.CSSProperties = {
  width: 343,
  display: "block",
  margin: "auto",
};

/* TicTacToe  ->  Header
 *           |->  Board  ->  Cell
 *           |->  History */
const TicTacToe: React.FC = () => {
  const { turn, step, history } = useAppSelector((state) => ({
    ...state.ticTacToe,
  }));
  const dispatch = useAppDispatch();

  /** function that modifies board with appropriate turn
   * @param location - location of board click (row * 3 + col) */
  const handleClick = React.useCallback(
    (location: number): void => {
      const newHistory = history.slice(0, step + 1);
      const current = newHistory[step];
      const board = current.board.slice();

      // game is over or cell is full
      if (!calculateWinner(board).winner && board[location] === EMPTY) {
        // place marker, then update turn
        board[location] = turn;

        dispatch(
          playTurn({
            history: newHistory.concat([{ board, location }]),
            step: newHistory.length,
            turn: turn === X ? O : X,
          })
        );
      }
    },
    [dispatch, history, step, turn]
  );

  /** function that resets game back to it's initial state */
  const newTTTGame = React.useCallback((): void => {
    dispatch(newGame());
  }, [dispatch]);

  /** function that modifies board to go back to a previous point in history
   * @param step - desired point in history */
  const jumpToStep = React.useCallback(
    (stepNo: number): void => {
      const newTurn: TicTacToeState = {
        step: stepNo,
        turn: getTurn(stepNo),
        history,
      };
      // Double click will eliminate all other history if there is any
      if (step === stepNo) {
        newTurn.history = history.slice(0, step + 1);
      }
      // update board to previous turn, non-permanent, history exists still
      dispatch(playTurn(newTurn));
    },
    [dispatch, history, step]
  );

  const current = history[step];
  const board = current.board.slice();
  const { winner, winRow } = calculateWinner(board);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Tic-Tac-Toe
      </Typography>
      <Paper elevation={2} style={paperStyles}>
        <Header newGame={newTTTGame} turn={turn} winner={winner} />
        <Board board={board} onClick={handleClick} winRow={winRow} />
      </Paper>
      <History history={history} jumpToStep={jumpToStep} step={step} />
    </>
  );
};

export default TicTacToe;
